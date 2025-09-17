import { ForbiddenException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryTranslation } from './entities/category-translation.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductTranslation } from './entities/product-translation.entity';

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(
    @InjectRepository(Category) private readonly catRepo: Repository<Category>,
    @InjectRepository(CategoryTranslation) private readonly catTrRepo: Repository<CategoryTranslation>,
    @InjectRepository(Product) private readonly prodRepo: Repository<Product>,
    @InjectRepository(ProductTranslation) private readonly prodTrRepo: Repository<ProductTranslation>,
  ) {}

  private async generateUniqueSku(prefix = 'SKU'): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const code = `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const exists = await this.prodRepo.findOne({ where: { sku: code } });
      if (!exists) return code;
    }
    // Fallback to timestamp-based
    return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
  }

  private computePricing(input: { price?: string | number | null; compareAt?: string | number | null; discountPct?: string | number | null }): { price?: string; compareAt?: string | null; discountPct?: string } {
    let price = input.price != null ? Number(input.price) : undefined;
    let compareAt = input.compareAt != null ? Number(input.compareAt) : undefined;
    let discount = input.discountPct != null ? Number(input.discountPct) : undefined;
    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

    if (discount != null) discount = clamp(discount, 0, 100);

    if (compareAt != null && discount != null) {
      // price derived from compareAt and discount
      price = Number((compareAt * (1 - discount / 100)).toFixed(2));
    } else if (compareAt != null && price != null) {
      // discount derived
      if (compareAt > 0) discount = clamp(Number((100 * (1 - price / compareAt)).toFixed(2)), 0, 100);
      else discount = 0;
    } else if (price != null && discount != null && (compareAt == null || compareAt === 0)) {
      // compareAt derived
      if (discount < 100) compareAt = Number((price / (1 - discount / 100)).toFixed(2));
      else compareAt = price;
    }

    const out: { price?: string; compareAt?: string | null; discountPct?: string } = {};
    if (price != null) out.price = price.toFixed(2);
    if (compareAt === undefined) {
      // no change
    } else if (compareAt === null) {
      out.compareAt = null;
    } else {
      out.compareAt = Number(compareAt).toFixed(2);
    }
    if (discount != null) out.discountPct = discount.toFixed(2);
    return out;
  }

  async onModuleInit() {
    try {
      // One-time ownership backfill for legacy data: assign vendor_id to categories
      // that have products from exactly one vendor. Also propagate owner to children
      // whose parents are owned by a vendor.
      await this.backfillCategoryOwnership();
    } catch (e: any) {
      // Do not block app startup if backfill fails; log and continue
      // eslint-disable-next-line no-console
      console.error('Category ownership backfill failed:', e?.message || e);
    }
  }

  private async backfillCategoryOwnership() {
    // Assign by single-vendor product usage
    const rows: Array<{ id: string; vendor_id: string }> = await this.catRepo.query(`
      SELECT c.id, MIN(p.vendor_id::text)::uuid AS vendor_id
      FROM categories c
      JOIN products p ON p.category_id = c.id
      WHERE c.vendor_id IS NULL AND p.vendor_id IS NOT NULL
      GROUP BY c.id
      HAVING COUNT(DISTINCT p.vendor_id) = 1;
    `);
    if (rows.length) {
      for (const r of rows) {
        await this.catRepo.update({ id: r.id }, { vendorId: r.vendor_id });
      }
    }
    // Propagate vendor ownership to children where parent is owned
    // Repeat a few times to cover deeper trees
    for (let i = 0; i < 5; i++) {
      const res = await this.catRepo.query(`
        UPDATE categories c
        SET vendor_id = p.vendor_id
        FROM categories p
        WHERE c.parent_id = p.id
          AND c.vendor_id IS NULL
          AND p.vendor_id IS NOT NULL
        RETURNING c.id;
      `);
      if (!res?.length) break;
    }
  }

  listCategories(vendorId: string | null = null) {
    return this.catRepo.find({ where: { isActive: true, vendorId } });
  }

  async listProducts(params: { categoryId?: string; vendorId?: string | null }) {
    const qb = this.prodRepo.createQueryBuilder('p');
    if (params.categoryId) qb.andWhere('p.category_id = :cid', { cid: params.categoryId });
    if (params.vendorId === null) qb.andWhere('p.vendor_id IS NULL');
    else if (params.vendorId) qb.andWhere('p.vendor_id = :vid', { vid: params.vendorId });
    qb.orderBy('p.created_at', 'DESC').limit(100);
    const products = await qb.getMany();
    if (!products.length) return [];
    const ids = products.map((p) => p.id);
    const trs = await this.prodTrRepo.find({ where: { productId: In(ids) } });
    const map = new Map<string, any>();
    for (const p of products) {
      map.set(p.id, {
        id: p.id,
        vendorId: p.vendorId,
        categoryId: p.categoryId || null,
        sku: p.sku,
        status: p.status,
        images: p.images || [],
        unit: p.unit,
        price: Number(p.price),
        compareAt: p.compareAt != null ? Number(p.compareAt) : null,
        discountPct: Number(p.discountPct || 0),
        stock: p.stock,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      });
    }
    for (const tr of trs) {
      const entry = map.get(tr.productId);
      if (!entry) continue;
      if (tr.locale === 'tk') entry.nameTk = tr.name;
      if (tr.locale === 'ru') entry.nameRu = tr.name;
    }
    return Array.from(map.values());
  }

  getProduct(id: string) {
    return this.prodRepo.findOne({ where: { id } });
  }

  async listCategoriesWithCounts(vendorId: string | null = null) {
    let rows: any[];
    if (vendorId === null) {
      const qb = this.catRepo
        .createQueryBuilder('c')
        .leftJoin(Product, 'p', 'p.category_id = c.id')
        .select(['c.id as id', 'c.name as name', 'c.parent_id as parentId'])
        .addSelect('c.isActive', 'isActive')
        .addSelect('c.image_url', 'imageUrl')
        .addSelect('COUNT(p.id)', 'productCount')
        .where('c.vendor_id IS NULL')
        .groupBy('c.id');
      rows = await qb.getRawMany();
    } else {
      const qb = this.catRepo
        .createQueryBuilder('c')
        .leftJoin(Product, 'p', 'p.category_id = c.id AND p.vendor_id = :vid', { vid: vendorId })
        .select(['c.id as id', 'c.name as name', 'c.parent_id as parentId'])
        .addSelect('c.isActive', 'isActive')
        .addSelect('c.image_url', 'imageUrl')
        .addSelect('COUNT(p.id)', 'productCount')
        .where('c.vendor_id = :vid', { vid: vendorId })
        .groupBy('c.id');
      rows = await qb.getRawMany();
    }
    // attach translations
    const ids = rows.map((r) => r.id);
    const translations = await this.catTrRepo.find({ where: { categoryId: In(ids) } });
    const map = new Map<string, any>();
    for (const r of rows) map.set(r.id, { id: r.id, parentId: r.parentId, isActive: !!r.isActive, productCount: Number(r.productCount || 0), name: r.name, imageUrl: r.imageUrl });
    for (const tr of translations) {
      const entry = map.get(tr.categoryId);
      if (!entry) continue;
      if (tr.locale === 'tk') entry.nameTk = tr.name;
      if (tr.locale === 'ru') entry.nameRu = tr.name;
    }
    return Array.from(map.values());
  }

  async getCategoryTree(vendorId: string | null = null) {
    let cats: Category[];
    if (vendorId === null) {
      cats = await this.catRepo
        .createQueryBuilder('c')
        .where('c.vendor_id IS NULL')
        .orderBy('c.name', 'ASC')
        .getMany();
    } else {
      cats = await this.catRepo
        .createQueryBuilder('c')
        .where('c.vendor_id = :vid', { vid: vendorId })
        .orderBy('c.name', 'ASC')
        .getMany();
    }
    const translations = await this.catTrRepo.find();
    const byId = new Map(cats.map((c) => [c.id, { ...c, children: [] as any[] }]));
    const roots: any[] = [];
    for (const c of byId.values()) {
      if (c.parentId && byId.has(c.parentId)) {
        byId.get(c.parentId)!.children.push(c);
      } else {
        roots.push(c);
      }
    }
    for (const tr of translations) {
      const entry = byId.get(tr.categoryId);
      if (!entry) continue;
      if (tr.locale === 'tk') (entry as any).nameTk = tr.name;
      if (tr.locale === 'ru') (entry as any).nameRu = tr.name;
    }
    return roots;
  }

  async createCategory(dto: CreateCategoryDto, vendorId: string | null = null) {
    // Validate parent belongs to same scope if provided
    if (dto.parentId) {
      const parent = await this.catRepo.findOne({ where: { id: dto.parentId } });
      if (!parent || parent.vendorId !== vendorId) {
        throw new ForbiddenException('Invalid parent category for scope');
      }
    }
    const nameBase = dto.name ?? dto.nameTk ?? dto.nameRu ?? 'category';
    const slug = nameBase
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const entity = this.catRepo.create({
      name: nameBase,
      slug,
      parentId: dto.parentId ?? null,
      isActive: dto.isActive ?? true,
      imageUrl: dto.imageUrl ?? null,
      vendorId,
    });
    const saved = await this.catRepo.save(entity);
    const translations: CategoryTranslation[] = [];
    if (dto.nameTk) translations.push(this.catTrRepo.create({ categoryId: saved.id, locale: 'tk', name: dto.nameTk }));
    if (dto.nameRu) translations.push(this.catTrRepo.create({ categoryId: saved.id, locale: 'ru', name: dto.nameRu }));
    if (translations.length) await this.catTrRepo.save(translations);
    return saved;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto, vendorId: string | null = null) {
    const existing = await this.catRepo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');
    if ((existing.vendorId ?? null) !== (vendorId ?? null)) throw new ForbiddenException('Category scope mismatch');
    if (dto.parentId !== undefined && dto.parentId !== null) {
      const parent = await this.catRepo.findOne({ where: { id: dto.parentId } });
      if (!parent || (parent.vendorId ?? null) !== (vendorId ?? null)) {
        throw new ForbiddenException('Invalid parent category for scope');
      }
    }
    const patch: any = {};
    if (dto.name) patch.name = dto.name;
    if (dto.parentId !== undefined) patch.parentId = dto.parentId;
    if (dto.isActive !== undefined) patch.isActive = dto.isActive;
    if (dto.imageUrl !== undefined) patch.imageUrl = dto.imageUrl;
    if (dto.name) {
      patch.slug = dto.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    }
    await this.catRepo.update({ id }, patch);
    const saved = await this.catRepo.findOne({ where: { id } });
    if (dto.nameTk) {
      let t = await this.catTrRepo.findOne({ where: { categoryId: id, locale: 'tk' } });
      if (!t) t = this.catTrRepo.create({ categoryId: id, locale: 'tk', name: dto.nameTk });
      else t.name = dto.nameTk;
      await this.catTrRepo.save(t);
    }
    if (dto.nameRu) {
      let t = await this.catTrRepo.findOne({ where: { categoryId: id, locale: 'ru' } });
      if (!t) t = this.catTrRepo.create({ categoryId: id, locale: 'ru', name: dto.nameRu });
      else t.name = dto.nameRu;
      await this.catTrRepo.save(t);
    }
    return saved;
  }

  async deleteCategory(id: string, vendorId: string | null = null) {
    const existing = await this.catRepo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');
    if ((existing.vendorId ?? null) !== (vendorId ?? null)) throw new ForbiddenException('Category scope mismatch');
    // Reparent children to null before delete, but only within same scope
    await this.catRepo.update({ parentId: id, vendorId }, { parentId: null });
    await this.catRepo.delete({ id });
    return { ok: true };
  }

  // Vendor-scoped Products
  async listVendorProducts(vendorId: string, categoryId?: string) {
    return this.listProducts({ vendorId, categoryId });
  }

  async getVendorProduct(id: string, vendorId: string) {
    const product = await this.prodRepo.findOne({ where: { id, vendorId } });
    if (!product) throw new NotFoundException('Product not found');
    const trs = await this.prodTrRepo.find({ where: { productId: id } });
    const dto: any = {
      id: product.id,
      vendorId: product.vendorId,
      categoryId: product.categoryId || null,
      sku: product.sku,
      status: product.status,
      images: product.images || [],
      unit: product.unit,
      price: Number(product.price),
      compareAt: product.compareAt != null ? Number(product.compareAt) : null,
      discountPct: Number(product.discountPct || 0),
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    for (const tr of trs) {
      if (tr.locale === 'tk') dto.nameTk = tr.name;
      if (tr.locale === 'ru') dto.nameRu = tr.name;
    }
    return dto;
  }

  async createVendorProduct(vendorId: string, dto: CreateProductDto) {
    // Validate category scope if provided
    if (dto.categoryId) {
      const cat = await this.catRepo.findOne({ where: { id: dto.categoryId } });
      if (!cat || (cat.vendorId ?? null) !== (vendorId ?? null)) {
        throw new ForbiddenException('Invalid category for vendor');
      }
    }
    const sku = dto.sku && dto.sku.trim() ? dto.sku.trim() : await this.generateUniqueSku();
    const pricing = this.computePricing({ price: dto.price, compareAt: dto.compareAt ?? null, discountPct: dto.discountPct ?? null });
    const entity = this.prodRepo.create({
      vendorId,
      categoryId: dto.categoryId ?? null,
      sku,
      status: dto.status ?? 'active',
      images: dto.images ?? [],
      unit: dto.unit,
      price: pricing.price ?? (dto.price != null ? String(dto.price) : '0'),
      compareAt: pricing.compareAt ?? null,
      discountPct: pricing.discountPct ?? (dto.discountPct != null ? String(dto.discountPct) : '0'),
      stock: dto.stock,
    });
    const saved = await this.prodRepo.save(entity);
    const trs: ProductTranslation[] = [];
    if (dto.nameTk) trs.push(this.prodTrRepo.create({ productId: saved.id, locale: 'tk', name: dto.nameTk }));
    if (dto.nameRu) trs.push(this.prodTrRepo.create({ productId: saved.id, locale: 'ru', name: dto.nameRu }));
    if (trs.length) await this.prodTrRepo.save(trs);
    return this.getVendorProduct(saved.id, vendorId);
  }

  async updateVendorProduct(id: string, vendorId: string, dto: UpdateProductDto) {
    const existing = await this.prodRepo.findOne({ where: { id, vendorId } });
    if (!existing) throw new NotFoundException('Product not found');
    if (dto.categoryId) {
      const cat = await this.catRepo.findOne({ where: { id: dto.categoryId } });
      if (!cat || (cat.vendorId ?? null) !== (vendorId ?? null)) {
        throw new ForbiddenException('Invalid category for vendor');
      }
    }
    const patch: any = {};
    if (dto.sku !== undefined) patch.sku = dto.sku;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.images !== undefined) patch.images = dto.images;
    if (dto.unit !== undefined) patch.unit = dto.unit;
    if (dto.price !== undefined) patch.price = dto.price;
    if (dto.compareAt !== undefined) patch.compareAt = dto.compareAt;
    if (dto.discountPct !== undefined) patch.discountPct = dto.discountPct;
    if (dto.stock !== undefined) patch.stock = dto.stock;
    if (dto.categoryId !== undefined) patch.categoryId = dto.categoryId;
    // apply pricing normalization if any of price/compareAt/discountPct provided
    if ('price' in patch || 'compareAt' in patch || 'discountPct' in patch) {
      const finalPricing = this.computePricing({ price: patch.price ?? existing.price, compareAt: patch.compareAt ?? existing.compareAt ?? null, discountPct: patch.discountPct ?? existing.discountPct });
      if (finalPricing.price !== undefined) patch.price = finalPricing.price;
      if (finalPricing.compareAt !== undefined) patch.compareAt = finalPricing.compareAt;
      if (finalPricing.discountPct !== undefined) patch.discountPct = finalPricing.discountPct;
    }
    // If SKU cleared, regenerate
    if (patch.sku !== undefined && (!patch.sku || !String(patch.sku).trim())) {
      patch.sku = await this.generateUniqueSku();
    }
    await this.prodRepo.update({ id, vendorId }, patch);

    if (dto.nameTk !== undefined) {
      let t = await this.prodTrRepo.findOne({ where: { productId: id, locale: 'tk' } });
      if (!t) t = this.prodTrRepo.create({ productId: id, locale: 'tk', name: dto.nameTk || '' });
      else t.name = dto.nameTk || '';
      await this.prodTrRepo.save(t);
    }
    if (dto.nameRu !== undefined) {
      let t = await this.prodTrRepo.findOne({ where: { productId: id, locale: 'ru' } });
      if (!t) t = this.prodTrRepo.create({ productId: id, locale: 'ru', name: dto.nameRu || '' });
      else t.name = dto.nameRu || '';
      await this.prodTrRepo.save(t);
    }
    return this.getVendorProduct(id, vendorId);
  }

  async deleteVendorProduct(id: string, vendorId: string) {
    const existing = await this.prodRepo.findOne({ where: { id, vendorId } });
    if (!existing) throw new NotFoundException('Product not found');
    await this.prodRepo.delete({ id, vendorId });
    return { ok: true };
  }

  // Global-scoped Products (vendorId = null)
  async getGlobalProduct(id: string) {
    const product = await this.prodRepo.findOne({ where: { id, vendorId: null as any } });
    if (!product) throw new NotFoundException('Product not found');
    const trs = await this.prodTrRepo.find({ where: { productId: id } });
    const dto: any = {
      id: product.id,
      vendorId: null,
      categoryId: product.categoryId || null,
      sku: product.sku,
      status: product.status,
      images: product.images || [],
      unit: product.unit,
      price: Number(product.price),
      compareAt: product.compareAt != null ? Number(product.compareAt) : null,
      discountPct: Number(product.discountPct || 0),
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    for (const tr of trs) {
      if (tr.locale === 'tk') dto.nameTk = tr.name;
      if (tr.locale === 'ru') dto.nameRu = tr.name;
    }
    return dto;
  }

  async createGlobalProduct(dto: CreateProductDto) {
    if (dto.categoryId) {
      const cat = await this.catRepo.findOne({ where: { id: dto.categoryId } });
      if (!cat || cat.vendorId !== null) throw new ForbiddenException('Invalid global category');
    }
    const sku = dto.sku && dto.sku.trim() ? dto.sku.trim() : await this.generateUniqueSku('GSKU');
    const pricing = this.computePricing({ price: dto.price, compareAt: dto.compareAt ?? null, discountPct: dto.discountPct ?? null });
    const entity = this.prodRepo.create({
      vendorId: null as any,
      categoryId: dto.categoryId ?? null,
      sku,
      status: dto.status ?? 'active',
      images: dto.images ?? [],
      unit: dto.unit,
      price: pricing.price ?? (dto.price != null ? String(dto.price) : '0'),
      compareAt: pricing.compareAt ?? null,
      discountPct: pricing.discountPct ?? (dto.discountPct != null ? String(dto.discountPct) : '0'),
      stock: dto.stock,
    });
    const saved = await this.prodRepo.save(entity);
    const trs: ProductTranslation[] = [];
    if (dto.nameTk) trs.push(this.prodTrRepo.create({ productId: saved.id, locale: 'tk', name: dto.nameTk }));
    if (dto.nameRu) trs.push(this.prodTrRepo.create({ productId: saved.id, locale: 'ru', name: dto.nameRu }));
    if (trs.length) await this.prodTrRepo.save(trs);
    return this.getGlobalProduct(saved.id);
  }

  async updateGlobalProduct(id: string, dto: UpdateProductDto) {
    const existing = await this.prodRepo.findOne({ where: { id, vendorId: null as any } });
    if (!existing) throw new NotFoundException('Product not found');
    if (dto.categoryId) {
      const cat = await this.catRepo.findOne({ where: { id: dto.categoryId } });
      if (!cat || cat.vendorId !== null) throw new ForbiddenException('Invalid global category');
    }
    const patch: any = {};
    if (dto.sku !== undefined) patch.sku = dto.sku;
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.images !== undefined) patch.images = dto.images;
    if (dto.unit !== undefined) patch.unit = dto.unit;
    if (dto.price !== undefined) patch.price = dto.price;
    if (dto.compareAt !== undefined) patch.compareAt = dto.compareAt;
    if (dto.discountPct !== undefined) patch.discountPct = dto.discountPct;
    if (dto.stock !== undefined) patch.stock = dto.stock;
    if (dto.categoryId !== undefined) patch.categoryId = dto.categoryId;
    if ('price' in patch || 'compareAt' in patch || 'discountPct' in patch) {
      const finalPricing = this.computePricing({ price: patch.price ?? existing.price, compareAt: patch.compareAt ?? existing.compareAt ?? null, discountPct: patch.discountPct ?? existing.discountPct });
      if (finalPricing.price !== undefined) patch.price = finalPricing.price;
      if (finalPricing.compareAt !== undefined) patch.compareAt = finalPricing.compareAt;
      if (finalPricing.discountPct !== undefined) patch.discountPct = finalPricing.discountPct;
    }
    if (patch.sku !== undefined && (!patch.sku || !String(patch.sku).trim())) {
      patch.sku = await this.generateUniqueSku('GSKU');
    }
    await this.prodRepo.update({ id, vendorId: null as any }, patch);

    if (dto.nameTk !== undefined) {
      let t = await this.prodTrRepo.findOne({ where: { productId: id, locale: 'tk' } });
      if (!t) t = this.prodTrRepo.create({ productId: id, locale: 'tk', name: dto.nameTk || '' });
      else t.name = dto.nameTk || '';
      await this.prodTrRepo.save(t);
    }
    if (dto.nameRu !== undefined) {
      let t = await this.prodTrRepo.findOne({ where: { productId: id, locale: 'ru' } });
      if (!t) t = this.prodTrRepo.create({ productId: id, locale: 'ru', name: dto.nameRu || '' });
      else t.name = dto.nameRu || '';
      await this.prodTrRepo.save(t);
    }
    return this.getGlobalProduct(id);
  }

  async deleteGlobalProduct(id: string) {
    const existing = await this.prodRepo.findOne({ where: { id, vendorId: null as any } });
    if (!existing) throw new NotFoundException('Product not found');
    await this.prodRepo.delete({ id, vendorId: null as any });
    return { ok: true };
  }
}

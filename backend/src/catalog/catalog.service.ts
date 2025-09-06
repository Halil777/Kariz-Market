import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryTranslation } from './entities/category-translation.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Category) private readonly catRepo: Repository<Category>,
    @InjectRepository(CategoryTranslation) private readonly catTrRepo: Repository<CategoryTranslation>,
    @InjectRepository(Product) private readonly prodRepo: Repository<Product>,
  ) {}

  listCategories() {
    return this.catRepo.find({ where: { isActive: true } });
  }

  listProducts(params: { categoryId?: string; vendorId?: string }) {
    const qb = this.prodRepo.createQueryBuilder('p');
    if (params.categoryId) qb.andWhere('p.categoryId = :cid', { cid: params.categoryId });
    if (params.vendorId) qb.andWhere('p.vendorId = :vid', { vid: params.vendorId });
    qb.orderBy('p.createdAt', 'DESC').limit(50);
    return qb.getMany();
  }

  getProduct(id: string) {
    return this.prodRepo.findOne({ where: { id } });
  }

  async listCategoriesWithCounts() {
    const qb = this.catRepo
      .createQueryBuilder('c')
      .leftJoin(Product, 'p', 'p.category_id = c.id')
      .select(['c.id as id', 'c.name as name', 'c.parent_id as parentId'])
      .addSelect('c.isActive', 'isActive')
      .addSelect('c.image_url', 'imageUrl')
      .addSelect('COUNT(p.id)', 'productCount')
      .groupBy('c.id');
    const rows = await qb.getRawMany();
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

  async getCategoryTree() {
    const cats = await this.catRepo.find({ order: { name: 'ASC' } });
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

  async createCategory(dto: CreateCategoryDto) {
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
    });
    const saved = await this.catRepo.save(entity);
    const translations: CategoryTranslation[] = [];
    if (dto.nameTk) translations.push(this.catTrRepo.create({ categoryId: saved.id, locale: 'tk', name: dto.nameTk }));
    if (dto.nameRu) translations.push(this.catTrRepo.create({ categoryId: saved.id, locale: 'ru', name: dto.nameRu }));
    if (translations.length) await this.catTrRepo.save(translations);
    return saved;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
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

  async deleteCategory(id: string) {
    // Reparent children to null before delete
    await this.catRepo.update({ parentId: id }, { parentId: null });
    await this.catRepo.delete({ id });
    return { ok: true };
  }
}

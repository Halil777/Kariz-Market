"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("./entities/product.entity");
const category_translation_entity_1 = require("./entities/category-translation.entity");
let CatalogService = class CatalogService {
    constructor(catRepo, catTrRepo, prodRepo) {
        this.catRepo = catRepo;
        this.catTrRepo = catTrRepo;
        this.prodRepo = prodRepo;
    }
    listCategories() {
        return this.catRepo.find({ where: { isActive: true } });
    }
    listProducts(params) {
        const qb = this.prodRepo.createQueryBuilder('p');
        if (params.categoryId)
            qb.andWhere('p.categoryId = :cid', { cid: params.categoryId });
        if (params.vendorId)
            qb.andWhere('p.vendorId = :vid', { vid: params.vendorId });
        qb.orderBy('p.createdAt', 'DESC').limit(50);
        return qb.getMany();
    }
    getProduct(id) {
        return this.prodRepo.findOne({ where: { id } });
    }
    async listCategoriesWithCounts() {
        const qb = this.catRepo
            .createQueryBuilder('c')
            .leftJoin(product_entity_1.Product, 'p', 'p.category_id = c.id')
            .select(['c.id as id', 'c.name as name', 'c.parent_id as parentId'])
            .addSelect('c.isActive', 'isActive')
            .addSelect('c.image_url', 'imageUrl')
            .addSelect('COUNT(p.id)', 'productCount')
            .groupBy('c.id');
        const rows = await qb.getRawMany();
        const ids = rows.map((r) => r.id);
        const translations = await this.catTrRepo.find({ where: { categoryId: (0, typeorm_2.In)(ids) } });
        const map = new Map();
        for (const r of rows)
            map.set(r.id, { id: r.id, parentId: r.parentId, isActive: !!r.isActive, productCount: Number(r.productCount || 0), name: r.name, imageUrl: r.imageUrl });
        for (const tr of translations) {
            const entry = map.get(tr.categoryId);
            if (!entry)
                continue;
            if (tr.locale === 'tk')
                entry.nameTk = tr.name;
            if (tr.locale === 'ru')
                entry.nameRu = tr.name;
        }
        return Array.from(map.values());
    }
    async getCategoryTree() {
        const cats = await this.catRepo.find({ order: { name: 'ASC' } });
        const translations = await this.catTrRepo.find();
        const byId = new Map(cats.map((c) => [c.id, { ...c, children: [] }]));
        const roots = [];
        for (const c of byId.values()) {
            if (c.parentId && byId.has(c.parentId)) {
                byId.get(c.parentId).children.push(c);
            }
            else {
                roots.push(c);
            }
        }
        for (const tr of translations) {
            const entry = byId.get(tr.categoryId);
            if (!entry)
                continue;
            if (tr.locale === 'tk')
                entry.nameTk = tr.name;
            if (tr.locale === 'ru')
                entry.nameRu = tr.name;
        }
        return roots;
    }
    async createCategory(dto) {
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
        const translations = [];
        if (dto.nameTk)
            translations.push(this.catTrRepo.create({ categoryId: saved.id, locale: 'tk', name: dto.nameTk }));
        if (dto.nameRu)
            translations.push(this.catTrRepo.create({ categoryId: saved.id, locale: 'ru', name: dto.nameRu }));
        if (translations.length)
            await this.catTrRepo.save(translations);
        return saved;
    }
    async updateCategory(id, dto) {
        const patch = {};
        if (dto.name)
            patch.name = dto.name;
        if (dto.parentId !== undefined)
            patch.parentId = dto.parentId;
        if (dto.isActive !== undefined)
            patch.isActive = dto.isActive;
        if (dto.imageUrl !== undefined)
            patch.imageUrl = dto.imageUrl;
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
            if (!t)
                t = this.catTrRepo.create({ categoryId: id, locale: 'tk', name: dto.nameTk });
            else
                t.name = dto.nameTk;
            await this.catTrRepo.save(t);
        }
        if (dto.nameRu) {
            let t = await this.catTrRepo.findOne({ where: { categoryId: id, locale: 'ru' } });
            if (!t)
                t = this.catTrRepo.create({ categoryId: id, locale: 'ru', name: dto.nameRu });
            else
                t.name = dto.nameRu;
            await this.catTrRepo.save(t);
        }
        return saved;
    }
    async deleteCategory(id) {
        await this.catRepo.update({ parentId: id }, { parentId: null });
        await this.catRepo.delete({ id });
        return { ok: true };
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(category_translation_entity_1.CategoryTranslation)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map
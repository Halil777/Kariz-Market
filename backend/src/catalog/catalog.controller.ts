import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('categories')
  categories() {
    // Global-only categories
    return this.catalog.listCategoriesWithCounts(null);
  }

  @Get('products')
  products(@Query('categoryId') categoryId?: string) {
    // Global-only products
    return this.catalog.listProducts({ categoryId, vendorId: null });
  }

  @Get('products/:id')
  product(@Param('id') id: string) {
    // Global-only product
    return this.catalog.getGlobalProduct(id);
  }

  // Dynamic hierarchical categories
  @Get('categories/tree')
  categoryTree() {
    // Global-only categories
    return this.catalog.getCategoryTree(null);
  }

  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    // Create global category
    return this.catalog.createCategory(dto, null);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    // Update global category
    return this.catalog.updateCategory(id, dto, null);
  }

  @Delete('categories/:id')
  removeCategory(@Param('id') id: string) {
    // Delete global category
    return this.catalog.deleteCategory(id, null);
  }

  // Global product CRUD
  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalog.createGlobalProduct(dto);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalog.updateGlobalProduct(id, dto);
  }

  @Delete('products/:id')
  removeProduct(@Param('id') id: string) {
    return this.catalog.deleteGlobalProduct(id);
  }

  // Vendor-scoped category endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Get('vendor/categories')
  vendorCategories(@Req() req: any) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.listCategoriesWithCounts(vendorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Get('vendor/categories/tree')
  vendorCategoryTree(@Req() req: any) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.getCategoryTree(vendorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Post('vendor/categories')
  createVendorCategory(@Req() req: any, @Body() dto: CreateCategoryDto) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.createCategory(dto, vendorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Patch('vendor/categories/:id')
  updateVendorCategory(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.updateCategory(id, dto, vendorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Delete('vendor/categories/:id')
  removeVendorCategory(@Req() req: any, @Param('id') id: string) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.deleteCategory(id, vendorId);
  }

  // Vendor-scoped product endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Get('vendor/products')
  vendorProducts(@Req() req: any, @Query('categoryId') categoryId?: string) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.listVendorProducts(vendorId, categoryId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Get('vendor/products/:id')
  vendorProduct(@Req() req: any, @Param('id') id: string) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.getVendorProduct(id, vendorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Post('vendor/products')
  createVendorProduct(@Req() req: any, @Body() dto: CreateProductDto) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.createVendorProduct(vendorId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Patch('vendor/products/:id')
  updateVendorProduct(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.updateVendorProduct(id, vendorId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VendorUser)
  @Delete('vendor/products/:id')
  deleteVendorProduct(@Req() req: any, @Param('id') id: string) {
    const vendorId: string | null = req.user?.vendorId || null;
    if (!vendorId) throw new Error('Missing vendorId in token');
    return this.catalog.deleteVendorProduct(id, vendorId);
  }
}

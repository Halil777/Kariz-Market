import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';
import { User } from '../users/entities/user.entity';
import { ProductVariant } from '../catalog/entities/product-variant.entity';
import { Vendor } from '../vendors/entities/vendor.entity';

type SerializeOptions = {
  includeCustomer?: boolean;
  vendorScope?: string | null;
};

type SerializedVendor = { id: string; name: string };

type SerializedCustomer = {
  id: string;
  email: string;
  phone: string | null;
  displayName: string | null;
};

type SerializedItem = {
  id: string;
  variantId: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  productName: string;
  productSku: string | null;
  attributes: Record<string, any> | null;
  vendorId: string | null;
  vendorName: string | null;
};

export type SerializedOrder = {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  currency: string;
  placedAt: string | null;
  updatedAt: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  items: SerializedItem[];
  itemCount: number;
  vendors: SerializedVendor[];
  customer?: SerializedCustomer;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly repo: Repository<Order>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(ProductVariant)
    private readonly variantsRepo: Repository<ProductVariant>,
    @InjectRepository(Vendor) private readonly vendorsRepo: Repository<Vendor>,
  ) {}

  async listForUser(userId: string): Promise<SerializedOrder[]> {
    const orders = await this.repo.find({
      where: { userId },
      order: { placedAt: 'DESC' },
      relations: ['items'],
    });
    return this.serializeOrders(orders, { includeCustomer: false });
  }

  async getForUser(userId: string, id: string): Promise<SerializedOrder> {
    const order = await this.repo.findOne({
      where: { id, userId },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Order not found');
    const [serialized] = await this.serializeOrders([order], { includeCustomer: false });
    return serialized;
  }

  async listForAdmin(params: {
    status?: string;
    query?: string;
    vendorId?: string;
  }): Promise<SerializedOrder[]> {
    const qb = this.repo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'item')
      .orderBy('o.placed_at', 'DESC');

    const status = this.parseStatus(params.status);
    if (status) qb.andWhere('o.status = :status', { status });

    if (params.query) {
      const q = `%${params.query.toLowerCase()}%`;
      qb.andWhere(
        `(
          LOWER(o.id::text) LIKE :q OR
          EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = o.user_id
              AND (
                LOWER(COALESCE(u.email, '')) LIKE :q OR
                LOWER(COALESCE(u.phone, '')) LIKE :q OR
                LOWER(COALESCE(u.display_name, '')) LIKE :q
              )
          )
        )`,
        { q },
      );
    }

    if (params.vendorId) {
      qb.andWhere(
        `EXISTS (
          SELECT 1
          FROM order_items oi
            LEFT JOIN product_variants pv ON pv.id = oi.variant_id
            LEFT JOIN products p ON p.id = pv.product_id
          WHERE oi.order_id = o.id
            AND (oi.vendor_id = :vendorId OR p.vendor_id = :vendorId)
        )`,
        { vendorId: params.vendorId },
      );
    }

    const orders = await qb.getMany();
    return this.serializeOrders(orders, { includeCustomer: true });
  }

  async getForAdmin(id: string): Promise<SerializedOrder> {
    const order = await this.repo.findOne({ where: { id }, relations: ['items'] });
    if (!order) throw new NotFoundException('Order not found');
    const [serialized] = await this.serializeOrders([order], { includeCustomer: true });
    return serialized;
  }

  async listForVendor(
    vendorId: string | null,
    params: { status?: string },
  ): Promise<SerializedOrder[]> {
    if (!vendorId) throw new ForbiddenException('Vendor account required');

    const qb = this.repo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'item')
      .where(
        `EXISTS (
          SELECT 1
          FROM order_items oi
            LEFT JOIN product_variants pv ON pv.id = oi.variant_id
            LEFT JOIN products p ON p.id = pv.product_id
          WHERE oi.order_id = o.id
            AND (oi.vendor_id = :vendorId OR p.vendor_id = :vendorId)
        )`,
        { vendorId },
      )
      .orderBy('o.placed_at', 'DESC');

    const status = this.parseStatus(params.status);
    if (status) qb.andWhere('o.status = :status', { status });

    const orders = await qb.getMany();
    return this.serializeOrders(orders, { includeCustomer: true, vendorScope: vendorId });
  }

  async getForVendor(vendorId: string | null, id: string): Promise<SerializedOrder> {
    if (!vendorId) throw new ForbiddenException('Vendor account required');
    const order = await this.repo.findOne({ where: { id }, relations: ['items'] });
    if (!order) throw new NotFoundException('Order not found');
    const [serialized] = await this.serializeOrders([order], {
      includeCustomer: true,
      vendorScope: vendorId,
    });
    if (!serialized || serialized.items.length === 0) {
      throw new NotFoundException('Order not found');
    }
    return serialized;
  }

  async cancelOrder(userId: string, id: string, reason?: string): Promise<SerializedOrder> {
    const order = await this.repo.findOne({ where: { id, userId }, relations: ['items'] });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status === OrderStatus.Completed) {
      throw new BadRequestException('Completed orders cannot be cancelled');
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestException('Order already cancelled');
    }

    order.status = OrderStatus.Cancelled;
    order.cancellationReason = reason?.trim() ? reason.trim().slice(0, 1000) : null;
    order.cancelledAt = new Date();

    await this.repo.save(order);
    const [serialized] = await this.serializeOrders([order], { includeCustomer: false });
    return serialized;
  }

  private parseStatus(status?: string): OrderStatus | undefined {
    if (!status) return undefined;
    const normalized = status.toLowerCase();
    return (Object.values(OrderStatus) as string[]).includes(normalized)
      ? (normalized as OrderStatus)
      : undefined;
  }

  private async serializeOrders(
    orders: Order[],
    options: SerializeOptions,
  ): Promise<SerializedOrder[]> {
    if (orders.length === 0) return [];

    const allItems = orders.flatMap((o) => o.items || []);
    const variantIds = Array.from(new Set(allItems.map((i) => i.variantId))).filter(Boolean);

    const variants = variantIds.length
      ? await this.variantsRepo.find({
          where: { id: In(variantIds) },
          relations: ['product', 'product.translations'],
        })
      : [];
    const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

    const vendorIds = new Set<string>();
    for (const item of allItems) {
      if (item.vendorId) vendorIds.add(item.vendorId);
      const variant = variantMap.get(item.variantId);
      if (variant?.product?.vendorId) vendorIds.add(variant.product.vendorId);
    }

    const vendorEntities = vendorIds.size
      ? await this.vendorsRepo.findBy({ id: In(Array.from(vendorIds)) })
      : [];
    const vendorMap = new Map(vendorEntities.map((vendor) => [vendor.id, vendor]));

    let userMap = new Map<string, User>();
    if (options.includeCustomer) {
      const userIds = Array.from(new Set(orders.map((o) => o.userId)));
      const users = userIds.length ? await this.usersRepo.findBy({ id: In(userIds) }) : [];
      userMap = new Map(users.map((user) => [user.id, user]));
    }

    const serialized: SerializedOrder[] = [];

    for (const order of orders) {
      const items: SerializedItem[] = [];
      for (const item of order.items || []) {
        const variant = variantMap.get(item.variantId);
        const product = variant?.product;
        const vendorId = item.vendorId || product?.vendorId || null;
        if (options.vendorScope && vendorId !== options.vendorScope) continue;

        const translation = product?.translations?.find((t) => t.locale === 'tk')
          || product?.translations?.find((t) => t.locale === 'ru')
          || product?.translations?.find((t) => t.locale === 'en')
          || product?.translations?.[0];

        const productName =
          translation?.name || product?.sku || variant?.sku || `Variant ${item.variantId}`;

        const vendor = vendorId ? vendorMap.get(vendorId) : undefined;

        items.push({
          id: item.id,
          variantId: item.variantId,
          qty: item.qty,
          unitPrice: Number(item.unitPrice),
          subtotal: Number(item.subtotal),
          productName,
          productSku: variant?.sku || null,
          attributes: variant?.attributes || null,
          vendorId,
          vendorName: vendor?.name || null,
        });
      }

      if (options.vendorScope && items.length === 0) continue;

      const vendors = Array.from(
        new Map(
          items
            .filter((it) => it.vendorId && it.vendorName)
            .map((it) => [it.vendorId!, { id: it.vendorId!, name: it.vendorName! } as SerializedVendor]),
        ).values(),
      );

      const customerEntity = options.includeCustomer ? userMap.get(order.userId) : undefined;

      serialized.push({
        id: order.id,
        userId: order.userId,
        status: order.status,
        total: Number(order.total),
        currency: order.currency,
        placedAt: order.placedAt ? order.placedAt.toISOString() : null,
        updatedAt: order.updatedAt ? order.updatedAt.toISOString() : order.placedAt?.toISOString() ?? null,
        cancellationReason: order.cancellationReason ?? null,
        cancelledAt: order.cancelledAt ? order.cancelledAt.toISOString() : null,
        items,
        itemCount: items.length,
        vendors,
        customer: customerEntity
          ? {
              id: customerEntity.id,
              email: customerEntity.email,
              phone: customerEntity.phone ?? null,
              displayName: customerEntity.displayName ?? null,
            }
          : undefined,
      });
    }

    return serialized;
  }
}


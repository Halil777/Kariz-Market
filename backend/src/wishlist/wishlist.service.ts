import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WishlistItem } from './entities/wishlist.entity'

@Injectable()
export class WishlistService {
  constructor(@InjectRepository(WishlistItem) private readonly repo: Repository<WishlistItem>) {}

  listForUser(userId: string) {
    return this.repo.find({ where: { userId } })
  }

  listForDevice(deviceId: string) {
    return this.repo.find({ where: { deviceId } })
  }

  async toggleForUser(userId: string, productId: string) {
    const existing = await this.repo.findOne({ where: { userId, productId } })
    if (existing) { await this.repo.delete({ id: existing.id }); return { removed: true } }
    const created = this.repo.create({ userId, productId })
    await this.repo.save(created)
    return { added: true }
  }

  async toggleForDevice(deviceId: string, productId: string) {
    const existing = await this.repo.findOne({ where: { deviceId, productId } })
    if (existing) { await this.repo.delete({ id: existing.id }); return { removed: true } }
    const created = this.repo.create({ deviceId, productId })
    await this.repo.save(created)
    return { added: true }
  }

  // Admin reports
  async groupRegistered() {
    return this.repo.query(`
      SELECT user_id as "userId", COUNT(*)::int as count
      FROM wishlists
      WHERE user_id IS NOT NULL
      GROUP BY user_id
      ORDER BY count DESC
    `)
  }

  async groupGuests() {
    return this.repo.query(`
      SELECT device_id as "deviceId", COUNT(*)::int as count
      FROM wishlists
      WHERE device_id IS NOT NULL
      GROUP BY device_id
      ORDER BY count DESC
    `)
  }
}


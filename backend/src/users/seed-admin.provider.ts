import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { UsersService } from './users.service'
import { Role } from '../common/enums/role.enum'
import * as bcrypt from 'bcrypt'

@Injectable()
export class SeedAdminProvider implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedAdminProvider.name)
  constructor(private readonly users: UsersService) {}

  async onApplicationBootstrap() {
    const email = process.env.SEED_ADMIN_EMAIL || 'kariz@gmail.com'
    const password = process.env.SEED_ADMIN_PASSWORD || '12345!'
    try {
      const existing = await this.users.findByEmail(email)
      if (existing) {
        this.logger.log(`Admin user exists: ${email}`)
        return
      }
      const hash = await bcrypt.hash(password, 10)
      await this.users.create({
        email,
        passwordHash: hash,
        role: Role.SuperAdmin,
        isActive: true,
      })
      this.logger.log(`Seeded SuperAdmin user: ${email}`)
    } catch (e) {
      this.logger.error('Failed seeding admin user', e as any)
    }
  }
}

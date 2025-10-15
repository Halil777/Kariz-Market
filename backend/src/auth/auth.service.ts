import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  private signAccessToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      vendorId: user.vendorId || null,
    } as any;
    return this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
      expiresIn: process.env.JWT_ACCESS_TTL || '15m',
    });
  }

  private signRefreshToken(user: User) {
    const payload = { sub: user.id, type: 'refresh' };
    return this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
      expiresIn: process.env.JWT_REFRESH_TTL || '7d',
    });
  }

  async issueTokens(user: User) {
    const accessToken = this.signAccessToken(user);
    const refreshToken = this.signRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const entity = this.refreshRepo.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });
    await this.refreshRepo.save(entity);
    return { accessToken, refreshToken };
  }

  async register(payload: { email: string; password: string; phone?: string | null; displayName?: string | null }) {
    const hash = await bcrypt.hash(payload.password, 10);
    const user = await this.users.create({
      email: payload.email,
      passwordHash: hash,
      phone: payload.phone?.trim() || null,
      displayName: payload.displayName?.trim() || null,
      role: Role.Customer,
    });
    return this.issueTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.issueTokens(user);
  }

  async refresh(userId: string, token: string) {
    // Verify signature
    try {
      this.jwt.verify(token, { secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret' });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // Check stored hash
    const records = await this.refreshRepo.find({ where: { userId } });
    let match: RefreshToken | null = null;
    for (const r of records) {
      if (await bcrypt.compare(token, r.tokenHash)) {
        match = r;
        break;
      }
    }
    if (!match) throw new UnauthorizedException('Refresh token not recognized');

    // Optionally rotate: delete the used one
    await this.refreshRepo.remove(match);

    const user = (await this.users.findById(userId))!;
    return this.issueTokens(user);
  }
}

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { WishlistService } from './wishlist.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { Role } from '../common/enums/role.enum'

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) { return this.wishlist.listForUser(req.user.id) }

  @UseGuards(JwtAuthGuard)
  @Post('toggle')
  toggle(@Req() req: any, @Body() body: { productId: string }) {
    return this.wishlist.toggleForUser(req.user.id, body.productId)
  }

  // Public (anonymous via deviceId)
  @Post('public/list')
  listPublic(@Body() body: { deviceId: string }) {
    return this.wishlist.listForDevice(body.deviceId)
  }

  @Post('public/toggle')
  togglePublic(@Body() body: { deviceId: string; productId: string }) {
    return this.wishlist.toggleForDevice(body.deviceId, body.productId)
  }

  // Admin reports
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Get('admin/registered')
  registered() { return this.wishlist.groupRegistered() }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Get('admin/guests')
  guests() { return this.wishlist.groupGuests() }
}


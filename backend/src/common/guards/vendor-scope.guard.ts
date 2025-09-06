import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class VendorScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // Basic placeholder: ensure vendor_id on user matches params/body when required
    const userVendorId = req.user?.vendorId;
    const targetVendorId = req.params?.vendorId || req.body?.vendorId;
    if (!targetVendorId) return true; // no explicit target to scope to
    if (!userVendorId) return false;
    return String(userVendorId) === String(targetVendorId);
  }
}


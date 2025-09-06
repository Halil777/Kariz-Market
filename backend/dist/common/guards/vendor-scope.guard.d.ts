import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class VendorScopeGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}

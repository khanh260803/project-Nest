import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEYS } from './role.decorator';
import { IS_PUBLIC } from './public.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}  //reflector là 1 service lấy thông tin từ metadata 
  canActivate(context: ExecutionContext): boolean {
    //lấy các role tử metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_KEYS,
      [context.getHandler(), context.getClass()],
    );
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    //nếu không yêu cầu role nào thì cho phép truy cập
    if (!requiredRoles) {
      return true;
    }
    //lấy thông tin user từ request
    const { user } = context.switchToHttp().getRequest();
    console.log(user.role);
    //kiểm tra xem user có ít nhất 1 role phù hợp không
    return requiredRoles.some((role) => user?.role?.includes(role));
  }
}

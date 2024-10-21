import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLE_KEYS = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLE_KEYS, roles);

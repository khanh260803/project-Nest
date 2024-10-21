// src/types/custom-request.ts
import { UserRole } from '@prisma/client';
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
  };
}

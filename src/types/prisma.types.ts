import { Prisma, PrismaClient } from '@prisma/client';

// Enums
export enum UserRole {
  Admin = 'Admin',
  CompanyUser = 'CompanyUser',
  Member = 'Member',
}

export enum Status {
  inActive = 'inActive',
  Active = 'Active',
}

// Export PrismaClient instance type
export const prisma = new PrismaClient();

// Define types based on Prisma models
export type User = Prisma.UserGetPayload<{}>;
export type Company = Prisma.CompanyGetPayload<{}>;
export type Post = Prisma.PostGetPayload<{}>;
export type Comment = Prisma.CommentGetPayload<{}>;
export type Topic = Prisma.TopicGetPayload<{}>;
export type Tag = Prisma.TagGetPayload<{}>;
export type Like = Prisma.LikeGetPayload<{}>;

// Export PrismaPromise type
export type PrismaPromise<T> = Prisma.PrismaPromise<T>;

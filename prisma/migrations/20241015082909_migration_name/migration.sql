/*
  Warnings:

  - Added the required column `expiredAt` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `expiredAt` DATETIME(3) NOT NULL;

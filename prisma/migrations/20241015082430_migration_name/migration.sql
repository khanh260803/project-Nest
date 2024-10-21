/*
  Warnings:

  - You are about to drop the column `isActive` on the `company` table. All the data in the column will be lost.
  - Added the required column `status` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` DROP COLUMN `isActive`,
    ADD COLUMN `status` ENUM('inActive', 'Active') NOT NULL;

-- AlterTable
ALTER TABLE `topic` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

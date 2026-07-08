/*
  Warnings:

  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isBanned` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive",
DROP COLUMN "isBanned",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

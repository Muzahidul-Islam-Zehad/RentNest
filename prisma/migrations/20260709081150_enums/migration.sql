/*
  Warnings:

  - The `status` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "propertyStatus" AS ENUM ('ACTIVE', 'RENTED', 'UNDER_MAINTENANCE');

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "status",
ADD COLUMN     "status" "propertyStatus" NOT NULL DEFAULT 'ACTIVE';

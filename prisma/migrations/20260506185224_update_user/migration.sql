-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY[]::TEXT[];

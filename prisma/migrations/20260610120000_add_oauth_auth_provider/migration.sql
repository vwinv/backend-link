-- OAuth / Sign in with Google & Apple (déjà appliqué manuellement en base dev)

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'APPLE');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL;
ALTER TABLE "users" ADD COLUMN "authProvider" "AuthProvider" NOT NULL DEFAULT 'LOCAL';
ALTER TABLE "users" ADD COLUMN "providerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_authProvider_providerId_key" ON "users"("authProvider", "providerId");

-- CreateTable
CREATE TABLE "app_update_config" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "latestVersion" TEXT NOT NULL DEFAULT '',
    "minVersion" TEXT NOT NULL DEFAULT '',
    "iosStoreUrl" TEXT NOT NULL DEFAULT '',
    "androidStoreUrl" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_update_config_pkey" PRIMARY KEY ("id")
);

-- Seed singleton row
INSERT INTO "app_update_config" ("id", "latestVersion", "minVersion", "iosStoreUrl", "androidStoreUrl", "message", "createdAt", "updatedAt")
VALUES ('default', '', '', '', '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

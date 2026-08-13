-- Notifications ciblées (campagnes + inbox + tokens push)

CREATE TYPE "NotificationAudience" AS ENUM ('ALL', 'PREMIUM', 'FREE', 'USER_IDS');
CREATE TYPE "NotificationCampaignStatus" AS ENUM ('DRAFT', 'SENDING', 'SENT', 'FAILED');
CREATE TYPE "PushPlatform" AS ENUM ('IOS', 'ANDROID', 'WEB');

CREATE TABLE "device_push_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" "PushPlatform" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "device_push_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "device_push_tokens_token_key" ON "device_push_tokens"("token");
CREATE INDEX "device_push_tokens_userId_idx" ON "device_push_tokens"("userId");

ALTER TABLE "device_push_tokens"
  ADD CONSTRAINT "device_push_tokens_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "notification_campaigns" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "audience" "NotificationAudience" NOT NULL,
    "userIds" JSONB NOT NULL DEFAULT '[]',
    "status" "NotificationCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "targetCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "pushAttempted" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "notification_campaigns_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "notification_campaigns_createdAt_idx" ON "notification_campaigns"("createdAt");
CREATE INDEX "notification_campaigns_status_idx" ON "notification_campaigns"("status");

ALTER TABLE "notification_campaigns"
  ADD CONSTRAINT "notification_campaigns_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "user_notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "campaignId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_notifications_userId_createdAt_idx" ON "user_notifications"("userId", "createdAt");
CREATE INDEX "user_notifications_userId_isRead_idx" ON "user_notifications"("userId", "isRead");
CREATE INDEX "user_notifications_campaignId_idx" ON "user_notifications"("campaignId");

ALTER TABLE "user_notifications"
  ADD CONSTRAINT "user_notifications_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_notifications"
  ADD CONSTRAINT "user_notifications_campaignId_fkey"
  FOREIGN KEY ("campaignId") REFERENCES "notification_campaigns"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

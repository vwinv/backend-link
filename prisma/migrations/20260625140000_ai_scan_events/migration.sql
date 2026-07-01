-- CreateTable
CREATE TABLE "ai_scan_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_scan_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_scan_events_userId_createdAt_idx" ON "ai_scan_events"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ai_scan_events"
ADD CONSTRAINT "ai_scan_events_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

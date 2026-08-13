import { Module } from '@nestjs/common';
import { FcmPushService } from './fcm-push.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, FcmPushService],
  exports: [NotificationsService, FcmPushService],
})
export class NotificationsModule {}

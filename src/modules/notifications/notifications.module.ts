import { Module } from '@nestjs/common';
import { FcmPushService } from './fcm-push.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PushProgramScheduler } from './push-program.scheduler';
import { PushProgramService } from './push-program.service';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    FcmPushService,
    PushProgramService,
    PushProgramScheduler,
  ],
  exports: [NotificationsService, FcmPushService, PushProgramService],
})
export class NotificationsModule {}

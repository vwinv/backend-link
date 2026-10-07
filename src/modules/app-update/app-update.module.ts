import { Module } from '@nestjs/common';
import { AppUpdateService } from './app-update.service';
import { AppVersionController } from './app-version.controller';

@Module({
  controllers: [AppVersionController],
  providers: [AppUpdateService],
  exports: [AppUpdateService],
})
export class AppUpdateModule {}

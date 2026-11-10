import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { CvImportService } from './cv-import.service';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';

@Module({
  imports: [AuthModule, SubscriptionsModule],
  controllers: [PortfoliosController],
  providers: [PortfoliosService, CvImportService],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}

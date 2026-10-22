import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';

@Module({
  imports: [AuthModule, SubscriptionsModule],
  controllers: [PortfoliosController],
  providers: [PortfoliosService],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}

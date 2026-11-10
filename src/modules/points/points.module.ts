import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PointsController } from './points.controller';
import { PointsRedeemService } from './points-redeem.service';
import { PointsService } from './points.service';

@Module({
  imports: [AuthModule, forwardRef(() => SubscriptionsModule)],
  controllers: [PointsController],
  providers: [PointsService, PointsRedeemService],
  exports: [PointsService],
})
export class PointsModule {}

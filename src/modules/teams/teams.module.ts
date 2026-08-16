import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CardsModule } from '../cards/cards.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [AuthModule, SubscriptionsModule, CardsModule, UploadsModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { TeamsModule } from '../teams/teams.module';
import { EspaceController } from './espace.controller';
import { EspaceService } from './espace.service';

@Module({
  imports: [AuthModule, TeamsModule, SubscriptionsModule],
  controllers: [EspaceController],
  providers: [EspaceService],
})
export class EspaceModule {}

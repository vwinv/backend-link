import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ContactsModule } from '../contacts/contacts.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [AuthModule, ContactsModule, SubscriptionsModule, UploadsModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}

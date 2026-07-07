import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CardsModule } from './modules/cards/cards.module';
import { PortfoliosModule } from './modules/portfolios/portfolios.module';
import { SharingModule } from './modules/sharing/sharing.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ScansModule } from './modules/scans/scans.module';
import { TeamsModule } from './modules/teams/teams.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { MailModule } from './modules/mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    CardsModule,
    PortfoliosModule,
    SubscriptionsModule,
    ScansModule,
    ContactsModule,
    SharingModule,
    WalletModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

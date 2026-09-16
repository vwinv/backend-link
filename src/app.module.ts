import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { HealthController } from './health/health.controller';
import { AdminModule } from './modules/admin/admin.module';
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
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SupportModule } from './modules/support/support.module';
import { EspaceModule } from './modules/espace/espace.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('throttle.ttlMs', 60_000),
          limit: config.get<number>('throttle.limit', 120),
        },
      ],
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    AdminModule,
    UsersModule,
    TeamsModule,
    EspaceModule,
    CardsModule,
    PortfoliosModule,
    SubscriptionsModule,
    ScansModule,
    ContactsModule,
    SharingModule,
    WalletModule,
    UploadsModule,
    NotificationsModule,
    SupportModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

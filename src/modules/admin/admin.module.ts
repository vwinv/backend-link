import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminAccessGuard } from '../auth/guards/admin-access.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AppUpdateModule } from '../app-update/app-update.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdminClientsService } from './admin-clients.service';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminNotificationsService } from './admin-notifications.service';
import { AdminOffersService } from './admin-offers.service';
import { AdminRolesService } from './admin-roles.service';
import { AdminSubscriptionsService } from './admin-subscriptions.service';
import { AdminSupportService } from './admin-support.service';
import { AdminUsersService } from './admin-users.service';
import { AdminController } from './admin.controller';
import { SupportModule } from '../support/support.module';

@Module({
  imports: [AuthModule, SupportModule, NotificationsModule, AppUpdateModule],
  controllers: [AdminController],
  providers: [
    AdminDashboardService,
    AdminUsersService,
    AdminClientsService,
    AdminSubscriptionsService,
    AdminOffersService,
    AdminNotificationsService,
    AdminSupportService,
    AdminRolesService,
    AdminAccessGuard,
    PermissionsGuard,
  ],
})
export class AdminModule {}

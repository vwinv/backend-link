import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUserPayload } from '../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { AdminAccessGuard } from '../auth/guards/admin-access.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AdminClientsService } from './admin-clients.service';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminNotificationsService } from './admin-notifications.service';
import { AdminOffersService } from './admin-offers.service';
import { AdminRolesService } from './admin-roles.service';
import { AdminSubscriptionsService } from './admin-subscriptions.service';
import { AdminSupportService } from './admin-support.service';
import { AdminUsersService } from './admin-users.service';
import { AdminClientsQueryDto } from './dto/admin-clients-query.dto';
import { AdminNotificationsQueryDto } from './dto/admin-notifications-query.dto';
import { AdminSubscriptionsQueryDto } from './dto/admin-subscriptions-query.dto';
import { CreateAdminSubscriptionDto } from './dto/create-admin-subscription.dto';
import { UpdateAdminSubscriptionDto } from './dto/update-admin-subscription.dto';
import { AdminSupportTicketsQueryDto } from './dto/admin-support-tickets-query.dto';
import { AdminUsersQueryDto } from './dto/admin-users-query.dto';
import {
  CreateAdminOfferDto,
  CreateAdminOfferPriceDto,
} from './dto/create-admin-offer.dto';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { CreateBackofficeUserDto } from './dto/create-backoffice-user.dto';
import { CreateNotificationCampaignDto } from './dto/create-notification-campaign.dto';
import { ReplySupportTicketDto } from './dto/reply-support-ticket.dto';
import { UpdateAdminClientDto } from './dto/update-admin-client.dto';
import {
  UpdateAdminOfferDto,
  UpdateAdminOfferPriceDto,
} from './dto/update-admin-offer.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
import { UpdateBackofficeUserDto } from './dto/update-backoffice-user.dto';
import { ResetBackofficePasswordDto } from './dto/reset-backoffice-password.dto';
import { assertSuperAdmin } from './admin-super-admin';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminAccessGuard, PermissionsGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly dashboardService: AdminDashboardService,
    private readonly usersService: AdminUsersService,
    private readonly clientsService: AdminClientsService,
    private readonly subscriptionsService: AdminSubscriptionsService,
    private readonly offersService: AdminOffersService,
    private readonly notificationsService: AdminNotificationsService,
    private readonly supportService: AdminSupportService,
    private readonly rolesService: AdminRolesService,
  ) {}

  @Get('dashboard')
  @RequirePermissions('dashboard.view')
  @ApiOperation({ summary: 'Statistiques plateforme (backoffice)' })
  getDashboard() {
    return this.dashboardService.getStats();
  }

  @Get('permissions')
  @RequirePermissions('roles.view')
  @ApiOperation({ summary: 'Catalogue des permissions / modules' })
  listPermissions() {
    return this.rolesService.listPermissions();
  }

  @Get('roles')
  @RequirePermissions('roles.view')
  @ApiOperation({ summary: 'Liste des rôles backoffice' })
  listRoles() {
    return this.rolesService.listRoles();
  }

  @Get('roles/:id')
  @RequirePermissions('roles.view')
  @ApiOperation({ summary: 'Détail d’un rôle backoffice' })
  getRole(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post('roles')
  @RequirePermissions('roles.create')
  @ApiOperation({ summary: 'Créer un rôle backoffice' })
  createRole(
    @Body() dto: CreateAdminRoleDto,
    @CurrentUser() actor: AuthUserPayload,
  ) {
    return this.rolesService.create(dto, actor);
  }

  @Patch('roles/:id')
  @RequirePermissions('roles.update')
  @ApiOperation({ summary: 'Modifier un rôle backoffice' })
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateAdminRoleDto,
    @CurrentUser() actor: AuthUserPayload,
  ) {
    return this.rolesService.update(id, dto, actor);
  }

  @Delete('roles/:id')
  @RequirePermissions('roles.delete')
  @ApiOperation({ summary: 'Supprimer un rôle backoffice' })
  deleteRole(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Get('clients')
  @RequirePermissions('clients.view')
  @ApiOperation({ summary: 'Liste des clients (utilisateurs app)' })
  listClients(@Query() query: AdminClientsQueryDto) {
    return this.clientsService.list(query);
  }

  @Get('clients/:id')
  @RequirePermissions('clients.view')
  @ApiOperation({ summary: 'Détail d’un client app' })
  getClient(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch('clients/:id')
  @RequirePermissions('clients.update')
  @ApiOperation({ summary: 'Modifier un client app' })
  updateClient(
    @Param('id') id: string,
    @Body() dto: UpdateAdminClientDto,
  ) {
    return this.clientsService.update(id, dto);
  }

  @Delete('clients/:id')
  @RequirePermissions('clients.delete')
  @ApiOperation({ summary: 'Supprimer un client app (Super Admin)' })
  deleteClient(
    @Param('id') id: string,
    @CurrentUser() actor: AuthUserPayload,
  ) {
    assertSuperAdmin(actor);
    return this.clientsService.remove(id);
  }

  @Get('subscriptions/stats')
  @RequirePermissions('subscriptions.view')
  @ApiOperation({ summary: 'Statistiques des abonnements' })
  getSubscriptionsStats() {
    return this.subscriptionsService.getStats();
  }

  @Get('subscriptions/offers')
  @RequirePermissions('subscriptions.view')
  @ApiOperation({ summary: 'Offres premium (filtres)' })
  listSubscriptionOffers() {
    return this.subscriptionsService.listOffers();
  }

  @Get('subscriptions')
  @RequirePermissions('subscriptions.view')
  @ApiOperation({ summary: 'Liste des abonnements' })
  listSubscriptions(@Query() query: AdminSubscriptionsQueryDto) {
    return this.subscriptionsService.list(query);
  }

  @Post('subscriptions')
  @RequirePermissions('subscriptions.create')
  @ApiOperation({ summary: 'Créer / attribuer un abonnement à un client' })
  createSubscription(@Body() dto: CreateAdminSubscriptionDto) {
    return this.subscriptionsService.create(dto);
  }

  @Get('subscriptions/:id')
  @RequirePermissions('subscriptions.view')
  @ApiOperation({ summary: 'Détail d’un abonnement' })
  getSubscription(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch('subscriptions/:id')
  @RequirePermissions('subscriptions.update')
  @ApiOperation({ summary: 'Modifier un abonnement' })
  updateSubscription(
    @Param('id') id: string,
    @Body() dto: UpdateAdminSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, dto);
  }

  @Delete('subscriptions/:id')
  @RequirePermissions('subscriptions.delete')
  @ApiOperation({ summary: 'Supprimer un abonnement' })
  deleteSubscription(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

  @Get('offers')
  @RequirePermissions('subscriptions.view')
  @ApiOperation({ summary: 'Liste des offres (catalogue + gratuite)' })
  listOffersAdmin() {
    return this.offersService.list();
  }

  @Get('offers/:id')
  @RequirePermissions('subscriptions.view')
  @ApiOperation({ summary: 'Détail d’une offre' })
  getOffer(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Post('offers')
  @RequirePermissions('subscriptions.create')
  @ApiOperation({ summary: 'Créer une offre' })
  createOffer(@Body() dto: CreateAdminOfferDto) {
    return this.offersService.create(dto);
  }

  @Patch('offers/:id')
  @RequirePermissions('subscriptions.update')
  @ApiOperation({ summary: 'Modifier une offre' })
  updateOffer(@Param('id') id: string, @Body() dto: UpdateAdminOfferDto) {
    return this.offersService.update(id, dto);
  }

  @Delete('offers/:id')
  @RequirePermissions('subscriptions.delete')
  @ApiOperation({ summary: 'Supprimer / désactiver une offre' })
  deleteOffer(@Param('id') id: string) {
    return this.offersService.remove(id);
  }

  @Post('offers/:id/prices')
  @RequirePermissions('subscriptions.create')
  @ApiOperation({ summary: 'Ajouter un tarif à une offre' })
  createOfferPrice(
    @Param('id') id: string,
    @Body() dto: CreateAdminOfferPriceDto,
  ) {
    return this.offersService.createPrice(id, dto);
  }

  @Patch('offers/:offerId/prices/:priceId')
  @RequirePermissions('subscriptions.update')
  @ApiOperation({ summary: 'Modifier un tarif' })
  updateOfferPrice(
    @Param('offerId') offerId: string,
    @Param('priceId') priceId: string,
    @Body() dto: UpdateAdminOfferPriceDto,
  ) {
    return this.offersService.updatePrice(offerId, priceId, dto);
  }

  @Delete('offers/:offerId/prices/:priceId')
  @RequirePermissions('subscriptions.delete')
  @ApiOperation({ summary: 'Supprimer / désactiver un tarif' })
  deleteOfferPrice(
    @Param('offerId') offerId: string,
    @Param('priceId') priceId: string,
  ) {
    return this.offersService.removePrice(offerId, priceId);
  }

  @Get('support/stats')
  @RequirePermissions('support.view')
  @ApiOperation({ summary: 'Statistiques des tickets support' })
  getSupportStats() {
    return this.supportService.getStats();
  }

  @Get('support/tickets')
  @RequirePermissions('support.view')
  @ApiOperation({ summary: 'Liste des tickets support' })
  listSupportTickets(@Query() query: AdminSupportTicketsQueryDto) {
    return this.supportService.list(query);
  }

  @Get('support/tickets/:id')
  @RequirePermissions('support.view')
  @ApiOperation({ summary: 'Détail d’un ticket support' })
  getSupportTicket(@Param('id') id: string) {
    return this.supportService.findOne(id);
  }

  @Post('support/tickets/:id/reply')
  @RequirePermissions('support.reply')
  @ApiOperation({ summary: 'Répondre à un ticket (e-mail + lien de clôture)' })
  replySupportTicket(
    @Param('id') id: string,
    @Body() dto: ReplySupportTicketDto,
    @CurrentUser() actor: AuthUserPayload,
  ) {
    return this.supportService.reply(id, dto, actor.userId);
  }

  @Get('notifications/stats')
  @RequirePermissions('notifications.view')
  @ApiOperation({ summary: 'Statistiques des notifications' })
  getNotificationsStats() {
    return this.notificationsService.getStats();
  }

  @Get('notifications')
  @RequirePermissions('notifications.view')
  @ApiOperation({ summary: 'Historique des campagnes de notifications' })
  listNotifications(@Query() query: AdminNotificationsQueryDto) {
    return this.notificationsService.list(query);
  }

  @Get('notifications/:id')
  @RequirePermissions('notifications.view')
  @ApiOperation({ summary: 'Détail d’une campagne' })
  getNotification(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Post('notifications')
  @RequirePermissions('notifications.send')
  @ApiOperation({ summary: 'Créer et envoyer une notification ciblée' })
  createNotification(
    @Body() dto: CreateNotificationCampaignDto,
    @CurrentUser() actor: AuthUserPayload,
  ) {
    return this.notificationsService.createAndSend(dto, actor.userId);
  }

  @Get('users')
  @RequirePermissions('backoffice_users.view')
  @ApiOperation({ summary: 'Liste des utilisateurs backoffice' })
  listUsers(@Query() query: AdminUsersQueryDto) {
    return this.usersService.list(query);
  }

  @Get('users/:id')
  @RequirePermissions('backoffice_users.view')
  @ApiOperation({ summary: 'Détail d’un utilisateur backoffice' })
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('users')
  @RequirePermissions('backoffice_users.create')
  @ApiOperation({ summary: 'Créer un utilisateur backoffice (Super Admin)' })
  createUser(
    @Body() dto: CreateBackofficeUserDto,
    @CurrentUser() actor: AuthUserPayload,
  ) {
    return this.usersService.create(dto, actor);
  }

  @Patch('users/:id')
  @RequirePermissions('backoffice_users.update')
  @ApiOperation({ summary: 'Modifier un utilisateur backoffice' })
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateBackofficeUserDto,
    @CurrentUser() actor: AuthUserPayload,
  ) {
    return this.usersService.update(id, dto, actor);
  }

  @Post('users/:id/reset-password')
  @RequirePermissions('backoffice_users.update')
  @ApiOperation({
    summary: 'Réinitialiser le mot de passe d’un utilisateur (Super Admin)',
  })
  resetUserPassword(
    @Param('id') id: string,
    @Body() dto: ResetBackofficePasswordDto,
    @CurrentUser() actor: AuthUserPayload,
  ) {
    return this.usersService.resetPassword(id, dto, actor);
  }
}

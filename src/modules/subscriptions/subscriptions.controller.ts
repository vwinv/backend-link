import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';
import {
  CheckoutSessionResponseDto,
  PaymentConfigResponseDto,
} from './dto/payment-config-response.dto';
import { PremiumOfferResponseDto } from './dto/premium-offer-response.dto';
import { SoftPaySubscriptionDto } from './dto/softpay-subscription.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('config')
  @ApiOperation({
    summary:
      'Configuration paiement (PayDunya, masquage in-app, ou mode test)',
  })
  @ApiResponse({ status: 200, type: PaymentConfigResponseDto })
  getPaymentConfig() {
    return this.subscriptionsService.getPaymentConfig();
  }

  @Get('offers')
  @ApiOperation({ summary: 'Lister les offres Premium disponibles' })
  @ApiResponse({ status: 200, type: [PremiumOfferResponseDto] })
  getOffers() {
    return this.subscriptionsService.getOffers();
  }

  @Get('plans')
  @ApiOperation({ summary: 'Lister les forfaits disponibles' })
  @ApiResponse({ status: 200, type: [PremiumOfferResponseDto] })
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Récupérer l'abonnement actif de l'utilisateur" })
  @ApiResponse({ status: 200, type: SubscriptionResponseDto })
  getMySubscription(@CurrentUser() user: { userId: string }) {
    return this.subscriptionsService.getMySubscription(user.userId);
  }

  @Get('plans/:slug')
  @ApiOperation({ summary: 'Récupérer un forfait par slug' })
  getPlan(@Param('slug') slug: string) {
    return this.subscriptionsService.getPlan(slug);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une facture PayDunya (préalable SoftPay)' })
  @ApiResponse({ status: 201, type: CheckoutSessionResponseDto })
  createCheckout(
    @CurrentUser() user: { userId: string },
    @Body() dto: CheckoutDto,
  ) {
    return this.subscriptionsService.createCheckout(user.userId, dto);
  }

  @Post('softpay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'SoftPay Wave / Orange Money / Free Money (Sénégal)',
  })
  softPay(
    @CurrentUser() user: { userId: string },
    @Body() dto: SoftPaySubscriptionDto,
  ) {
    return this.subscriptionsService.softPay(user.userId, dto);
  }

  @Get('paydunya/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Confirmer un paiement PayDunya (repli si IPN non reçu)',
  })
  confirmPaydunya(
    @CurrentUser() user: { userId: string },
    @Query('invoiceToken') invoiceToken: string,
  ) {
    return this.subscriptionsService.confirmPaydunyaPayment(
      user.userId,
      invoiceToken,
    );
  }

  @Post('signup-request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Enregistrer une demande d’inscription (paiement masqué, review Apple)',
  })
  createSignupRequest(
    @CurrentUser() user: { userId: string },
    @Body() dto: SubscribeDto,
  ) {
    return this.subscriptionsService.createSignupRequest(user.userId, dto);
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Souscrire sans paiement (tests uniquement, si PayDunya non configuré)',
  })
  @ApiResponse({ status: 201, type: SubscriptionResponseDto })
  subscribe(
    @CurrentUser() user: { userId: string },
    @Body() dto: SubscribeDto,
  ) {
    return this.subscriptionsService.subscribe(user.userId, dto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Annuler l'abonnement" })
  cancel() {
    return this.subscriptionsService.cancel();
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook Stripe (legacy)' })
  webhook(@Req() request: RawBodyRequest<Request>) {
    const signature = request.headers['stripe-signature'];
    const payload = request.rawBody;

    if (!payload) {
      throw new Error('Corps brut du webhook manquant');
    }

    return this.subscriptionsService.handleStripeWebhook(
      payload,
      typeof signature === 'string' ? signature : undefined,
    );
  }
}

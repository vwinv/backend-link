import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PremiumOfferResponseDto } from './dto/premium-offer-response.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

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

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Souscrire à une offre Premium' })
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
  @ApiOperation({ summary: 'Webhook paiement (Stripe, etc.)' })
  webhook() {
    return this.subscriptionsService.handleWebhook();
  }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContactsService } from './contacts.service';
import { ExchangeContactDto } from './dto/exchange-contact.dto';

@ApiTags('Contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les contacts (échanges Link + scans IA)',
  })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.contactsService.findAll(user.userId);
  }

  @Post('exchange')
  @ApiOperation({ summary: 'Enregistrer un contact via échange de carte Link' })
  exchange(
    @CurrentUser() user: { userId: string },
    @Body() dto: ExchangeContactDto,
  ) {
    return this.contactsService.exchangeFromCardSlug(user.userId, dto.cardSlug);
  }
}

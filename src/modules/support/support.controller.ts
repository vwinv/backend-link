import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { SupportService } from './support.service';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  @ApiOperation({ summary: 'Créer un ticket support (landing)' })
  createTicket(@Body() dto: CreateSupportTicketDto) {
    return this.supportService.createTicket(dto);
  }

  @Post('tickets/close/:token')
  @ApiOperation({ summary: 'Clôturer un ticket via le token e-mail (JSON)' })
  closeTicket(@Param('token') token: string) {
    return this.supportService.closeByToken(token);
  }

  @Get('tickets/close/:token')
  @ApiOperation({ summary: 'Clôturer un ticket via le token e-mail (JSON)' })
  closeTicketGet(@Param('token') token: string) {
    return this.supportService.closeByToken(token);
  }
}

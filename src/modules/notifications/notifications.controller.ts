import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUserPayload } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { UnregisterPushTokenDto } from './dto/unregister-push-token.dto';
import { NotificationsService } from './notifications.service';

class NotificationsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30;
}

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('notifications')
  @ApiOperation({ summary: 'Inbox notifications de l’utilisateur connecté' })
  listMine(
    @CurrentUser() user: AuthUserPayload,
    @Query() query: NotificationsQueryDto,
  ) {
    return this.notificationsService.listMine(
      user.userId,
      query.page ?? 1,
      query.limit ?? 30,
    );
  }

  @Get('notifications/unread-count')
  @ApiOperation({ summary: 'Nombre de notifications non lues' })
  unreadCount(@CurrentUser() user: AuthUserPayload) {
    return this.notificationsService.unreadCount(user.userId);
  }

  @Patch('notifications/:id/read')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  markRead(
    @CurrentUser() user: AuthUserPayload,
    @Param('id') id: string,
  ) {
    return this.notificationsService.markRead(user.userId, id);
  }

  @Post('notifications/read-all')
  @ApiOperation({ summary: 'Tout marquer comme lu' })
  markAllRead(@CurrentUser() user: AuthUserPayload) {
    return this.notificationsService.markAllRead(user.userId);
  }

  @Put('devices/push-token')
  @ApiOperation({ summary: 'Enregistrer / mettre à jour un token push' })
  registerToken(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: RegisterPushTokenDto,
  ) {
    return this.notificationsService.registerPushToken(
      user.userId,
      dto.token,
      dto.platform,
    );
  }

  @Delete('devices/push-token')
  @ApiOperation({ summary: 'Supprimer un token push' })
  unregisterToken(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: UnregisterPushTokenDto,
  ) {
    return this.notificationsService.unregisterPushToken(
      user.userId,
      dto.token,
    );
  }
}

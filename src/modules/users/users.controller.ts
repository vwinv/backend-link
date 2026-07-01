import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  getMe() {
    return this.usersService.getMe();
  }

  @Patch('me')
  @ApiOperation({ summary: 'Mettre à jour le profil utilisateur' })
  updateMe(@Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer son compte' })
  deleteMe(@CurrentUser() user: { userId: string }) {
    return this.usersService.deleteMe(user.userId);
  }
}

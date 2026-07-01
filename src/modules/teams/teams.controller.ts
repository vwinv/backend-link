import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamMembersResponseDto } from './dto/team-members-response.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une équipe' })
  create(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateTeamDto,
  ) {
    return this.teamsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les équipes de l\'utilisateur' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.teamsService.findAllForUser(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une équipe par ID' })
  findOne(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.teamsService.findOneForUser(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une équipe' })
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une équipe' })
  remove(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.teamsService.remove(user.userId, id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Lister les membres d\'une équipe' })
  @ApiResponse({ status: 200, type: TeamMembersResponseDto })
  getMembers(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.teamsService.getMembers(user.userId, id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Ajouter un membre à l\'équipe' })
  addMember(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.teamsService.addMember(user.userId, id, dto);
  }

  @Patch(':id/members/:memberId')
  @ApiOperation({ summary: 'Modifier le rôle d\'un membre' })
  updateMemberRole(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.teamsService.updateMemberRole(user.userId, id, memberId, dto);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Retirer un membre de l\'équipe' })
  removeMember(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamsService.removeMember(user.userId, id, memberId);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getMe() {
    // TODO: récupérer l'utilisateur connecté
    return { message: 'getMe' };
  }

  updateMe(dto: UpdateUserDto) {
    // TODO: mettre à jour le profil
    return { message: 'updateMe', dto };
  }

  findOne(id: string) {
    // TODO: récupérer un utilisateur
    return { message: 'findOne', id };
  }

  async deleteMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }
}

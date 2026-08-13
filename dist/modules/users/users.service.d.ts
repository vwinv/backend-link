import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMe(): {
        message: string;
    };
    updateMe(dto: UpdateUserDto): {
        message: string;
        dto: UpdateUserDto;
    };
    findOne(id: string): {
        message: string;
        id: string;
    };
    deleteMe(userId: string): Promise<void>;
}

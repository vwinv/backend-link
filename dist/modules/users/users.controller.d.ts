import { UpdatePreferredLocaleDto } from './dto/update-preferred-locale.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(): {
        message: string;
    };
    updateMe(dto: UpdateUserDto): {
        message: string;
        dto: UpdateUserDto;
    };
    updatePreferredLocale(user: {
        userId: string;
    }, dto: UpdatePreferredLocaleDto): Promise<{
        id: string;
        updatedAt: Date;
        preferredLocale: string;
    }>;
    findOne(id: string): {
        message: string;
        id: string;
    };
    deleteMe(user: {
        userId: string;
    }): Promise<void>;
}

export declare class AuthUserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatarUrl: string | null;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: AuthUserDto;
}

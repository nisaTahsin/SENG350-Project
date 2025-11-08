import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signup(userData: {
        username: string;
        email: string;
        password: string;
        role: string;
    }): Promise<{
        message: string;
        userId: any;
    }>;
    login(username: string, password: string): Promise<{
        access_token: any;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map
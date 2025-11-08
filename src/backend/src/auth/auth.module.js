"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./jwt.strategy");
const user_module_1 = require("../user/user.module");
@(0, common_1.Module)({
    imports: [
        user_module_1.UsersModule,
        passport_1.PassportModule,
        jwt_1.JwtModule.register({
            secret: process.env.JWT_SECRET || 'defaultSecret',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [auth_controller_1.AuthController],
    providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
    exports: [auth_service_1.AuthService],
})
class AuthModule {
}
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
@(0, common_1.Controller)('rooms')
@(0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)
class AuthController {
    @(0, common_1.Get)()
    @(0, roles_decorator_1.Roles)('staff', 'registrar', 'admin') // all roles can view availability
    findAll() {
        return "Rooms list";
    }
    @(0, common_1.Post)()
    @(0, roles_decorator_1.Roles)('registrar') // only registrars can add/edit rooms
    createRoom() {
        return "Room created";
    }
    @(0, common_1.Delete)(':id')
    @(0, roles_decorator_1.Roles)('admin') // only admins can delete at system level
    deleteRoom() {
        return "Room deleted";
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map
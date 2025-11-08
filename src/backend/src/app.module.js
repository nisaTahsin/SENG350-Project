"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const booking_module_1 = require("./booking/booking.module");
const data_source_1 = require("./data-source");
@(0, common_1.Module)({
    imports: [
        typeorm_1.TypeOrmModule.forRoot(data_source_1.AppDataSource.options),
        user_module_1.UsersModule,
        booking_module_1.BookingModule,
    ],
})
class AppModule {
}
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
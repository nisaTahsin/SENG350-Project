"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const booking_controller_1 = require("./booking.controller");
const mcp_controller_1 = require("../mcp/mcp.controller");
@(0, common_1.Module)({
    providers: [booking_service_1.BookingService],
    controllers: [booking_controller_1.BookingController, mcp_controller_1.McpController],
    exports: [booking_service_1.BookingService],
})
class BookingModule {
}
exports.BookingModule = BookingModule;
//# sourceMappingURL=booking.module.js.map
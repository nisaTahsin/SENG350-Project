"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpController = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const booking_service_1 = require("../booking/booking.service");
// —— tool input schemas —— //
const SearchRoomsSchema = zod_1.z.object({
    timeslotId: zod_1.z.number().int().positive(),
    candidateRoomIds: zod_1.z.array(zod_1.z.number().int().positive()).min(1),
});
const BookRoomSchema = zod_1.z.object({
    requestedByUserId: zod_1.z.number().int().positive(),
    roomId: zod_1.z.number().int().positive(),
    timeslotId: zod_1.z.number().int().positive(),
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().optional(),
});
// optional header token: set MCP_TOKEN in env to require it
const authOk = (hdr) => {
    const token = (process.env.MCP_TOKEN ?? '').trim();
    return !token || (hdr && hdr.trim() === token);
};
@(0, common_1.Controller)('mcp')
class McpController {
    bookingService;
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    // discovery endpoint for AI runners
    @(0, common_1.Get)('tools')
    tools() {
        return {
            tools: [
                {
                    name: 'searchRooms',
                    description: 'List available candidate rooms for a given timeslot.',
                    input: { timeslotId: 'number', candidateRoomIds: 'number[]' },
                },
                {
                    name: 'bookRoom',
                    description: 'Create a booking for a room and timeslot.',
                    input: {
                        requestedByUserId: 'number',
                        roomId: 'number',
                        timeslotId: 'number',
                        title: 'string',
                        description: 'string|optional',
                    },
                },
            ],
        };
    }
    // generic tool invocation
    @(0, common_1.Post)('invoke')
    async invoke(
    @(0, common_1.Headers)('x-mcp-token')
    token, 
    @(0, common_1.Body)()
    body) {
        if (!authOk(token))
            return { ok: false, error: 'unauthorized' };
        const tool = body?.tool;
        const input = body?.input;
        if (tool === 'searchRooms') {
            const args = SearchRoomsSchema.parse(input);
            const available = await this.bookingService.listAvailableRooms(args.timeslotId, args.candidateRoomIds);
            return { ok: true, data: available };
        }
        if (tool === 'bookRoom') {
            const args = BookRoomSchema.parse(input);
            const booking = await this.bookingService.createBooking(args.requestedByUserId, args.roomId, args.timeslotId, args.title, args.description);
            return { ok: true, data: booking };
        }
        return { ok: false, error: 'unknown tool' };
    }
}
exports.McpController = McpController;
//# sourceMappingURL=mcp.controller.js.map
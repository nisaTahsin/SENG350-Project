import { BookingService } from '../booking/booking.service';
export declare class McpController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    tools(): {
        tools: ({
            name: string;
            description: string;
            input: {
                timeslotId: string;
                candidateRoomIds: string;
                requestedByUserId?: never;
                roomId?: never;
                title?: never;
                description?: never;
            };
        } | {
            name: string;
            description: string;
            input: {
                requestedByUserId: string;
                roomId: string;
                timeslotId: string;
                title: string;
                description: string;
                candidateRoomIds?: never;
            };
        })[];
    };
    invoke(token: string | undefined, body: any): Promise<{
        ok: boolean;
        error: string;
        data?: never;
    } | {
        ok: boolean;
        data: any;
        error?: never;
    }>;
}
//# sourceMappingURL=mcp.controller.d.ts.map
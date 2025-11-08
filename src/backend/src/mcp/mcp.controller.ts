import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { z } from 'zod';
import { BookingService } from '../booking/booking.service';

// —— tool input schemas —— //
const SearchRoomsSchema = z.object({
  timeslotId: z.number().int().positive(),
  candidateRoomIds: z.array(z.number().int().positive()).min(1),
});

const BookRoomSchema = z.object({
  requestedByUserId: z.number().int().positive(),
  roomId: z.number().int().positive(),
  timeslotId: z.number().int().positive(),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
});

// optional header token: set MCP_TOKEN in env to require it
const authOk = (hdr: string | undefined) => {
  const token = (process.env.MCP_TOKEN ?? '').trim();
  return !token || (hdr && hdr.trim() === token);
};

@Controller('mcp')
export class McpController {
  constructor(private readonly bookingService: BookingService) {}

  // discovery endpoint for AI runners
  @Get('tools')
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
  @Post('invoke')
  async invoke(@Headers('x-mcp-token') token: string | undefined, @Body() body: any) {
    if (!authOk(token)) return { ok: false, error: 'unauthorized' };

    const tool = body?.tool as string;
    const input = body?.input;

    if (tool === 'searchRooms') {
      const args = SearchRoomsSchema.parse(input);
      const available = await this.bookingService.listAvailableRooms(args.timeslotId, args.candidateRoomIds);
      return { ok: true, data: available };
    }

    if (tool === 'bookRoom') {
      const args = BookRoomSchema.parse(input);
      const booking = await this.bookingService.createBooking(
        args.requestedByUserId,
        args.roomId,
        args.timeslotId,
        args.title,
        args.description,
      );
      return { ok: true, data: booking };
    }

    return { ok: false, error: 'unknown tool' };
  }
}

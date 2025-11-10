/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ReserveDto } from './dto/reserve.dto';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('reserve')
  @HttpCode(HttpStatus.CREATED)
  async reserve(@Body() dto: ReserveDto): Promise<{
    id: number;
    event_id: number;
    user_id: string;
    created_at: Date;
  }> {
    const { event_id, user_id } = dto;
    const booking = await this.bookingsService.reserve(event_id, user_id);
    const response = {
      id: booking.id,
      event_id: booking.eventId,
      user_id: booking.userId,
      created_at: booking.createdAt,
    };
    return response;
  }
}

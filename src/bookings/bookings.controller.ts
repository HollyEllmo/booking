import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ReserveDto } from './dto/reserve.dto';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('reserve')
  @HttpCode(HttpStatus.CREATED)
  async reserve(@Body() dto: ReserveDto) {
    const booking = await this.bookingsService.reserve(
      dto.event_id,
      dto.user_id,
    );
    return {
      id: booking.id,
      event_id: booking.eventId,
      user_id: booking.userId,
      created_at: booking.createdAt,
    };
  }
}

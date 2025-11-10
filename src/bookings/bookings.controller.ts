/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ReserveDto } from './dto/reserve.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('reserve')
  @HttpCode(HttpStatus.CREATED)
  async reserve(
    @Body() dto: ReserveDto,
    @GetUser('userId') userId: number,
  ): Promise<{
    id: number;
    event_id: number;
    user_id: string;
    created_at: Date;
  }> {
    const { event_id } = dto;
    const booking = await this.bookingsService.reserve(
      event_id,
      String(userId),
    );
    const response: {
      id: number;
      event_id: number;
      user_id: string;
      created_at: Date;
    } = {
      id: booking.id,
      event_id: booking.eventId,
      user_id: booking.userId,
      created_at: booking.createdAt,
    };
    return response;
  }
}

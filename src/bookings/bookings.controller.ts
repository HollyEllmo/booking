import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { ReserveDto } from './dto/reserve.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { BookingResponseDto } from './dto/booking-response.dto';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('reserve')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: BookingResponseDto })
  async reserve(
    @Body() dto: ReserveDto,
    @GetUser('userId') userId: string,
  ): Promise<BookingResponseDto> {
    const { event_id } = dto;
    const booking = await this.bookingsService.reserve(event_id, userId);
    const response: BookingResponseDto = {
      id: booking.id,
      event_id: booking.eventId,
      user_id: booking.userId,
      created_at: booking.createdAt,
    };
    return response;
  }
}

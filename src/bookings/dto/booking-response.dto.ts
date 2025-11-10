import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto {
  @ApiProperty()
  id!: number;
  @ApiProperty({ name: 'event_id' })
  event_id!: number;
  @ApiProperty({ name: 'user_id' })
  user_id!: string;
  @ApiProperty({ name: 'created_at', type: String, format: 'date-time' })
  created_at!: Date;
}



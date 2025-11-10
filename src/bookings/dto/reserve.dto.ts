import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveDto {
  @ApiProperty({ example: 1, description: 'Event identifier' })
  @IsInt()
  @IsPositive()
  event_id!: number;
}

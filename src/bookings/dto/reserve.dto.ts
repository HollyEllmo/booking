import { IsInt, IsPositive } from 'class-validator';

export class ReserveDto {
  @IsInt()
  @IsPositive()
  event_id!: number;
}

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class ReserveDto {
  @IsInt()
  @IsPositive()
  event_id!: number;

  @IsString()
  @MinLength(1)
  user_id!: string;
}

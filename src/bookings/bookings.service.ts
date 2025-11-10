/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { PrismaClient } from '@prisma/client';

type DbEvent = {
  id: number;
  name: string;
  total_seats?: number;
  totalSeats?: number;
};
type DbBooking = {
  id: number;
  eventId: number;
  userId: string;
  createdAt: Date;
};

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async reserve(eventId: number, userId: string): Promise<DbBooking> {
    const prisma: PrismaClient = this.prisma;

    const event = (await prisma.event.findUnique({
      where: { id: eventId },
    })) as unknown as DbEvent | null;
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check duplicate booking
    const existing = (await prisma.booking.findFirst({
      where: { eventId, userId },
    })) as unknown as DbBooking | null;
    if (existing) {
      throw new ConflictException('User already booked this event');
    }

    // Check capacity
    const totalSeats =
      (event as any).totalSeats ?? (event as any).total_seats ?? 0;
    if (totalSeats > 0) {
      const currentCount = await prisma.booking.count({ where: { eventId } });
      if (currentCount >= totalSeats) {
        throw new ConflictException('No seats available for this event');
      }
    }

    const booking = (await prisma.booking.create({
      data: { eventId, userId },
    })) as unknown as DbBooking;
    return booking;
  }
}

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const events = [
    { name: 'JS Conference 2025', totalSeats: 100 },
    { name: 'NestJS Meetup', totalSeats: 50 },
    { name: 'Prisma Workshop', totalSeats: 30 },
    { name: 'Tech Talk Evening', totalSeats: 0 }, // 0 => unlimited (by our logic)
  ];

  for (const e of events) {
    // Upsert by unique combination: for demo use name as a natural key
    // If you later add a unique index on name, upsert will behave atomically.
    const existing = await prisma.event.findFirst({ where: { name: e.name } });
    if (existing) {
      await prisma.event.update({
        where: { id: existing.id },
        data: { totalSeats: e.totalSeats },
      });
    } else {
      await prisma.event.create({
        data: { name: e.name, totalSeats: e.totalSeats },
      });
    }
  }
}

async function run(): Promise<void> {
  try {
    await main();
    console.log('Seed completed.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void run();

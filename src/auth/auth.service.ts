import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import type { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async sign(email: string, password: string): Promise<string> {
    const prisma: PrismaClient = this.prisma;
    type DbUser = { id: string; email: string; password: string };
    const existing: DbUser | null = await prisma.user.findUnique({
      where: { email },
    });

    if (!existing) {
      const passwordHash = await argon2.hash(password);
      const newUser: DbUser = await prisma.user.create({
        data: { email, password: passwordHash },
      });
      return this.signToken(newUser.id, newUser.email);
    }

    const passwordValid = await argon2.verify(existing.password, password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signToken(existing.id, existing.email);
  }

  private async signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return await this.jwt.signAsync(payload);
  }
}

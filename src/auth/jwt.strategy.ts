import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { StrategyOptions } from 'passport-jwt';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const opts: StrategyOptions = {
      // Typed custom extractor to avoid unsafe calls on library helpers
      jwtFromRequest: (req: Request): string | null => {
        const header = req.get('authorization');
        if (!header) return null;
        const [scheme, token] = header.split(' ');
        if (!scheme || scheme.toLowerCase() !== 'bearer') return null;
        return token ?? null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'dev_jwt_secret',
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(opts);
  }

  validate(payload: { sub: number; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}

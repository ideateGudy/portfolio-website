import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { AUTH_COOKIE } from './jwt-auth.guard.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await compare(password, user.passwordHash))) {
      // Same message for unknown email and wrong password.
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    const isProd = this.config.get('NODE_ENV') === 'production';
    res.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (ms), matches JWT expiry
    });

    return { id: user.id, email: user.email, role: user.role };
  }

  logout(res: Response) {
    const isProd = this.config.get('NODE_ENV') === 'production';
    res.clearCookie(AUTH_COOKIE, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
    });
    return { ok: true };
  }
}

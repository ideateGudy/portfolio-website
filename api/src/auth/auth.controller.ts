import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Login — rate-limited harder than everything else (PRD §8). */
  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(200)
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto.email, dto.password, res);
  }

  /** No register endpoint exists by design (PRD hard rule). */
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user: { sub: string; email: string; role: string } }) {
    return { id: req.user.sub, email: req.user.email, role: req.user.role };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  changePassword(
    @Req() req: Request & { user: { sub: string; email: string; role: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.sub, dto.currentPassword, dto.newPassword);
  }
}

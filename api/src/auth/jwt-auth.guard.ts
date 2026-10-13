import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export const AUTH_COOKIE = 'portfolio_token';

/** Validates the httpOnly JWT cookie. No register route exists — single admin. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.[AUTH_COOKIE] as string | undefined;
    if (!token) throw new UnauthorizedException('Authentication required');
    try {
      const payload = await this.jwtService.verifyAsync(token);
      (req as Request & { user: { sub: string; email: string; role: string } }).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';

/** Map Prisma's known request errors onto sane HTTP responses. */
const PRISMA_ERRORS: Record<string, { status: number; message: string }> = {
  // Unique constraint failed (e.g. duplicate slug/email).
  P2002: { status: HttpStatus.CONFLICT, message: 'A record with that value already exists' },
  // Foreign key constraint failed.
  P2003: { status: HttpStatus.BAD_REQUEST, message: 'Related record constraint failed' },
  // Record to update/delete does not exist.
  P2025: { status: HttpStatus.NOT_FOUND, message: 'Record not found' },
};

/**
 * Catch-all exception filter (PRD §8: predictable JSON errors).
 * - HttpExceptions (thrown by our services) pass through untouched.
 * - Prisma known errors are translated to 409/404/400 with a clean message.
 * - Everything else → 500 "Internal server error"; the real cause is logged
 *   server-side only, never leaked to the client (no stack traces in responses).
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    // Our own HTTP errors keep their status + message.
    if (exception instanceof HttpException) {
      res.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
      });
      return;
    }

    // Prisma errors → mapped status, sanitized message.
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = PRISMA_ERRORS[exception.code];
      if (mapped) {
        res.status(mapped.status).json({ statusCode: mapped.status, message: mapped.message });
        return;
      }
    }

    // Unknown error: log fully, return generic 500 (never leak internals).
    this.logger.error(
      exception instanceof Error ? exception.stack ?? exception.message : String(exception),
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}

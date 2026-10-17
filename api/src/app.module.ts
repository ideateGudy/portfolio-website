import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PostsModule } from './posts/posts.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ContentModule } from './content/content.module.js';
import { UploadsModule } from './uploads/uploads.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { HealthController } from './health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          transport: config.get('NODE_ENV') !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        },
      }),
    }),
    // Global default: 100 requests/min. Login tightens to 5/min in its controller.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    PrismaModule,
    AuthModule,
    PostsModule,
    ProjectsModule,
    ContentModule,
    UploadsModule,
    AnalyticsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

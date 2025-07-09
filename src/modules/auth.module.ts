import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { HafezModule } from './hafez.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get(
          'auth.server.url',
        )}realms/${configService.get('auth.realm')}/protocol/openid-connect`,
        timeout: configService.get('http.timeout'),
        maxRedirects: configService.get('http.max.redirects'),
      }),
      inject: [ConfigService],
    }),
    HafezModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

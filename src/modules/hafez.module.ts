import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HafezService } from '../services/hafez.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('hafez.url'),
        auth: {
          username: configService.get('hafez.username'),
          password: configService.get('hafez.password'),
        },
        timeout: configService.get('http.timeout'),
        maxRedirects: configService.get('http.max.redirects'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [HafezService],
  exports: [HafezService],
})
export class HafezModule {}

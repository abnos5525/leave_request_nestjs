import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BpmsService } from 'src/services/bpms.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('bpms.url'),
        auth: {
          username: configService.get('bpms.username'),
          password: configService.get('bpms.password'),
        },
        timeout: configService.get('http.timeout'),
        maxRedirects: configService.get('http.max.redirects'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BpmsService],
  exports: [BpmsService],
})
export class BpmsModule {}

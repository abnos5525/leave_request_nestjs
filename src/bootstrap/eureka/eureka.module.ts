import { Module } from '@nestjs/common';
import { EurekaModule as MainEurekaModule } from 'nestjs-eureka';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MainEurekaModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        eureka: {
          host: configService.get('eureka.client.host'),
          port: configService.get('eureka.client.port'),
          servicePath: configService.get('eureka.client.servicePath'),
          ssl: configService.get('eureka.client.ssl'),
          registerWithEureka: configService.get(
            'eureka.client.registerWithEureka',
          ),
          maxRetries: configService.get('eureka.client.maxRetries'),
        },
        service: {
          name: configService.get('app.name'),
          port: configService.get('app.port'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class EurekaModule {}

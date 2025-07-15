import { Module } from '@nestjs/common';
import { CamundaModule } from './camunda.module';
import { LeaveController } from 'src/controllers/leave.controller';
import { CamundaService } from 'src/services/camunda.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule

@Module({
  imports: [
    CamundaModule,
    HttpModule, // Make HttpService available in this module
  ],
  controllers: [LeaveController],
  providers: [
    {
      provide: CamundaService,
      useFactory: (configService: ConfigService, httpService: HttpService) => {
        const wrappedConfig = new Proxy(configService, {
          get(target, prop: keyof ConfigService) {
            if (prop === 'get') {
              return (key: string, defaultValue?: any) => {
                if (key === 'camunda.base.url') {
                  return 'http://localhost:8181/engine-rest';
                }
                return Reflect.get(target, prop).call(
                  target,
                  key,
                  defaultValue,
                );
              };
            }
            return Reflect.get(target, prop);
          },
        });

        return new CamundaService(wrappedConfig, httpService);
      },
      inject: [ConfigService, HttpService],
    },
  ],
})
export class LeaveModule {}

import { BadGatewayException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import * as Client from 'cloud-config-client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        async () => {
          return Client.load({
            name: process.env['app.name'],
            endpoint: process.env['config.server.endpoint'],
            profiles: process.env['config.server.profiles'],
            rejectUnauthorized:
              !!+process.env['config.server.rejectUnauthorized'],
            context: process.env,
          })
            .then((config) => {
              return config.properties;
            })
            .catch((error) => {
              console.log(error);
              throw new BadGatewayException('Config Server Error');
            });
        },
      ],
    }),
  ],
})
export class ConfigServerModule {}

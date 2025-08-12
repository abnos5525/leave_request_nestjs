import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('./../package.json').version;

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const config = new DocumentBuilder()
    .setTitle('Leave Request')
    .addServer(
      configService.get('config.server.profiles') === 'prod'
        ? `${configService.get('gateway.url')}`
        : 'http://localhost:' + configService.get('app.port'),
    )
    .setVersion(version)
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: `${
              configService.get('config.server.profiles') === 'prod'
                ? configService.get('gateway.url') +
                  configService.get('app.name')
                : configService.get('gateway.url') +
                  configService.get('app.name')
            }/api/v1/auth/login`,
            refreshUrl: `${
              configService.get('config.server.profiles') === 'prod'
                ? configService.get('gateway.url') +
                  configService.get('app.name')
                : configService.get('gateway.url') +
                  configService.get('app.name')
            }/api/v1/auth/refresh-token`,
            scopes: {},
          },
        },
      },
      'keycloak-auth',
    )
    .addBasicAuth({ type: 'http' }, 'basic-auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/doc', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      initOAuth: {
        clientId: 'khabir-service',
        clientSecret: 'lmccfm83SL5UqDskcPueddtiMP04MNRm',
      },
    },
  });
}

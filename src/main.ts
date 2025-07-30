import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { I18nValidationPipe } from 'nestjs-i18n';
import { I18nValidationExceptionFilter } from './common/exceptions/i18n-validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);
  setupSwagger(app, configService);

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = configService.get('app.port');
  await app.listen(port);
  console.info('----------------------------------------------------');
  console.info(`| Server URL: http://localhost:${port}/api          |`);
  console.info(`| Swagger URL: http://localhost:${port}/api/doc     |`);
  console.info('----------------------------------------------------');
  console.info(configService.get('hafez.url'));
  console.info(configService.get('bpms.url'));
}

bootstrap();

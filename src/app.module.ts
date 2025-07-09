import { Global, Module } from '@nestjs/common';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SampleModule } from './modules/sample.module';
import { AuthModule } from './modules/auth.module';

@Global()
@Module({
  imports: [BootstrapModule, AuthModule, SampleModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [BootstrapModule],
})
export class AppModule {}

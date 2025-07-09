import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigServerModule } from './config-server/config-server.module';
import { EurekaModule } from './eureka/eureka.module';
import { PostgresModule } from './postgres/postgres.module';
import { WinstonLoggerModule } from './winston/winston-logger.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { I18nModule } from './i18n/i18n.module';
import { PrometheusModule } from './prometheus/prometheus.module';
import { BasicStrategy } from '../common/strategies/basic.strategy';
import { LoggerService } from '../common/services/logger.service';
import { BasicAuthGuard } from '../common/guards/basic.guard';

@Module({
  imports: [
    ConfigServerModule,
    EurekaModule,
    PostgresModule,
    PassportModule,
    I18nModule,
    KeycloakModule,
    WinstonLoggerModule,
    PrometheusModule,
  ],
  providers: [LoggerService, BasicStrategy, BasicAuthGuard],
  exports: [KeycloakModule, LoggerService],
})
export class BootstrapModule {}

import { Module } from '@nestjs/common';
import {
  KeycloakConnectModule,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useFactory: (appConfigService: ConfigService) => ({
        authServerUrl: appConfigService.get('auth.server.url'),
        realm: appConfigService.get('auth.realm'),
        clientId: appConfigService.get('auth.client.id'),
        secret: appConfigService.get('auth.client.secret'),
        // optional if you want to retrieve JWT from cookie
        // cookieKey: appConfigService.get('AUTH_COOKIE_KEY') || 'SAMPLE_KEY',
        // optional loglevels. default is verbose
        logLevels: ['warn'],
        // optional useNestLogger, uses the logger from app.useLogger() implementation
        useNestLogger: false,
        // optional, already defaults to permissive
        policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
        // optional, already defaults to online validation
        tokenValidation: TokenValidation.NONE,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [KeycloakConnectModule],
})
export class KeycloakModule {}

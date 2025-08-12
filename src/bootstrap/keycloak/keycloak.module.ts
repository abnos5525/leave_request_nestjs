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
      useFactory: (appConfigService: ConfigService) => {
        const keycloakConfig = {
          authServerUrl: appConfigService.get('auth.server.url'),
          realm: appConfigService.get('auth.realm'),
          clientId: appConfigService.get('auth.client.id'),
          secret: appConfigService.get('auth.client.secret'),
          useNestLogger: true,
          policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
          tokenValidation: TokenValidation.ONLINE,
        };
        console.log('Keycloak Connect Config:', keycloakConfig);
        return keycloakConfig;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [KeycloakConnectModule],
})
export class KeycloakModule {}

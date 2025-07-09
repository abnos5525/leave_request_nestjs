import { Controller, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'nest-keycloak-connect';
import {
  BasicGuardsReferences,
  KeycloakGuardsReferences,
  KeycloakOrBasicGuard,
} from '../common/guards/keycloak-or-basic.guard';
import { BasicAuthGuard } from '../common/guards/basic.guard';

@ApiTags('sample-both-auth')
@Controller('v1/sample-both-auth')
@ApiBearerAuth('keycloak-auth')
@ApiBearerAuth('bearer-auth')
@ApiBasicAuth('basic-auth')
@KeycloakGuardsReferences(AuthGuard)
@BasicGuardsReferences(BasicAuthGuard)
@UseGuards(KeycloakOrBasicGuard)
export class SampleBothAuthController {}

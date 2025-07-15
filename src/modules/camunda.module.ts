import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CamundaService } from 'src/services/camunda.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [CamundaService],
  exports: [CamundaService, HttpModule],
})
export class CamundaModule {}

import { Module } from '@nestjs/common';
import { PrometheusModule as MainPrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [MainPrometheusModule.register({})],
})
export class PrometheusModule {}

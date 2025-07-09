import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleEntity } from '../entities/sample.entity';
import { SampleService } from '../services/sample.service';
import { SampleController } from '../controllers/sample.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SampleEntity])],
  providers: [SampleService],
  controllers: [SampleController],
  exports: [SampleService],
})
export class SampleModule {}

import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SampleEntity } from '../entities/sample.entity';

@Injectable()
export class SampleService extends TypeOrmCrudService<SampleEntity> {
  constructor(@InjectRepository(SampleEntity) repo) {
    super(repo);
  }
}

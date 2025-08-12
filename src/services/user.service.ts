import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { HafezService } from './hafez.service';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repo,
    private readonly hafezService: HafezService,
  ) {
    super(repo);
  }

  async getUsers(request: PaginationDto) {
    return this.hafezService.getUsers(request);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { HafezModule } from './hafez.module';
import { UserService } from '../services/user.service';
import { UserController } from 'src/controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HafezModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, HafezModule],
})
export class UserModule {}

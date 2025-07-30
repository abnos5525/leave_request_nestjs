import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveEntity } from 'src/entities/leave.entity';
import { LeaveService } from 'src/services/leave.service';
import { LeaveController } from 'src/controllers/leave.controller';
import { BpmsModule } from './bpms.module';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveEntity]), BpmsModule],
  providers: [LeaveService],
  controllers: [LeaveController],
  exports: [LeaveService, BpmsModule],
})
export class LeaveModule {}

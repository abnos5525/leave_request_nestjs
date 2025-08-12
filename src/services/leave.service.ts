import { Injectable } from '@nestjs/common';
import { BpmsService } from './bpms.service';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { LeaveEntity } from 'src/entities/leave.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StartRequestDto } from 'src/dto/start-request.dto';

@Injectable()
export class LeaveService extends TypeOrmCrudService<LeaveEntity> {
  constructor(
    @InjectRepository(LeaveEntity) repo,
    private readonly bpmsService: BpmsService,
  ) {
    super(repo);
  }

  async getProcesses() {
    return await this.bpmsService.getProcesses();
  }

  async getProcessInstancesByKey() {
    return await this.bpmsService.getProcessInstancesByKey();
  }

  async startProcess(request: StartRequestDto) {
    return await this.bpmsService.startProcess(request);
  }

  async getTask(id: string) {
    return await this.bpmsService.getTask(id);
  }

  async getProcessInstanceById(id: string) {
    return await this.bpmsService.getProcessInstanceById(id);
  }

  async deleteProcessInstanceById(id: string) {
    return await this.bpmsService.deleteProcessInstanceById(id);
  }

  async getCompletedLeaveTasks(): Promise<any[]> {
    return await this.bpmsService.getCompletedLeaveTasks();
  }

  async getActiveLeaveTasksDirect(): Promise<any[]> {
    return await this.bpmsService.getActiveLeaveTasks();
  }

  async completeTask(taskId: string, variables?: Record<string, any>) {
    return await this.bpmsService.completeTask(taskId, variables);
  }

  async getHistoricVariables(processInstanceId: string) {
    return await this.bpmsService.getProcessInstanceVariables(
      processInstanceId,
    );
  }
}

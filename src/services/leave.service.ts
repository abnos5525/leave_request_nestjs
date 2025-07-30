import { Injectable } from '@nestjs/common';
import { BpmsService } from './bpms.service';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { LeaveEntity } from 'src/entities/leave.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveVariablesDto } from 'src/dto/leave-variables.dto';

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

  async getProcessInstance(id: string) {
    return await this.bpmsService.getProcessInstance(id);
  }

  async startProcess(processKey: string, variabled: LeaveVariablesDto) {
    return await this.bpmsService.startProcess(processKey, variabled);
  }

  async getTasks(id: string) {
    return await this.bpmsService.getTasks(id);
  }

  async getTasksByProcessInstanceId(processInstanceId: string) {
    return await this.bpmsService.getTasksByProcessInstanceId(
      processInstanceId,
    );
  }

  async completeTask(taskId: string, variables?: Record<string, any>) {
    return await this.bpmsService.completeTask(taskId, variables);
  }

  async getHistoricProcesses(variableName: string, variableValue: any) {
    return await this.bpmsService.getHistoricProcesses(
      variableName,
      variableValue,
    );
  }

  async getHistoricVariables(processInstanceId: string) {
    return await this.bpmsService.getHistoricVariables(processInstanceId);
  }
}

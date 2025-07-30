import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CoreService } from '../common/services/core.service';
import { LoggerService } from '../common/services/logger.service';
import { LogTypes } from '../common/types/logger';
import { firstValueFrom } from 'rxjs';
import { StartProcessInstanceDto } from 'src/dto/start-process-instance.dto';
import { TaskDto } from 'src/dto/task.dto';
import { LeaveVariablesDto } from 'src/dto/leave-variables.dto';
import { VariableDto } from 'src/dto/variable.dto';

@Injectable()
export class BpmsService extends CoreService {
  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    protected loggerService: LoggerService,
  ) {
    super(httpService, loggerService, LogTypes.BPMS_REQUESTS);
  }

  async getProcesses() {
    const { data } = await this.httpService.axiosRef.get(
      `/v1/processes?page=1&size=100`,
    );
    return (
      data?.data?.map((item) => {
        return { key: item.key, name: item.name };
      }) || []
    );
  }

  async getProcessInstance(id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `/v1/processes/${id}/instances`,
    );
    return (
      data?.data?.map((item) => {
        return { key: item.key, name: item.name };
      }) || []
    );
  }

  async startProcess(
    processKey: string,
    leaveData: LeaveVariablesDto,
  ): Promise<StartProcessInstanceDto> {
    const variables = [
      { name: 'employee', type: 'String', value: leaveData.employee },
      { name: 'manager', type: 'String', value: leaveData.manager },
      { name: 'startDate', type: 'String', value: leaveData.startDate },
      { name: 'endDate', type: 'String', value: leaveData.endDate },
      { name: 'leaveType', type: 'String', value: leaveData.leaveType },
      { name: 'description', type: 'String', value: leaveData.description },
      { name: 'days', type: 'Integer', value: leaveData.days },
    ];

    const url = `v1/processes/key/${processKey}/start`;
    const response = await firstValueFrom(
      this.httpService.post(url, { variables }),
    );
    return response.data.data;
  }

  async getTasks(id: string): Promise<TaskDto> {
    const response = await this.httpService.axiosRef.get(`v1/tasks/${id}`, {
      params: id,
    });
    return response.data.data;
  }

  async getTasksByProcessInstanceId(
    processInstanceId: string,
  ): Promise<TaskDto[]> {
    const url = `v1/processes/${processInstanceId}/instances`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data.data;
  }

  async completeTask(taskId: string, variables?: Record<string, any>) {
    const url = `v1/tasks/${taskId}/complete`;
    const response = await firstValueFrom(
      this.httpService.post(
        url,
        variables ? { variables: this.formatVariables(variables) } : {},
      ),
    );
    return response.data;
  }

  async getHistoricProcesses(variableName: string, variableValue: any) {
    const response = await firstValueFrom(
      this.httpService.get(`/camunda-task/get-current-user-request`, {
        params: {
          variables: `${variableName}_eq_${variableValue}`,
          finished: true,
        },
      }),
    );
    return response.data;
  }

  async getHistoricVariables(processInstanceId: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `/camunda-task/${processInstanceId}/gettaskvariables`,
      ),
    );
    return response.data.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});
  }

  private formatVariables(variables: Record<string, any>) {
    return Object.entries(variables).reduce((acc, [key, value]) => {
      acc[key] = { value };
      return acc;
    }, {});
  }
}

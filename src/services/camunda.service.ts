import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CamundaService {
  private camundaBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.camundaBaseUrl = this.configService.get<string>('camunda.base.url');
  }

  async startProcess(processKey: string, variables: Record<string, any>) {
    const url = `${this.camundaBaseUrl}/process-definition/key/${processKey}/start`;
    const response = await this.httpService
      .post(url, { variables })
      .toPromise();
    return response.data;
  }

  async getTasks(assignee?: string) {
    const params: any = {};
    if (assignee) params.assignee = assignee;

    const response = await firstValueFrom(
      this.httpService.get(`${this.camundaBaseUrl}/task`, { params }),
    );
    return response.data;
  }

  async completeTask(taskId: string, variables?: Record<string, any>) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.camundaBaseUrl}/task/${taskId}/complete`,
        variables ? { variables: this.formatVariables(variables) } : {},
      ),
    );
    return response.data;
  }

  async getHistoricProcesses(variableName: string, variableValue: any) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.camundaBaseUrl}/history/process-instance`, {
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
        `${this.camundaBaseUrl}/history/variable-instance?processInstanceId=${processInstanceId}`,
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

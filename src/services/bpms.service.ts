import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CoreService } from '../common/services/core.service';
import { LoggerService } from '../common/services/logger.service';
import { LogTypes } from '../common/types/logger';
import { firstValueFrom } from 'rxjs';
import { StartProcessInstanceDto } from 'src/dto/start-process-instance.dto';
import { StartRequestDto } from 'src/dto/start-request.dto';
import { VariableTypeEnum } from 'src/enumerate/variable-type.enum';
import { ProcessInstanceCurrentActivityDto } from 'src/dto/process-instance-current-activity.dto';
import { ProcessDto } from 'src/dto/process.dto';
import { HTTPS_AGENT_OPTIONS } from 'src/common/utils/agent';

@Injectable()
export class BpmsService extends CoreService {
  private readonly baseUrl: string;
  private readonly camunda_baseUrl: string;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
    protected readonly loggerService: LoggerService,
  ) {
    super(httpService, loggerService, LogTypes.BPMS_REQUESTS);
    this.baseUrl = this.configService.get<string>('bpms.url');
    this.camunda_baseUrl = this.configService.get<string>('camunda.bpms.url');
  }

  async getProcesses() {
    const url = `${this.baseUrl}/v1/processes?page=1&size=100`;
    const { data } = await this.httpService.axiosRef.get(
      url,
      HTTPS_AGENT_OPTIONS,
    );
    return (
      data?.data?.map((item) => {
        return item;
      }) || []
    );
  }

  async getProcessInstanceById(
    processInstanceId: string,
  ): Promise<ProcessInstanceCurrentActivityDto> {
    const url = `${this.baseUrl}/v1/processes-instance/${processInstanceId}/current-state`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<ProcessInstanceCurrentActivityDto>(url, {
          ...HTTPS_AGENT_OPTIONS,
        }),
      );

      if (response.data) {
        return response.data;
      }
    } catch (error) {
      let errorMessage = 'Unknown error';
      let errorStatus = 500;

      if (error && typeof error === 'object') {
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = 'Leave request not found';
            errorStatus = 500;
          }
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
        errorStatus = 500;
      }

      throw new HttpException(
        {
          status: errorStatus,
          error:
            errorStatus !== 500
              ? 'Internal Server Error'
              : 'Error fetching leave request',
          message: errorMessage,
        },
        errorStatus,
      );
    }
  }

  async deleteProcessInstanceById(processInstanceId: string): Promise<string> {
    const url = `${this.baseUrl}/v1/processes-instance/${processInstanceId}`;

    const response = await firstValueFrom(
      this.httpService.delete<ProcessInstanceCurrentActivityDto>(url, {
        ...HTTPS_AGENT_OPTIONS,
      }),
    );

    if (response.data) {
      return response.data.processId;
    }

    return null;
  }

  async getProcessInstancesByKey() {
    const url = `/v1/processes/key/leave-request/instances`;
    const { data } = await this.httpService.axiosRef.get(
      url,
      HTTPS_AGENT_OPTIONS,
    );
    return data || [];
  }

  async startProcess(
    request: StartRequestDto,
  ): Promise<StartProcessInstanceDto> {
    const variables = request?.variables ? [...request.variables] : [];

    variables.push({
      name: 'approved',
      value: null,
      type: VariableTypeEnum.Boolean,
    });

    const payload = {
      variables: variables.map((variable) => ({
        name: variable.name,
        value: variable.value,
        type: variable.type,
      })),
    };

    const url = `${this.baseUrl}/v1/processes/key/leave-request/start`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, HTTPS_AGENT_OPTIONS),
      );

      if (!response.data || !response.data.id) {
        throw new Error(
          'Invalid response structure: missing process instance ID',
        );
      }

      return response.data;
    } catch (error) {
      this.loggerService.logServiceError(
        `Failed to start process: ${error.message}`,
        500,
        error instanceof Error ? error.stack : undefined,
      );

      if (error.response?.data) {
        throw new HttpException(
          {
            status: error.response.status,
            error: 'Process start failed',
            details: error.response.data,
          },
          error.response.status,
        );
      }

      throw new InternalServerErrorException(
        'Error starting leave request process',
      );
    }
  }

  async getTask(id: string) {
    const url = `${this.baseUrl}/v1/tasks/${id}`;
    const response = await firstValueFrom(
      this.httpService.get(url, HTTPS_AGENT_OPTIONS),
    );
    return response.data;
  }

  async completeTask(taskId: string, variables?: Record<string, any>) {
    const url = `${this.baseUrl}/v1/tasks/${taskId}/complete`;

    try {
      const payload: {
        accept?: boolean;
        variables?: Array<{ name: string; type: string; value: any }>;
      } = {};

      if (
        variables &&
        typeof variables === 'object' &&
        Object.keys(variables).length > 0
      ) {
        const approvedValue = variables.approved;

        payload.accept = approvedValue;

        payload.variables = this.formatVariables({ approved: approvedValue });
      }
      const response = await firstValueFrom(
        this.httpService.post(url, payload, HTTPS_AGENT_OPTIONS),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProcessInstanceVariables(
    processInstanceId: string,
  ): Promise<Record<string, any>> {
    const url = `${this.baseUrl}/camunda-history/history/process-instance/${processInstanceId}/variables`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, HTTPS_AGENT_OPTIONS),
      );

      let variablesData = response.data;

      if (
        variablesData &&
        variablesData._embedded &&
        variablesData._embedded.variables
      ) {
        variablesData = variablesData._embedded.variables;
      } else if (variablesData && typeof variablesData === 'object') {
        variablesData = Object.keys(variablesData).map((key) => ({
          name: key,
          value: variablesData[key].value,
          type: variablesData[key].type,
        }));
      } else {
        return {};
      }

      return variablesData.reduce((acc: Record<string, any>, variable: any) => {
        if (variable.name && variable.value !== undefined) {
          if (variable.type === 'Integer' || variable.type === 'Long') {
            acc[variable.name] = Number(variable.value);
          } else if (variable.type === 'Boolean') {
            acc[variable.name] = Boolean(variable.value);
          } else {
            acc[variable.name] = variable.value;
          }
        }
        return acc;
      }, {});
    } catch (error) {
      this.loggerService['error'].error(
        `Failed to get variables for process ${processInstanceId}: ${
          error.message || 'Unknown error'
        }`,
        error instanceof Error ? error.stack : undefined,
      );

      return {};
    }
  }

  async getCompletedLeaveTasks(): Promise<any[]> {
    try {
      const processDefinitions: ProcessDto[] =
        await this.getProcessDefinitions();

      const leaveProcessDefinition = processDefinitions.find(
        (pd: ProcessDto) => pd.key === 'leave-request',
      );

      if (!leaveProcessDefinition) {
        throw new NotFoundException(
          'Process definition with key "leave-request" not found.',
        );
      }

      const processDefinitionId = leaveProcessDefinition.id;

      const tasksUrl = `${this.camunda_baseUrl}/history/task`;

      const taskParams = {
        processDefinitionId: processDefinitionId,
        taskDeleteReason: 'completed',
        sortBy: 'endTime',
        sortOrder: 'desc',
      };

      const tasksResponse = await firstValueFrom(
        this.httpService.get(tasksUrl, {
          params: taskParams,
          ...HTTPS_AGENT_OPTIONS,
        }),
      );

      const completedTasks: any[] = tasksResponse.data || [];

      const tasksWithVariables = [];
      for (const task of completedTasks) {
        const processInstanceId = task.processInstanceId;
        if (processInstanceId) {
          const variablesUrl = `${this.camunda_baseUrl}/history/variable-instance`;
          const variableParams = {
            processInstanceId: processInstanceId,
          };

          try {
            const variablesResponse = await firstValueFrom(
              this.httpService.get(variablesUrl, {
                params: variableParams,
                ...HTTPS_AGENT_OPTIONS,
              }),
            );
            const variablesList: any[] = variablesResponse.data || [];

            const variablesMap = variablesList.reduce((acc, variable) => {
              if (
                variable &&
                typeof variable === 'object' &&
                variable.name !== undefined
              ) {
                acc[variable.name] =
                  variable.value !== undefined ? variable.value : null;
              }
              return acc;
            }, {} as Record<string, any>);

            tasksWithVariables.push({
              ...task,
              variables: variablesMap,
            });
          } catch (variableError) {
            tasksWithVariables.push({
              ...task,
              variables: {},
              _variableFetchError:
                variableError.message || 'Unknown error fetching variables',
            });
          }
        } else {
          tasksWithVariables.push({ ...task, variables: {} });
        }
      }

      return tasksWithVariables;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage = error.message || 'Unknown error';
      const errorStatus = error.status || 500;
      throw new HttpException(
        `Error fetching completed leave tasks directly: ${errorMessage}`,
        errorStatus,
      );
    }
  }

  async getActiveLeaveTasks(): Promise<any[]> {
    try {
      const processDefinitions = await this.getProcessDefinitions();
      const leaveProcessDefinition = processDefinitions.find(
        (pd) => pd.key === 'leave-request',
      );

      if (!leaveProcessDefinition) {
        throw new NotFoundException(
          'Process definition with key "leave-request" not found.',
        );
      }

      const processDefinitionId = leaveProcessDefinition.id;

      const params: any = {
        processDefinitionId: processDefinitionId,
        active: true,
      };

      const tasksUrl = `${this.camunda_baseUrl}/task`;
      const tasksResponse = await firstValueFrom(
        this.httpService.get(tasksUrl, { params, ...HTTPS_AGENT_OPTIONS }),
      );
      const activeTasks = tasksResponse.data || [];

      const tasksWithVariables = [];
      for (const task of activeTasks) {
        const taskId = task.id;
        if (taskId) {
          const variablesUrl = `${this.camunda_baseUrl}/task/${taskId}/variables`;
          try {
            const variablesResponse = await firstValueFrom(
              this.httpService.get(variablesUrl, { ...HTTPS_AGENT_OPTIONS }),
            );
            const variablesData = variablesResponse.data || {};

            const simplifiedVariables: Record<string, any> = {};
            for (const [varName, varDetails] of Object.entries(variablesData)) {
              if (
                typeof varDetails === 'object' &&
                varDetails !== null &&
                'value' in varDetails
              ) {
                simplifiedVariables[varName] = (varDetails as any).value;
              } else {
                simplifiedVariables[varName] = varDetails;
              }
            }

            tasksWithVariables.push({
              ...task,
              variables: simplifiedVariables,
            });
          } catch (variableError) {
            tasksWithVariables.push({
              ...task,
              variables: {},
              _variableFetchError:
                variableError.message || 'Unknown error fetching variables',
            });
          }
        } else {
          tasksWithVariables.push({ ...task, variables: {} });
        }
      }

      return tasksWithVariables;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const errorMessage = error.message || 'Unknown error';
      const errorStatus = error.status || 500;
      throw new HttpException(
        `Error fetching active leave tasks directly: ${errorMessage}`,
        errorStatus,
      );
    }
  }

  private async getProcessDefinitions(): Promise<ProcessDto[]> {
    const url = `${this.camunda_baseUrl}/process-definition`;
    const params = { latestVersion: true };

    try {
      const response = await firstValueFrom(
        this.httpService.get<ProcessDto[]>(url, {
          params,
          ...HTTPS_AGENT_OPTIONS,
        }),
      );
      return response.data || [];
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      const errorStatus = error.response?.status || 500;
      throw new HttpException(
        `Failed to fetch process definitions from Camunda: ${errorMessage}`,
        errorStatus,
      );
    }
  }

  private formatVariables(variables: Record<string, any>) {
    return Object.entries(variables).map(([name, value]) => {
      let type = 'String';
      if (typeof value === 'number') {
        type = Number.isInteger(value) ? 'Integer' : 'Double';
      } else if (typeof value === 'boolean') {
        type = 'Boolean';
      }
      return {
        name,
        type,
        value,
      };
    });
  }
}

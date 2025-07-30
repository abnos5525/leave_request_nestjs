import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeaveService } from '../services/leave.service';
import { ApprovedLeaveDto } from '../dto/approved-leave.dto';
import { AuthGuard } from 'nest-keycloak-connect';
import { ApiResponseList } from 'src/common/decorators/api-response-list.decorator';
import { ProcessDto } from 'src/dto/process.dto';
import { LeaveVariablesDto } from 'src/dto/leave-variables.dto';

@ApiTags('Leave Management')
@Controller('bpms-core/api/v1')
@ApiBearerAuth('keycloak-auth')
@ApiBearerAuth('bearer-auth')
@UseGuards(AuthGuard)
export class LeaveController {
  constructor(private leaveService: LeaveService) {}

  @Get('/processes')
  @ApiResponseList(ProcessDto)
  async getProcesses() {
    const data = await this.leaveService.getProcesses();
    return { data, count: data.length };
  }

  @Get('/processes/:id/instances')
  @ApiResponseList(ProcessDto)
  async getProcessInstance(@Query('id') id: string) {
    const data = await this.leaveService.getProcessInstance(id);
    return { data, count: data.length };
  }

  /////////////////////////////////////

  @Post('/processes/key/:key/start')
  @ApiBody({ type: LeaveVariablesDto })
  async startLeaveRequest(@Body() variables: LeaveVariablesDto) {
    const instance = await this.leaveService.startProcess(
      'leave-request',
      variables,
    );

    // const tasks = await this.leaveService.getTasksByProcessInstanceId(
    //   instance.id,
    // );

    // const targetTask = tasks.find(
    //   (task) => task.taskDefinitionKey === 'Activity_1u09wap',
    // );

    // if (targetTask) {
    //   await this.leaveService.completeTask(targetTask.id);
    // }

    return { processInstanceId: instance.id };
  }

  @Get('/tasks/:id')
  async getTasks(@Query('id') id: string) {
    return this.leaveService.getTasks(id);
  }

  @Post('/tasks/:id/complete')
  async completeTask(
    @Param('id') taskId: string,
    @Body() variables?: Record<string, any>,
  ) {
    await this.leaveService.completeTask(taskId, variables);
    return { message: `Task ${taskId} completed` };
  }

  @Post('/tasks/:id/decision')
  async makeDecision(
    @Param('id') taskId: string,
    @Query('approved') approved: boolean,
  ) {
    await this.leaveService.completeTask(taskId, { approved });
    return { message: approved ? 'Leave approved' : 'Leave rejected' };
  }

  @Get('/tasks/approved')
  async getApprovedLeaves(): Promise<ApprovedLeaveDto[]> {
    const processes = await this.leaveService.getHistoricProcesses(
      'approved',
      true,
    );

    return Promise.all(
      processes.map(async (proc) => {
        const variables = await this.leaveService.getHistoricVariables(proc.id);
        return new ApprovedLeaveDto({
          processInstanceId: proc.id,
          employee: variables.employee || '',
          manager: variables.manager || '',
          startDate: variables.startDate || '',
          endDate: variables.endDate || '',
          leaveType: variables.leaveType || '',
          description: variables.description || '',
          days: variables.days || 0,
        });
      }),
    );
  }

  @Get('/tasks/rejected')
  async getRejectedLeaves() {
    return this.leaveService.getHistoricProcesses('approved', false);
  }
}

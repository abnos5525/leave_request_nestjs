import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';
import { CamundaService } from '../services/camunda.service';
import { ApprovedLeaveDto } from '../dto/approved-leave.dto';

@ApiTags('Leave Management')
@Controller('/api/leave')
@ApiBearerAuth('keycloak-auth')
@UseGuards(AuthGuard)
export class LeaveController {
  constructor(private camundaService: CamundaService) {}

  @Post('/start')
  async startLeaveRequest(@Body() variables: Record<string, any>) {
    const instance = await this.camundaService.startProcess(
      'leave-request',
      variables,
    );
    return { processInstanceId: instance.id };
  }

  @Get('/tasks')
  async getTasks(@Query('assignee') assignee?: string) {
    return this.camundaService.getTasks(assignee);
  }

  @Get('/tasks/all')
  async getAllTasks() {
    return this.camundaService.getTasks();
  }

  @Post('/tasks/:id/complete')
  async completeTask(
    @Param('id') taskId: string,
    @Body() variables?: Record<string, any>,
  ) {
    await this.camundaService.completeTask(taskId, variables);
    return { message: `Task ${taskId} completed` };
  }

  @Post('/tasks/:id/decision')
  async makeDecision(
    @Param('id') taskId: string,
    @Query('approved') approved: boolean,
  ) {
    await this.camundaService.completeTask(taskId, { approved });
    return { message: approved ? 'Leave approved' : 'Leave rejected' };
  }

  @Get('/tasks/approved')
  async getApprovedLeaves(): Promise<ApprovedLeaveDto[]> {
    const processes = await this.camundaService.getHistoricProcesses(
      'approved',
      true,
    );

    return Promise.all(
      processes.map(async (proc) => {
        const variables = await this.camundaService.getHistoricVariables(
          proc.id,
        );
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
    return this.camundaService.getHistoricProcesses('approved', false);
  }
}

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  InternalServerErrorException,
  HttpException,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { LeaveService } from '../services/leave.service';
import { AuthGuard } from 'nest-keycloak-connect';
import { ApiResponseList } from 'src/common/decorators/api-response-list.decorator';
import { ProcessDto } from 'src/dto/process.dto';
import { StartRequestDto } from 'src/dto/start-request.dto';
import { ProcessInstanceDto } from 'src/dto/process-instance.dto';
import { LoggerService } from 'src/common/services/logger.service';
import { TaskDto } from 'src/dto/task.dto';

@ApiTags('Leave Management')
@Controller('bpms-core/api/v1/processes')
@ApiResponseList(ProcessDto)
@ApiBearerAuth('keycloak-auth')
@UseGuards(AuthGuard)
export class LeaveController {
  constructor(
    private leaveService: LeaveService,
    private loggerService: LoggerService,
  ) {}

  @Get('')
  async getProcesses() {
    const data = await this.leaveService.getProcesses();
    return { data, count: data.length };
  }

  @Get('/tasks/:id')
  @ApiResponseList(TaskDto)
  @ApiResponse({
    status: 200,
    description: 'Leave request details retrieved successfully.',
    type: TaskDto,
  })
  async getTask(@Param('id') id: string) {
    return await this.leaveService.getTask(id);
  }

  @Get('/leave-request/:processInstanceId')
  @ApiOperation({ summary: 'Get details of a specific leave request' })
  @ApiParam({
    name: 'processInstanceId',
    description: 'The unique ID of the leave request process instance',
  })
  @ApiResponse({
    status: 200,
    description: 'Leave request details retrieved successfully.',
    type: ProcessInstanceDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Leave request not found.',
  })
  async getLeaveRequestDetails(
    @Param('processInstanceId') processInstanceId: string,
  ) {
    const processInstanceDetails =
      await this.leaveService.getProcessInstanceById(processInstanceId);

    if (!processInstanceDetails) {
      throw new NotFoundException(
        `Leave request with ID ${processInstanceId} not found.`,
      );
    }

    return processInstanceDetails;
  }

  @Post('/key/leave-request/start')
  @ApiBody({
    type: StartRequestDto,
    examples: {
      leaveRequest: {
        summary: 'Leave Request Example',
        value: {
          variables: [
            { name: 'employee', type: 'String', value: 'emp123' },
            { name: 'manager', type: 'String', value: 'mgr456' },
            { name: 'startDate', type: 'String', value: '2025-08-01' },
            { name: 'endDate', type: 'String', value: '2025-08-05' },
            { name: 'leaveType', type: 'String', value: 'annual' },
            { name: 'description', type: 'String', value: 'Annual vacation' },
            { name: 'days', type: 'Integer', value: 5 },
          ],
        },
      },
    },
  })
  async startLeaveRequest(@Body() request: StartRequestDto) {
    try {
      const instance = await this.leaveService.startProcess(request);
      if (!instance || !instance.definitionId) {
        throw new InternalServerErrorException(
          'Process started but returned invalid instance',
        );
      }
      return { processInstanceId: instance.definitionId };
    } catch (error) {
      this.loggerService.logServiceError(
        `Leave request failed: ${error.message}`,
        404,
        error.stack,
      );
      throw error;
    }
  }

  @Get('/key/leave-request/instances')
  @ApiResponseList(ProcessDto)
  async getProcessInstancesByKey(): Promise<ProcessInstanceDto[]> {
    return await this.leaveService.getProcessInstancesByKey();
  }

  @Delete('/key/leave-request/instances/:id')
  @ApiResponseList(ProcessDto)
  async deleteProcessInstancesByKey(@Param('id') id: string): Promise<string> {
    return await this.leaveService.deleteProcessInstanceById(id);
  }

  @Post('/tasks/:id/decision')
  async makeDecision(
    @Param('id') taskId: string,
    @Query('approved') approved: boolean,
  ) {
    await this.leaveService.completeTask(taskId, { approved });
    return { message: approved ? 'Leave approved' : 'Leave rejected' };
  }

  @Get('/completed-tasks')
  @ApiResponse({
    status: 200,
    description:
      'List of completed leave request tasks with variables retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Process definition not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getCompletedLeaveTasksDirect() {
    try {
      const result = await this.leaveService.getCompletedLeaveTasks();
      console.log(result);

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error retrieving completed leave tasks directly',
      );
    }
  }

  @Get('/active-tasks-direct')
  @ApiResponse({ status: 404, description: 'Process definition not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getActiveLeaveTasksDirect() {
    try {
      const result = await this.leaveService.getActiveLeaveTasksDirect();
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error retrieving active leave tasks directly',
      );
    }
  }

  @Get('/approved')
  @ApiOperation({ summary: 'Get approved leave requests' })
  @ApiResponse({ status: 404, description: 'Process definition not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getApprovedLeaves() {
    try {
      const result = await this.leaveService.getCompletedLeaveTasks();

      const approvedTasks = result.filter(
        (task) => task.variables && task.variables.approved === true,
      );

      return approvedTasks;
    } catch (error) {
      const errorMessage =
        error?.message ||
        (error && typeof error === 'object' ? JSON.stringify(error) : error) ||
        'Unknown error';

      this.loggerService['error']?.error(
        `Failed to get approved leaves: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException(
        'Error retrieving approved leave requests: ' + errorMessage,
      );
    }
  }

  @Get('/rejected')
  @ApiOperation({ summary: 'Get rejected leave requests' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getRejectedLeaves() {
    try {
      const completedTasksWithVariables =
        await this.leaveService.getCompletedLeaveTasks();

      const rejectedTasks = completedTasksWithVariables.filter(
        (task) => task.variables && task.variables.approved === false,
      );

      return rejectedTasks;
    } catch (error) {
      const errorMessage =
        error?.message ||
        (error && typeof error === 'object' ? JSON.stringify(error) : error) ||
        'Unknown error';

      this.loggerService['error']?.error(
        `Failed to get rejected leaves: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException(
        'Error retrieving rejected leave requests: ' + errorMessage,
      );
    }
  }
}

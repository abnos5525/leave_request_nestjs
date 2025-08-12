import { ApiProperty } from '@nestjs/swagger';
import { VariableDto } from './variable.dto';
import { TaskPropertyDto } from './task-property.dto';

export class ChildActivityInstances {
  @ApiProperty({
    description: 'The unique identifier of the activity instance',
  })
  activityId: string;

  @ApiProperty({
    description:
      'The unique identifier of the task associated with this activity',
  })
  taskId: string;

  @ApiProperty({ description: 'The name/key of the BPMN activity' })
  activityName: string;

  @ApiProperty({
    description:
      'The current state associated with the activity (custom property)',
  })
  state: string;

  @ApiProperty({ description: 'The user assigned to this task/activity' })
  assignee: string;

  @ApiProperty({ description: 'The form key associated with the task' })
  formId: string;

  @ApiProperty({
    description: 'List of candidate users for this task',
    type: [String],
    example: ['user1', 'user2'],
  })
  candidateUsers: string[];

  @ApiProperty({
    description: 'List of candidate groups for this task',
    type: [String],
    example: ['group1', 'group2'],
  })
  candidateGroups: string[];

  @ApiProperty({
    description:
      'List of extension properties associated with the task (e.g., from BPMN XML)',
    type: () => [TaskPropertyDto],
  })
  extensionsProperties: TaskPropertyDto[];

  @ApiProperty({
    description:
      'List of process variables accessible at this activity instance',
    type: () => [VariableDto],
  })
  variables: VariableDto[];

  @ApiProperty({
    description: 'List of task-local variables for this activity instance',
    type: () => [VariableDto],
  })
  localVariables: VariableDto[];

  @ApiProperty({
    description: 'The date/time this activity instance was created/started',
  })
  date: Date;

  constructor(partial: Partial<ChildActivityInstances>) {
    this.candidateUsers = [];
    this.candidateGroups = [];
    this.extensionsProperties = [];
    this.variables = [];
    this.localVariables = [];
    Object.assign(this, partial);
    if (!this.candidateUsers) this.candidateUsers = [];
    if (!this.candidateGroups) this.candidateGroups = [];
    if (!this.extensionsProperties) this.extensionsProperties = [];
    if (!this.variables) this.variables = [];
    if (!this.localVariables) this.localVariables = [];
  }
}

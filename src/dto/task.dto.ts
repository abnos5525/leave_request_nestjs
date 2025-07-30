import { ApiProperty } from '@nestjs/swagger';
import { TaskState } from '../enumerate/task-state.enum';
import { TaskPropertyDto } from './task-property.dto';
import { VariableDto } from './variable.dto';

export class TaskDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  activityId: string;

  @ApiProperty()
  taskDefinitionKey: string;

  @ApiProperty()
  processInstanceId: string;

  @ApiProperty()
  activityName: string;

  @ApiProperty()
  state: string;

  @ApiProperty({ enum: TaskState })
  taskState: TaskState;

  @ApiProperty()
  assignee: string;

  @ApiProperty()
  formId: string;

  @ApiProperty({ type: [String] })
  candidateUsers: string[];

  @ApiProperty({ type: [String] })
  candidateGroups: string[];

  @ApiProperty({ type: [TaskPropertyDto] })
  extensionsProperties: TaskPropertyDto[];

  @ApiProperty({ type: [VariableDto] })
  variables: VariableDto[];

  @ApiProperty({ type: [VariableDto] })
  localVariables: VariableDto[];

  @ApiProperty()
  date: Date;
}

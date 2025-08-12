import { ApiProperty } from '@nestjs/swagger';

export class ProcessInstanceDto {
  @ApiProperty({ description: 'The unique identifier of the process instance' })
  id: string;

  @ApiProperty({ description: 'The definition ID of the process' })
  processDefinitionId: string;

  @ApiProperty({ description: 'The business key of the process instance' })
  businessKey: string;

  @ApiProperty({ description: 'The start time of the process instance' })
  startTime: string;

  @ApiProperty({
    description: 'The end time of the process instance (if finished)',
  })
  endTime: string;

  @ApiProperty({
    description:
      'The duration of the process instance in milliseconds (if finished)',
  })
  durationInMillis: number;

  @ApiProperty({
    description: 'The ID of the user who started the process instance',
  })
  startUserId: string;

  @ApiProperty({ description: 'The ID of the root process instance' })
  rootProcessInstanceId: string;

  @ApiProperty({
    description:
      'The ID of the super process instance (if this is a sub-process)',
  })
  superProcessInstanceId: string;

  @ApiProperty({
    description: 'The ID of the super case instance (if this is a sub-process)',
  })
  superCaseInstanceId: string;

  @ApiProperty({
    description:
      'The ID of the case instance (if this process instance is a sub-process of a case)',
  })
  caseInstanceId: string;

  @ApiProperty({ description: 'Whether the process instance is suspended' })
  suspended: boolean;

  @ApiProperty({ description: 'The tenant ID of the process instance' })
  tenantId: string;
}

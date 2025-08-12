import { ApiProperty } from '@nestjs/swagger';
import { ChildActivityInstances } from './child-activity-instances.dto';
export class ProcessInstanceCurrentActivityDto {
  @ApiProperty({ description: 'The unique identifier of the process instance' })
  processInstanceId: string;

  @ApiProperty({ description: 'The definition ID of the process' })
  processId: string;

  @ApiProperty({
    description: 'List of currently active child activity instances',
    type: () => [ChildActivityInstances],
  })
  childActivityInstances: ChildActivityInstances[];

  constructor(partial: Partial<ProcessInstanceCurrentActivityDto>) {
    this.childActivityInstances = [];
    Object.assign(this, partial);
    if (!this.childActivityInstances) this.childActivityInstances = [];
  }
}

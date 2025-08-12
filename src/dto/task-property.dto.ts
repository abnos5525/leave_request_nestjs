import { ApiProperty } from '@nestjs/swagger';

export class TaskPropertyDto {
  @ApiProperty({
    description:
      'The name of the task property (e.g., extension property name)',
  })
  name: string;

  @ApiProperty({ description: 'The value of the task property' })
  value: string;

  constructor(partial: Partial<TaskPropertyDto>) {
    Object.assign(this, partial);
  }
}

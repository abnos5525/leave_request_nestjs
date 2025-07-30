import { ApiProperty } from '@nestjs/swagger';

export class LeaveVariablesDto {
  @ApiProperty({ example: 'emp123' })
  employee: string;

  @ApiProperty({ example: 'mgr456' })
  manager: string;

  @ApiProperty({ example: '2025-08-01' })
  startDate: string;

  @ApiProperty({ example: '2025-08-05' })
  endDate: string;

  @ApiProperty({ example: 'annual' })
  leaveType: string;

  @ApiProperty({ example: 'Annual vacation' })
  description: string;

  @ApiProperty({ example: 5 })
  days: number;
}

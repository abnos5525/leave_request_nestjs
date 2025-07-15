import { ApiProperty } from '@nestjs/swagger';

export class ApprovedLeaveDto {
  @ApiProperty()
  processInstanceId: string;

  @ApiProperty()
  employee: string;

  @ApiProperty()
  manager: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  leaveType: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  days: number;

  constructor(data: Partial<ApprovedLeaveDto>) {
    Object.assign(this, data);
  }
}

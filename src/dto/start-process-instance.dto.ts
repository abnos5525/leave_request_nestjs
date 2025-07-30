import { ApiProperty } from '@nestjs/swagger';

export class StartProcessInstanceDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ name: 'definitionId' })
  definitionId: string;

  @ApiProperty({ name: 'businessKey' })
  businessKey: string;

  @ApiProperty({ name: 'tenantId', required: false, type: Object })
  tenantId?: any;

  @ApiProperty()
  ended: boolean;

  @ApiProperty()
  suspended: boolean;

  constructor(data: Partial<StartProcessInstanceDto>) {
    Object.assign(this, data);
  }
}

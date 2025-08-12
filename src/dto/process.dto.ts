import { ApiProperty } from '@nestjs/swagger';

export class ProcessDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  description: any;

  @ApiProperty()
  version: number;

  @ApiProperty()
  versionTag: any;

  @ApiProperty()
  tenantId: any;

  @ApiProperty()
  resource: string;

  @ApiProperty()
  deploymentId: string;

  @ApiProperty()
  diagram: any;

  @ApiProperty()
  suspended: boolean;

  @ApiProperty()
  historyTimeToLive: number;

  @ApiProperty()
  startableInTasklist: boolean;
}

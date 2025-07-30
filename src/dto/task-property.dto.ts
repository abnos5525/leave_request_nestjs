import { ApiProperty } from '@nestjs/swagger';

export class TaskPropertyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;
}

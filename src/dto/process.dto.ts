import { ApiProperty } from '@nestjs/swagger';

export class ProcessDto {
  @ApiProperty({ required: false, readOnly: true })
  key: string;
  @ApiProperty({ required: false, readOnly: true })
  name: string;
}

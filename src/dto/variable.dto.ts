import { ApiProperty } from '@nestjs/swagger';
import { VariableTypeEnum } from '../enumerate/variable-type.enum';

export class VariableDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: any;

  @ApiProperty({ enum: VariableTypeEnum })
  type: VariableTypeEnum;
}

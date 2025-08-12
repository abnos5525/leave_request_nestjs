import { ApiProperty } from '@nestjs/swagger';
import { VariableTypeEnum } from 'src/enumerate/variable-type.enum';

export class VariableDto {
  @ApiProperty({ description: 'The name of the variable' })
  name: string;

  @ApiProperty()
  value: any;

  @ApiProperty({
    description: 'The type of the variable',
    enum: VariableTypeEnum,
    example: VariableTypeEnum.String,
  })
  type: VariableTypeEnum;

  constructor(partial: Partial<VariableDto>) {
    Object.assign(this, partial);
  }
}

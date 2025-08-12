import { ApiProperty } from '@nestjs/swagger';
import { VariableDto } from './variable.dto';

export class StartRequestDto {
  @ApiProperty({ type: [VariableDto], required: false })
  variables?: VariableDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false, default: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  offset = 0;
  @ApiProperty({ required: false, default: 10 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit = 10;
}

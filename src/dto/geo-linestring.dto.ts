import { ApiProperty } from '@nestjs/swagger';
import { GeometryTypes } from '../common/types/geometry';

export class GeoLinestringDto {
  @ApiProperty({ enum: GeometryTypes, default: GeometryTypes.Linestring })
  type: GeometryTypes;
  @ApiProperty({
    type: [Number],
    isArray: true,
    example:
      '[[51.515151, 31.313131], [51.515151, 31.313131], [51.515151, 31.313131]]',
  })
  coordinates: number[][];
}

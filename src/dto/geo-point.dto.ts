import { ApiProperty } from '@nestjs/swagger';
import { GeometryTypes } from '../common/types/geometry';

export class GeoPointDto {
  @ApiProperty({ enum: GeometryTypes, default: GeometryTypes.Point })
  type: GeometryTypes;
  @ApiProperty({
    type: [Number],
    example: '[51.515151, 31.313131]',
  })
  coordinates: number[];
}

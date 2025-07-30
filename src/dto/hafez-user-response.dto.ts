import { ApiProperty } from '@nestjs/swagger';

export class HafezUserResponseDto {
  @ApiProperty()
  position_id: string;

  @ApiProperty()
  position_name: string;

  @ApiProperty()
  group_id: string;

  @ApiProperty()
  group_name: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  national_code: string;

  @ApiProperty()
  avatar: string;
}

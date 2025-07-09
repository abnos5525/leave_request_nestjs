import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  scope: string;
}

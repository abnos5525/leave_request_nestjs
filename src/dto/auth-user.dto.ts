import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ required: false, readOnly: true })
  name: string;
  @ApiProperty({ required: false, readOnly: true })
  given_name: string;
  @ApiProperty({ required: false, readOnly: true })
  family_name: string;
  @ApiProperty({ required: false, readOnly: true })
  preferred_username: string;
  @ApiProperty({ required: false, readOnly: true })
  email: string;
  @ApiProperty({ required: false, readOnly: true })
  scope: string;
}

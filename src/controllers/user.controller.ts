import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';
import { ApiResponseList } from '../common/decorators/api-response-list.decorator';
import { UserDto } from 'src/dto/user.dto';

@ApiTags('User')
@Controller('khabir-service/api/v1/users')
@ApiBearerAuth('keycloak-auth')
@ApiBearerAuth('bearer-auth')
@UseGuards(AuthGuard)
export class UserController {
  @ApiResponseList(UserDto)
  @Get('')
  @ApiOkResponse({ type: UserDto })
  async getUser() {}
}

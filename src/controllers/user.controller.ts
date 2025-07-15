import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';
import { ApiResponseList } from '../common/decorators/api-response-list.decorator';
import { UserService } from '../services/user.service';
import { UserDto } from 'src/dto/user.dto';

@ApiTags('User')
@Controller('/v1/users')
@ApiBearerAuth('keycloak-auth')
@ApiBearerAuth('bearer-auth')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private service: UserService) {}

  @ApiResponseList(UserDto)
  @Get('')
  async getUsersAndGroups() {
    const result = await this.service.getUsers();
    return {
      data: result,
      count: result.length,
    };
  }
}

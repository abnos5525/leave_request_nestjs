import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';
import { UserService } from 'src/services/user.service';
import { PaginationDto } from 'src/dto/pagination.dto';

@ApiTags('User')
@Controller('khabir-service/api/v1/users')
@ApiBearerAuth('keycloak-auth')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (0-based)',
    example: 0,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  async getUser(@Query() request: PaginationDto) {
    const data = await this.userService.getUsers(request);
    return { data };
  }
}

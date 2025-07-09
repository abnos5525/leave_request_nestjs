import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser, AuthGuard } from 'nest-keycloak-connect';
import { AuthService } from '../services/auth.service';
import { HafezService } from '../services/hafez.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthUserDto } from '../dto/auth-user.dto';

@ApiTags('auth')
@Controller('/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private hafezService: HafezService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  login(@Body() dto: LoginDto) {
    return this.authService.getToken({ ...dto, grant_type: 'password' });
  }

  @Post('refresh-token')
  @ApiOkResponse({ type: LoginResponseDto })
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.getToken({ ...dto, grant_type: 'refresh_token' });
  }

  @Post('logout')
  async adminLogout(@Body() dto: RefreshTokenDto) {
    return this.authService.logoutFromKeycloak(dto);
  }

  @Get('me')
  @ApiBearerAuth('keycloak-auth')
  @ApiBearerAuth('bearer-auth')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: AuthUserDto })
  async getUser(
    @AuthenticatedUser() user,
    @Headers('authorization') authorization,
  ) {
    const profile = await this.hafezService.getProfile(authorization);
    return {
      username: profile.username || user.preferred_username,
      first_name: profile.first_name || user.given_name,
      last_name: profile.last_name || user.family_name,
      avatar: profile.avatar,
      email: user.email,
      scope: user.scope,
      roles: user.resource_access[this.configService.get('app.name')]?.roles,
    };
  }
}

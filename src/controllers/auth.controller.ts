import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, AuthGuard } from 'nest-keycloak-connect';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@ApiTags('auth')
@Controller('khabir-service/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}

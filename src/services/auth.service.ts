import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as url from 'url';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LoggerService } from '../common/services/logger.service';
import { LogTypes } from '../common/types/logger';
import { firstValueFrom } from 'rxjs';
import { HTTPS_AGENT_OPTIONS } from 'src/common/utils/agent';

@Injectable()
export class AuthService {
  private readonly baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    protected loggerService: LoggerService,
  ) {
    this.baseUrl = this.configService.get<string>('hafez.url');
    this.httpService.axiosRef.interceptors.request.use(
      this.requestLogger.bind(this),
    );
    this.httpService.axiosRef.interceptors.response.use(
      this.responseLogger.bind(this),
      this.catchLogger.bind(this),
    );
  }

  async getToken(dto: Partial<LoginDto & RefreshTokenDto>) {
    try {
      const url = `${this.baseUrl}/auth/login`;
      const params = new URLSearchParams();
      params.append('username', dto.username);
      params.append('password', dto.password);
      const response = await firstValueFrom(
        this.httpService.post(url, params.toString(), {
          ...HTTPS_AGENT_OPTIONS,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: '*/*',
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.log('get token error', error.message);
      throw new UnauthorizedException();
    }
  }

  async getApiAccessToken() {
    const now = Date.now();

    if (this.accessToken && this.tokenExpiresAt && now < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const result = await this.getToken({
      grant_type: 'client_credentials',
    });

    this.accessToken = result.access_token;
    this.tokenExpiresAt = now + result.expires_in * 1000;

    return this.accessToken;
  }

  async logoutFromKeycloak(dto: RefreshTokenDto) {
    try {
      const params = new url.URLSearchParams({
        ...dto,
        client_id: this.configService.get('auth.client.id'),
        client_secret: this.configService.get('auth.client.secret'),
      });

      await this.httpService.axiosRef.post(
        `${this.baseUrl}/logout`,
        params.toString(),
        {
          ...HTTPS_AGENT_OPTIONS,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return { message: 'logout successful' };
    } catch (err) {
      if (err.response?.status === 400)
        throw new BadRequestException(err.message);
      if (err.response?.status === 401)
        throw new UnauthorizedException(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  private async requestLogger(request: AxiosRequestConfig) {
    request._ctx = this.loggerService.logRequest(LogTypes.AUTH_REQUESTS, {
      method: request.method,
      url: `${request.baseURL}${request.url}`,
      body: request.data,
      headers: request.headers,
      user: null,
    });

    return request;
  }

  private responseLogger(res: AxiosResponse) {
    this.loggerService.logResponse(res.config._ctx, res.data, {
      statusCode: res.status,
    });
    return res;
  }

  private catchLogger(error: AxiosError) {
    const errorResponseData = error.response?.data;
    this.loggerService.logServiceError(
      error.config._ctx,
      error.response?.status || error.code,
      errorResponseData || error.stack,
    );
    throw new InternalServerErrorException('Service is not responding', {
      cause: error?.response as any,
    });
  }
}

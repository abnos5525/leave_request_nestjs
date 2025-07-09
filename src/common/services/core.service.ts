import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LoggerService } from './logger.service';
import { LogTypes } from '../types/logger';
import { AuthService } from '../../services/auth.service';

export class CoreService {
  constructor(
    protected httpService: HttpService,
    protected loggerService: LoggerService,
    protected logType: LogTypes,
    protected authService?: AuthService,
  ) {
    this.httpService.axiosRef.interceptors.request.use(
      this.requestLogger.bind(this),
    );
    this.httpService.axiosRef.interceptors.response.use(
      this.responseLogger.bind(this),
      this.catchLogger.bind(this),
    );
  }

  private async requestLogger(request: AxiosRequestConfig) {
    if (this.authService && request.auth !== null) {
      const token = await this.authService.getApiAccessToken();
      request.headers = {
        ...(request.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

    request._ctx = this.loggerService.logRequest(this.logType, {
      method: request.method,
      url: `${request.baseURL}${request.url}`,
      body: request.data,
      headers: request.headers,
      user: null,
    });

    return request;
  }

  private responseLogger(res: AxiosResponse) {
    const dataForLog =
      ((typeof res.data === 'object' && JSON.stringify(res.data)?.length) ||
        (typeof res.data !== 'object' && res.data?.length)) > 10000
        ? 'response is too large'
        : res.data;
    this.loggerService.logResponse(res.config._ctx, dataForLog, {
      statusCode: res.status,
    });
    return res;
  }

  private catchLogger(error: AxiosError) {
    if (error.status === 401) {
      throw new UnauthorizedException();
    }

    const errorResponseData = error.response?.data;
    this.loggerService.logServiceError(
      error.config._ctx,
      error.response?.status || error.code,
      errorResponseData || error.stack,
    );

    throw new InternalServerErrorException('Service is not responding', {
      cause: errorResponseData || error.stack,
    });
  }
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    _ctx?: any;
  }
}

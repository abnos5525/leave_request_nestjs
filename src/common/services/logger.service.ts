import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LogCase, LogTypes } from '../types/logger';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService {
  constructor(private configService: ConfigService) {}
  private readonly logger = new Logger(LoggerService.name);

  logRequest(logType: LogTypes, { method, url, body, headers, user }) {
    const timestamp = Date.now();
    const uniqueId = `${timestamp}${Math.floor(Math.random() * 1000)}`;
    const ctx = {
      logType,
      thread: `${this.configService.get('app.name')}.thr-${uniqueId}`,
      loggerName: LoggerService.name,
      msgId: `${uniqueId}`,
      action: url,
      case: LogCase.Start,
      domain: headers.host,
      method,
      timestamp,
      user,
    };
    const message = `Request - ${method} - ${url}`;
    this.logger.log({
      ...ctx,
      message,
      body,
      headers,
      value: undefined,
    });
    return ctx;
  }

  logResponse(ctx, body, { statusCode }) {
    const message = `Response - ${statusCode} - ${ctx.method} - ${ctx.action}`;
    ctx.case = LogCase.End;
    ctx.elapse = `${Date.now() - ctx.timestamp}`;
    this.logger.log({
      ...ctx,
      statusCode,
      message,
      body,
      value: undefined,
    });
  }

  logHttpError(ctx, error) {
    ctx.case = LogCase.Exception;
    ctx.elapse = `${Date.now() - ctx.timestamp}`;
    if (error instanceof HttpException) {
      const statusCode = error.getStatus();
      const message = `Response - ${statusCode} - ${ctx.method} - ${ctx.action}`;
      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          {
            ...ctx,
            statusCode,
            message,
            error,
            value: undefined,
          },
          error.stack,
        );
      } else {
        this.logger.warn({
          ...ctx,
          error,
          statusCode,
          message,
          value: undefined,
        });
      }
    } else {
      this.logger.error(
        {
          ...ctx,
          statusCode: 500,
          message: `Response - ${ctx.method} - ${ctx.action}`,
          value: undefined,
        },
        error.stack,
      );
    }
  }

  logServiceError(ctx, status, error) {
    const message = `Response - ${status} - ${ctx.method} - ${ctx.action}`;
    ctx.case = LogCase.Exception;
    ctx.elapse = `${Date.now() - ctx.timestamp}`;
    this.logger.error(
      {
        ...ctx,
        statusCode: status,
        message,
        value: undefined,
      },
      error,
    );
  }
}

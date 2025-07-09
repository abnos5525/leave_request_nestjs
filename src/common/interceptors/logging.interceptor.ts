import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { LogTypes } from '../types/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggerService: LoggerService) {}

  intercept(context: ExecutionContext, call$: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const ctx = this.loggerService.logRequest(LogTypes.API_REQUESTS, req);
    return call$.handle().pipe(
      tap({
        next: (body) => {
          const dataForLog =
            ((typeof body === 'object' && JSON.stringify(body)?.length) ||
              (typeof body !== 'object' && body?.length)) > 10000
              ? 'response is too large'
              : body;
          this.loggerService.logResponse(ctx, dataForLog, res);
        },
        error: (error) => {
          this.loggerService.logHttpError(ctx, error);
        },
      }),
    );
  }
}

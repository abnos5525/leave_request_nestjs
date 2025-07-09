import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  constructor(private i18n: I18nService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const message = exception.getResponse() as {
      error: string;
      message: string;
      args?: any;
    };

    if (exception instanceof ServiceUnavailableException) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    if (statusCode === 500) {
      console.error('#> HttpException: ', exception);
    }

    const args: any = {};
    if (message.args) {
      const argsKeys = Object.keys(message.args);
      for (let i = 0; i < argsKeys.length; i++) {
        args[argsKeys[i]] = await this.i18n.t(
          'error.items.' + message.args[argsKeys[i]],
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    response.status(statusCode).json({
      statusCode,
      error: message.error,
      message: (
        (await this.i18n.t('error.' + message.message, {
          args,
        })) as string
      ).replace('error.', ''),
    });
  }
}

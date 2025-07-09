import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
import {
  I18nContext,
  I18nValidationError,
  I18nValidationException,
} from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';
import {
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from 'nestjs-i18n/dist/interfaces/i18n-validation-exception-filter.interface';
import { mapChildrenToValidationErrors } from 'nestjs-i18n/dist/utils/format';

type I18nValidationExceptionFilterOptions =
  | I18nValidationExceptionFilterDetailedErrorsOption
  | I18nValidationExceptionFilterErrorFormatterOption;

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current();

    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    const response = host.switchToHttp().getResponse();
    response
      .status(this.options.errorHttpStatusCode || exception.getStatus())
      .send({
        statusCode: this.options.errorHttpStatusCode || exception.getStatus(),
        error: 'Unprocessable Entity',
        message: this.normalizeValidationErrors(errors),
      });
  }

  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string | I18nValidationError[] | object {
    return this.flattenValidationErrors(validationErrors);
  }

  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string {
    return iterate(validationErrors)
      .map((error) => mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints))
      .flatten()
      .toArray()
      .join(' \n ');
  }
}

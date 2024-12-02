import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { I18nContext } from '@aiofc/i18n';
import { ErrorResponse } from '../vo/error-response.dto';
import { I18nTranslations } from '../generated/i18n.generated';


@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AnyExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // 在某些情况下，“httpAdapter”可能在构造函数方法，因此我们应该在这里解决它。
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    /**
     * this is needed for healthcheck endpoint
     * */
    if (exception instanceof ServiceUnavailableException) {
      httpAdapter.reply(ctx.getResponse(), exception.getResponse(), 503);
    }

    const i18n = I18nContext.current<I18nTranslations>(host);
    // 根据国际化上下文生成本地化的错误消息
    const response = {
      // todo implement link to the docs, get from config
      type: 'todo implement link to the docs, get from config',
      title:
        i18n?.translate('exception.INTERNAL_ERROR.TITLE') ??
        /* istanbul ignore next */ 'Internal Error',
      detail:
        i18n?.translate('exception.INTERNAL_ERROR.GENERAL_DETAIL').toString() ??
        /* istanbul ignore next */
        'Internal Server Error 500',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      instance: ctx.getRequest().id,
    } satisfies ErrorResponse;

    this.logger.error(
      {
        err: exception,
      },
      `Unexpected error happen, this require immediate attention`,
    );

    httpAdapter.reply(ctx.getResponse(), response, response.status);
  }
}

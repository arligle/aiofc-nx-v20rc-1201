import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import { generateRandomId } from '../utils/crypto';
import { ClassSerializerInterceptor, INestApplication, VersioningType } from '@nestjs/common';
import { AppConfig } from '../config/app.config';
import { Logger, LoggerErrorInterceptor } from '@aiofc/logger';
import fastifyHelmet from '@fastify/helmet';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import {
  AnyExceptionFilter,
  HttpExceptionFilter,
  OverrideDefaultForbiddenExceptionFilter,
  OverrideDefaultNotFoundFilter,
  responseBodyFormatter,
} from '@aiofc/exceptions';
import { I18nValidationExceptionFilter, I18nValidationPipe } from '@aiofc/i18n';
import { DEFAULT_VALIDATION_OPTIONS } from '@aiofc/validation';

// TODO: FastifyAdapter 是 Fastify 的 NestJS 适配器，它允许我们在 NestJS 应用中使用 Fastify。
export function createFastifyInstance(): FastifyAdapter {
  const REQUEST_ID_HEADER = 'x-request-id';
  return new FastifyAdapter({
    // 给每一个请求分配一个ID，用于追踪请求：
    // 1、如果请求已经有了'x-request-id'
    // 2、否则生成一个随机ID
    genReqId: (req: { headers: { [x: string]: any } }) => {
      const requestId = req.headers[REQUEST_ID_HEADER];
      return requestId || generateRandomId();
    },
    bodyLimit: 10_485_760,
  });
}

// TODO: 关于提高 Fastify 与 Express 中间件的兼容性的建议(官方)
function applyExpressCompatibility(fastifyInstance: FastifyInstance) {
  // this is a recommendation from fastify to improve compatibility with express middlewares
  fastifyInstance
    .addHook('onRequest', async (req) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.socket['encrypted'] = process.env.NODE_ENV === 'production';
    })
    .decorateReply(
      'setHeader',
      /* istanbul ignore next */ function (name: string, value: unknown) {
        this.header(name, value);
      }
    )
    .decorateReply(
      'end',
      /* istanbul ignore next */ function () {
        this.send('');
      }
    );
}
// TODO: 设置全局过滤器
export function setupGlobalFilters(
  app: INestApplication,
  httpAdapterHost: HttpAdapterHost
) {
  app.useGlobalFilters(
    new AnyExceptionFilter(httpAdapterHost as any),
    new OverrideDefaultNotFoundFilter(httpAdapterHost as any),
    new OverrideDefaultForbiddenExceptionFilter(httpAdapterHost as any),
    // todo generalize
    new HttpExceptionFilter(httpAdapterHost as any),
    new I18nValidationExceptionFilter({
      responseBodyFormatter,
      detailedErrors: true,
    })
    // 加入更多的Filter
    // new PostgresDbQueryFailedErrorFilter(httpAdapterHost as any),
  );
}

// TODO: 设置全局拦截器
function setupGlobalInterceptors(app: INestApplication) {
  // 用于自动序列化和反序列化类实例，确保响应数据符合预期的格式
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // 用于捕获和记录应用程序中的错误日志
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
}

/**
 * @description 初始化应用程序
 * @export
 * @param app
 * @param config
 * @param logger
 * @param fastifyInstance
 * @param httpAdapterHost
 * @return {*}
 */
export async function initialize(
  app: NestFastifyApplication,
  config: AppConfig,
  logger: Logger,
  fastifyInstance: FastifyInstance,
  httpAdapterHost: HttpAdapterHost
) {
  // 在应用程序时注册全局的日志记录器
  app.useLogger(logger);
  app.flushLogs(); // 刷新日志：将内存中的日志数据写入到持久存储（如文件或数据库）中
  app.setGlobalPrefix(config.prefix || 'api');
  // 启用跨域请求
  app.enableCors(config.cors);
  // 用于启用 API 版本控制。这里使用了 URI 版本控制策略。
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // 启用应用程序的关闭钩子。在应用程序关闭时执行必要的清理操作，从而提高应用程序的可靠性和稳定性。
  app.enableShutdownHooks();
  // 提高 Fastify 与 Express 的兼容性
  applyExpressCompatibility(fastifyInstance);
  app.register(fastifyHelmet, {});

  // 在 Fastify 应用实例上注册了一个全局的类验证管道，用于处理请求数据的验证。
  app.useGlobalPipes(new I18nValidationPipe(DEFAULT_VALIDATION_OPTIONS));
  // 所以首先是全局的，然后是缩小的
  // 确保在应用程序中发生异常时，这些异常会被全局的异常过滤器捕获和处理。
  setupGlobalFilters(app, httpAdapterHost);
    // 设置一个全局错误处理器，确保即使在应用程序中发生未捕获的异常时，异常信息也能被记录下来。
  process.on(
    'uncaughtException',
    /* istanbul ignore next */ function (err) {
      // Handle the error safely
      logger.error('Uncaught exception: %o', err);
    },
  );
  // 设置一个全局错误处理器，确保即使在应用程序中发生未处理的 Promise 拒绝时，拒绝信息也能被记录下来。
  process.on(
    'unhandledRejection',
    /* istanbul ignore next */ (reason, promise) => {
      // Handle the error safely
      logger.error(
        'Unhandled Rejection at: Promise: %o, reason: %s',
        promise,
        reason,
      );
    },
  );
  // 设置全局拦截器
  setupGlobalInterceptors(app);

  return app;
}

// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';
// import { FastifyInstance } from 'fastify';
// import { generateRandomId } from '../utils/crypto';
// import { VersioningType } from '@nestjs/common';
// import { AppConfig } from '../config/app.config';
// import { Logger } from '@aiofc/logger';
// import fastifyHelmet from '@fastify/helmet';

// // TODO: FastifyAdapter 是 Fastify 的 NestJS 适配器，它允许我们在 NestJS 应用中使用 Fastify。
// export function createFastifyInstance(): FastifyAdapter {
//   const REQUEST_ID_HEADER = 'x-request-id';
//   return new FastifyAdapter({
//     // 给每一个请求分配一个ID，用于追踪请求：
//     // 1、如果请求已经有了'x-request-id'
//     // 2、否则生成一个随机ID
//     genReqId: (req: { headers: { [x: string]: any } }) => {
//       const requestId = req.headers[REQUEST_ID_HEADER];
//       return requestId || generateRandomId();
//     },
//     bodyLimit: 10_485_760,
//   });
// }

// // TODO: 关于提高 Fastify 与 Express 中间件的兼容性的建议(官方)
// function applyExpressCompatibility(fastifyInstance: FastifyInstance) {
//   // this is a recommendation from fastify to improve compatibility with express middlewares
//   fastifyInstance
//     .addHook('onRequest', async (req) => {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       req.socket['encrypted'] = process.env.NODE_ENV === 'production';
//     })
//     .decorateReply(
//       'setHeader',
//       /* istanbul ignore next */ function (name: string, value: unknown) {
//         this.header(name, value);
//       }
//     )
//     .decorateReply(
//       'end',
//       /* istanbul ignore next */ function () {
//         this.send('');
//       }
//     );
// }

// export function initialize(
//   app: NestFastifyApplication,
//   config: AppConfig,
//   logger: Logger,
//   fastifyInstance: FastifyInstance
// ) {
//   app.useLogger(logger);
//   app.flushLogs(); // 刷新日志：将内存中的日志数据写入到持久存储（如文件或数据库）中
//   app.setGlobalPrefix(config.prefix||'api');
//   // 启用跨域请求
//   app.enableCors(config.cors);
//   // 用于启用 API 版本控制。这里使用了 URI 版本控制策略。
//   app.enableVersioning({
//     type: VersioningType.URI,
//   });
//   // 启用应用程序的关闭钩子。在应用程序关闭时执行必要的清理操作，从而提高应用程序的可靠性和稳定性。
//   app.enableShutdownHooks();
//   // 提高 Fastify 与 Express 的兼容性
//   applyExpressCompatibility(fastifyInstance);
//   app.register(fastifyHelmet, {});
// }

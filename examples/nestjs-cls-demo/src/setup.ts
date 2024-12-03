/*
我们可以预定义一系列的设置函数，以便在不同的场景下使用不同的设置。
设置cls上下文是使用nestjs-cls的核心任务，该包提供了多种为传入请求设置CLS上下文的方法。
详见：https://papooch.github.io/nestjs-cls/setting-up-cls-context
*/
import { ClsModule, ClsModuleOptions } from "@aiofc/nestjs-cls"
import { DynamicModule } from "@nestjs/common";
import { FastifyRequest } from "fastify";



// export function clsModuleForRoot(clsOptions?: ClsModuleOptions): DynamicModule {
//   return ClsModule.forRoot({
//     global: true,
//     middleware: {
//       mount: true,
//       generateId: true,
//       idGenerator: (req) => req.id.toString(),
//     },
//     ...clsOptions,
//   });
// }

export function clsModuleForRoot(clsOptions?: ClsModuleOptions): DynamicModule {
  return ClsModule.forRoot({
   global: true, // 将在整个应用程序中全局可用，而不需要在每个模块中单独导入
      middleware: {  // 对于 HTTP 传输，上下文最好可以在 ClsMiddleware 中设置
        mount: true, // 中间件将被挂载到应用程序中，以便在每个请求的生命周期内启用 CLS
        generateId: true, // 中间件将为每个请求生成一个唯一的 ID
        // 指定cls设定上下文时执行的回调函数
        setup: (cls, req: FastifyRequest) => {
          // put some additional default info in the CLS
          // 把每一个请求的id放到cls中，用以追踪请求的生命周期
          cls.set('requestId', req.id?.toString());
        },
        idGenerator: (req: FastifyRequest) => req.id.toString(),
      },
    ...clsOptions,
  });
}


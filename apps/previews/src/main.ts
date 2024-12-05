import { fastifySwaggerBootstrap } from "@aiofc/fastify-server";
import { AppModule } from "./app.module";
// import { getTransactionalContext } from "typeorm-transactional/dist/common";
// import { initializeTransactionalContext } from 'typeorm-transactional';


/*
初始化事务上下文，
调用 initializeTransactionalContext 必须在初始化任何应用程序上下文之前发生！
https://www.npmjs.com/package/typeorm-transactional#usage
*/
//  transition to use AsyncCls instead of ClsHook
// getTransactionalContext();
// initializeTransactionalContext();
  // this is needed for tests to prevent multiple initializations
  // if (!transactionalContext) {
  //   initializeTransactionalContext();
  // }
fastifySwaggerBootstrap(AppModule);
// TODO: 启动方法1
// import { NestFactory } from '@nestjs/core';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';
// import { AppModule } from './app/app.module';
// import { AppConfig } from './config/app.config';
// import { Logger } from '@aiofc/logger';

// async function bootstrap() {
//   const app = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     new FastifyAdapter()
//   );
//   const config = app.get(AppConfig);
//   const logger = app.get(Logger);
//   const globalPrefix = config.prefix || 'api';
//   const port = config.port || 3000;
//   app.setGlobalPrefix(globalPrefix);
//   await app.listen(port, () => {
//     logger.log(
//       `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
//     );
//   });
// }
// bootstrap();

// TODO: 启动方法2
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const server = await app.listen(0);
//   const port = server.address().port;

//   console.log(
//     `\nApp successfully bootstrapped. You can try running:

//     curl http://127.0.0.1:${port}`
//   );

//   // 以下是一些额外的信息
//   console.log(`\n这是一个简单的Nest应用，以下是一些额外的信息：

//     ${port} 是随机端口，每次启动都会变化`);
//   console.log('\n    当前 node.js 的工作目录:' + process.cwd());
//   console.log('\n    当前启动文件（main.ts）所在目录：' + __dirname);
//   // console.log('\n    main.ts 文件的上一级目录为：' + join(__dirname, '..'));
//   console.log('\n    --- 以上信息对你设置环境变量、调试、配置文件等或许有帮助 ---');
// }
// bootstrap().catch(console.error);

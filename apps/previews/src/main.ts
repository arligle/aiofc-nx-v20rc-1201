import { fastifyBootstrap } from "@aiofc/fastify-server";
import { AppModule } from "./app/app.module";

fastifyBootstrap(AppModule);

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

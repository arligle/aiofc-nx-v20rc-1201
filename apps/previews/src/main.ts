
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import { AppConfig } from './config/app.config';
import { Logger } from '@aiofc/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = app.get(AppConfig);
  const logger = app.get(Logger);

   // 在应用程序时注册全局的日志记录器
  app.useLogger(logger);
  app.flushLogs(); // 刷新日志：将内存中的日志数据写入到持久存储（如文件或数据库）中

  const globalPrefix = config.prefix || 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = config.port || 3000;
  await app.listen(port);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

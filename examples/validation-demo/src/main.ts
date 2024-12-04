/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SampleModule } from './app/sample.module';
import path from 'node:path';
import { I18nValidationExceptionFilter, I18nValidationPipe } from '@aiofc/i18n';

async function bootstrap() {
  console.log(path.join(__dirname, ''))
  const app = await NestFactory.create(SampleModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(
    // new ValidationPipe({
    //   transform: true,
    // })

    // 使用国际化的验证管道
    new I18nValidationPipe({
      transform: true,
      // errorHttpStatusCode: 422,
    })
  );
  // 使用国际化的异常过滤器
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

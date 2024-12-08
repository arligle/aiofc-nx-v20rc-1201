import { Module } from '@nestjs/common';
import { SampleController } from './sample.controller';
import { I18nJsonLoader, I18nModule } from '@aiofc/i18n';
import * as path from 'node:path';
import { MappingController } from './mapping.controller';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaders: [
        new I18nJsonLoader({
          path: path.join(__dirname, './i18n/'),
        }),
      ],
    }),
  ],
  controllers: [SampleController, MappingController],
})
export class SampleModule {}

// __dirname 当前文件的目录路径
// 这里的当前文件指的是编译获得的 main.js 文件,所以是：
// home/arligle/1201/aiofc-nx-v20rc-1201/dist/examples/validation-demo
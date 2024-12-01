import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typedConfigModuleForRoot } from '@aiofc/config';
import rootConfig from '../config/root.config';
import { AcceptLanguageResolver, HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from '@aiofc/i18n';
import { join } from 'path';

@Module({
  imports: [
    typedConfigModuleForRoot(__dirname, rootConfig),
    // i18nModuleForRootAsync(__dirname),
    I18nModule.forRoot({
      fallbackLanguage: 'zh',
      loaders: [
        new I18nJsonLoader({
          path: join(__dirname, '/i18n/'),
        }),
      ],
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

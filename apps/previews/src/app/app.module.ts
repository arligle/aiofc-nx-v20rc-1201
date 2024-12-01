import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typedConfigModuleForRoot } from '@aiofc/config';
import rootConfig from '../config/root.config';

@Module({
  imports: [
    typedConfigModuleForRoot(__dirname, rootConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

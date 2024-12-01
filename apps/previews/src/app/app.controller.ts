import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { I18n, I18nContext } from '@aiofc/i18n';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/hello')
  async getI18nHello(@I18n() i18n: I18nContext) {
    return await i18n.t('test.HELLO');
  }
}

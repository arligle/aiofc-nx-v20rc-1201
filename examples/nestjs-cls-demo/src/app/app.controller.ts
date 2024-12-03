import { Controller, Get, Injectable, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { UserIpInterceptor } from '../interceptors/user-ip.interceptor';

@Controller()
@UseInterceptors(UserIpInterceptor)
@Injectable()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/hello')
    hello() {
        return this.appService.sayHello();
    }
}

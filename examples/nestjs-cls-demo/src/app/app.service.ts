import { ClsService } from "@aiofc/nestjs-cls";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    constructor(private readonly cls: ClsService) {}

    sayHello() {
      // 从cls上下文中获取用户的ip地址
        const userIp = this.cls.get('ip');
        return 'Hello ' + userIp + '!';
    }
}
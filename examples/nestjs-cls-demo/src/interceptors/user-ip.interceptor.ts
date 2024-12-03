import { ClsService } from "@aiofc/nestjs-cls";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from 'rxjs';
@Injectable()
export class UserIpInterceptor implements NestInterceptor {
    constructor(private readonly cls: ClsService) {}
    // 实现NestInterceptor接口的intercept方法
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      // 获取当前请求的request对象
        const request = context.switchToHttp().getRequest();
        // 获取用户的ip地址
        const userIp = request.socket.remoteAddress;
        // 将用户的ip地址存储到CLS上下文中
        this.cls.set('ip', userIp);
        return next.handle();
    }
}
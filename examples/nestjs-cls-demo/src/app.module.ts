
import { Module } from "@nestjs/common";
import { AppController } from "./app/app.controller";
import { AppService } from "./app/app.service";
import { clsModuleForRoot } from "./setup";

@Module({
    imports: [
        // ClsModule.forRoot({
        //     global: true,
        //     middleware: { mount: true }, // nestjs-cls提供了多种为传入请求设置 CLS 上下文的方法,对于 HTTP 传输，最好在 ClsMiddleware 中设置上下文
        // }),
        clsModuleForRoot(),
    ],
    providers: [AppService],
    controllers: [AppController],
})
export class AppModule {}
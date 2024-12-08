import { Module } from '@nestjs/common';
import { typedConfigModuleForRoot } from '@aiofc/config';
import rootConfig from './config/root.config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  i18nModuleForRootAsync,
  QueryResolver,
} from '@aiofc/i18n';
import { join } from 'path';
import { Logger, loggerModuleForRootAsync } from '@aiofc/logger';
import { FastifyRequest } from 'fastify';
import { TypeOrmModule, typeOrmModuleConfig } from '@aiofc/nestjs-typeorm';
import * as Entities from './database/entities';
import * as Controllers from './controllers';
import * as Repositories from './repositories';
import * as Services from './services';
import { ClsModule } from '@aiofc/nestjs-cls';
// import { AbstractAccessCheckService, AbstractTenantResolutionService, AbstractTokenBuilderService, AccessGuard, HeaderTenantResolutionService, JwtAuthGuard, JwtStrategy, TokenService } from '@aiofc/auth';
import AbstractAuthUserService from './services/auth/abstract-auth-user.service';
import AuthUserService from './services/users/auth-user.service';
import { AbstractSignupService } from './services/auth/signup/abstract-signup.service';
import { TenantSignupService } from './services/auth/signup/tenant-signup.service';
// import AbstractAuthUserService from './services/auth/abstract-auth-user.service';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { ClsPresetSubscriber, OptimisticLockingSubscriber } from '@aiofc/typeorm';
// import AuthUserService from './services/users/auth-user.service';
// import { MultiTenantTokenBuilderService } from './services/auth/token/multi-tenant-token-builder.service';
// import { AccessCheckService } from './services/roles/access-check.service';
// import { AbstractSignupService } from './services/auth/signup/signup.service.interface';
// import { APP_GUARD } from '@nestjs/core';
// import { TenantSignupService } from './services/auth/signup/tenant-signup.service';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true, // 将在整个应用程序中全局可用，而不需要在每个模块中单独导入
      middleware: {
        // 对于 HTTP 传输，上下文最好可以在 ClsMiddleware 中设置
        mount: true, // 中间件将被挂载到应用程序中，以便在每个请求的生命周期内启用 CLS
        generateId: true, // 中间件将为每个请求生成一个唯一的 ID
        // 指定cls设定上下文时执行的回调函数
        setup: (cls, req: FastifyRequest) => {
          // put some additional default info in the CLS
          // 把每一个请求的id放到cls中，用以追踪请求的生命周期
          cls.set('requestId', req.id?.toString());
        },
        idGenerator: (req: FastifyRequest) => req.id.toString(),
      },
    }),
    typedConfigModuleForRoot(__dirname, rootConfig),
    loggerModuleForRootAsync(),
    i18nModuleForRootAsync(__dirname),
    // I18nModule.forRoot({
    //   fallbackLanguage: 'en',
    //   loaders: [
    //     new I18nJsonLoader({
    //       path: join(__dirname, '/i18n/'),
    // TODO: 继续引入验证和异常的国际化文件
    //    }),
    //   ],
    //   resolvers: [
    //     { use: QueryResolver, options: ['lang'] },
    //     AcceptLanguageResolver,
    //     new HeaderResolver(['x-lang']),
    //   ],
    // }),

    typeOrmModuleConfig(), // 全局
    // 是否需要讲这些实体与数据库同步需要再配置文件.env.yaml中配置：synchronize: true
    TypeOrmModule.forFeature(Object.values(Entities)), // 局部
    // JwtModule,
  ],

  controllers: Object.values(Controllers),
  providers: [
    ...Object.values(Services),
    ...Object.values(Repositories),
    // OptimisticLockingSubscriber,
    // ClsPresetSubscriber,
    Logger,
    // JwtStrategy,
    // JwtService,
    // TokenService,
     {
      provide: AbstractAuthUserService, // 令牌服务
      useClass: AuthUserService, // 令牌服务实现
    },
    // {
    //   provide: AbstractTokenBuilderService,
    //   useClass: MultiTenantTokenBuilderService,
    // },
    // {
    //   provide: AbstractTenantResolutionService,
    //   useClass: HeaderTenantResolutionService,
    // },
    // {
    //   provide: AbstractAccessCheckService,
    //   useClass: AccessCheckService,
    // },
    {
      provide: AbstractSignupService,
      useClass: TenantSignupService,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessGuard,
    // },

  ],
  // exports: [AbstractAuthUserService],
})
export class AppModule {}

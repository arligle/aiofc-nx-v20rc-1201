import { Module } from '@nestjs/common';
import { typedConfigModuleForRoot } from '@aiofc/config';
import rootConfig from './config/root.config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
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
import { AbstractAccessCheckService, AbstractTenantResolutionService, AbstractTokenBuilderService, AccessGuard, HeaderTenantResolutionService, JwtAuthGuard, JwtStrategy, TokenService } from '@aiofc/auth';
import AbstractAuthUserService from './services/auth/abstract-auth-user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ClsPresetSubscriber, OptimisticLockingSubscriber } from '@aiofc/typeorm';
import AuthUserService from './services/users/auth-user.service';
import { MultiTenantTokenBuilderService } from './services/auth/token/multi-tenant-token-builder.service';
import { AccessCheckService } from './services/roles/access-check.service';
import { AbstractSignupService } from './services/auth/signup/abstract-signup.service';
import { APP_GUARD } from '@nestjs/core';
import { TenantSignupService } from './services/auth/signup/tenant-signup.service';

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
    /*
      这两个函数通常不会有冲突，因为它们的作用是不同的，并且在不同的层面上进行配置。
      typeOrmModuleForRootAsync():
      这个函数用于初始化 TypeORM 模块，并配置与数据库的连接。
      它调用 TypeOrmModule.forRootAsync来设置数据库连接的全局配置。
      这是一个全局配置，通常在应用程序启动时执行一次。

      TypeOrmModule.forFeature(Object.values(Entities)):
      这个函数用于在当前模块中注册特定的实体，使它们在当前模块中可用。
      它不会重新配置数据库连接，而是基于已经配置好的数据库连接来注册实体。
      这是一个局部配置，通常在每个需要访问这些实体的模块中执行。

      这两个函数的作用是互补的：
      typeOrmModuleForRootAsync() 负责全局的数据库连接配置
      TypeOrmModule.forFeature() 负责在特定模块中注册实体，以及操作这些实体。
      因此，它们可以一起使用而不会产生冲突,相反应该根据需要配合一起使用。
    */
    typeOrmModuleConfig(), // 全局
    // 是否需要讲这些实体与数据库同步需要再配置文件.env.yaml中配置：synchronize: true
    TypeOrmModule.forFeature(Object.values(Entities)), // 局部
    JwtModule,
  ],

  controllers: Object.values(Controllers),
  providers: [
    ...Object.values(Services),
    ...Object.values(Repositories),
    OptimisticLockingSubscriber,
    ClsPresetSubscriber,
    Logger,
    JwtStrategy,
    JwtService,
    TokenService,
     {
      provide: AbstractAuthUserService,
      useClass: AuthUserService,
    },
    {
      provide: AbstractTokenBuilderService,
      useClass: MultiTenantTokenBuilderService,
    },
    {
      provide: AbstractTenantResolutionService,
      useClass: HeaderTenantResolutionService,
    },
    {
      provide: AbstractAccessCheckService,
      useClass: AccessCheckService,
    },
    {
      provide: AbstractSignupService,
      useClass: TenantSignupService,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },

  ],
  // exports: [AbstractAuthUserService],
})
export class AppModule {}

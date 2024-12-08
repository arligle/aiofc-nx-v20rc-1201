import {
  BaseSignUpByEmailRequest,
  SignUpByEmailResponse,
} from '../../../controllers/auth/vo/sign-up.dto';

/**
 * 抽象的注册服务类,用于处理用户注册相关的业务逻辑
 *
 * @template T - 泛型参数T,表示注册请求的数据类型
 * @extends BaseSignUpByEmailRequest - 参数 T 必须继承自BaseSignUpByEmailRequest基类,
 * 以确保包含基本的注册信息
 */
export abstract class AbstractSignupService<
  T extends BaseSignUpByEmailRequest,
> {
  /**
   * 抽象的注册方法,需要被具体的服务类实现
   * 处理用户注册的核心业务逻辑
   *
   * @param createUserDto - 用户注册信息对象,包含注册所需的所有数据
   * @returns Promise<SignUpByEmailResponse> - 返回一个Promise,解析为注册成功后的响应数据
   */
  public abstract signUp(createUserDto: T): Promise<SignUpByEmailResponse>;
}
/*
 {
      provide: AbstractSignupService,
      useClass: TenantSignupService,
  }
 */
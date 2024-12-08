import {
  BaseSignUpByEmailRequest,
  SignUpByEmailResponse,
} from '../../../controllers/auth/vo/sign-up.dto';

// 定义一个抽象的注册服务类
// 使用泛型T,T必须继承自BaseSignUpByEmailRequest基类
export abstract class AbstractSignupService<
  T extends BaseSignUpByEmailRequest,
> {
  // 定义一个抽象的注册方法
  // @param createUserDto - 用户注册信息,类型为泛型T
  // @returns Promise<SignUpByEmailResponse> - 返回注册响应的Promise
  public abstract signUp(createUserDto: T): Promise<SignUpByEmailResponse>;
}

/*
 {
      provide: AbstractSignupService,
      useClass: TenantSignupService,
    }
 */
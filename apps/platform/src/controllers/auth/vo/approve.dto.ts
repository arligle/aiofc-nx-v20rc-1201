import { PickType } from '@nestjs/swagger';
import { ExternalApproval } from '../../../database/entities';

/**
 * 用于验证用户注册的请求DTO类
 * 继承自ExternalApproval实体,只选取id和code字段
 * @property id - 外部验证记录的ID
 * @property code - 验证码
 */
/**
 * ApproveSignUpRequest DTO类用于验证用户注册
 * 通过 @nestjs/swagger 的 PickType 工具类从 ExternalApproval 实体中选取部分字段
 *
 * 继承了 ExternalApproval 实体的以下字段:
 * - id: 外部验证记录的唯一标识符
 * - code: 用于验证的验证码
 *
 * 这个 DTO 主要用在 auth/approve-signup 接口中,用于接收前端传来的验证信息
 */
export class ApproveSignUpRequest extends PickType(ExternalApproval, [
  'id',
  'code',
]) {}

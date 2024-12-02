import * as argon2 from 'argon2';
import { customAlphabet, nanoid } from 'nanoid';
/**
 * nano id 一个小巧、安全、URL友好、唯一的 JavaScript 字符串ID生成器。
 */


/**
 * 使用自定义字母生成安全的唯一 ID。
 * @type {*}
 */
const nanoidNoSpecialCharacters = customAlphabet(
  '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
);


const nanoidOnlyNumbers = customAlphabet('1234567890');


/**
 * @description 生成一个ID 将有 21 个符号来产生冲突概率 类似于 UUID v4
 */
export async function generateRandomIdAsync() {
  return nanoid();
}

/**
 * @description 生成一个ID 将有 21 个符号来产生冲突概率 类似于 UUID v4
 */
export function generateRandomId() {
  return nanoid();
}

export function generateRandomIdWithoutSpecialCharacters(length = 11) {
  return nanoidNoSpecialCharacters(length);
}

export function generateRandomNumber(length = 6): number {
  return Number.parseInt(nanoidOnlyNumbers(length));
}

/**
 * 使用 Argon2 对密码进行哈希处理，生成编码哈希值
 * */
export function hashPassword(password: string) {
  return argon2.hash(password);
}
/**
 * @description 验证密码
 * @export
 * @param password
 * @param hashedPassword
 * @return {*}
 */
export async function verifyPassword(password: string, hashedPassword: string) {
  return argon2.verify(hashedPassword, password);
}

import { capitalize } from 'lodash'
import { ValidateClass } from './validateClass'

export const usernameValidGroup = new ValidateClass([rTip('用户名'), 'username2-30']).setRules()
export const emailValidGroup = new ValidateClass([rTip('邮件'), 'email']).setRules()
export const passwordValidGroup = new ValidateClass([rTip('密码'), 'passwordRobust']).setRules()
export const codeGroup = new ValidateClass([rTip('验证码')]).setRules() //验证码
export const mobileGroup = new ValidateClass([rTip('手机号'), 'telephone']).setRules() //手机号

export function rTip(label) {
  label = capitalize(label || '数据')
  return {
    required: true,
    message: `请输入${label}`
  }
}

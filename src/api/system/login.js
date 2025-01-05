import { createApi } from '@/utils/constant/requestConst'

const api = {
  //密码登录
  login: '/common/authService/user/login',
  //手机短信登录
  loginByMobile: '/authService/loginByMobile',
  //获取短信接口
  getPhoneMessage: '/messageService/messageSendRecord/sendPhoneMessage',
  //用户确认注销账号接口
  cancellation: '/authService/user/cancellation',
  //用户验证码注册
  validateCodeRegister: '/authService/register/validateCode',
  //用户注册
  register: '/authService/register',
  //校验验证码
  activation: '/authService/activation',
  //用户修改手机号码
  updateMobile: '/authService/updateMobile',
  //手机号找回密码
  retrievePasswordByMobile: '/authService/user/retrievePasswordByMobile',
  //邮箱找回密码
  retrievePasswordByEmail: '/authService/user/retrievePasswordByEmail',
  //刷新token
  refreshToken: '/common/authService/user/refreshToken',
  //获取信息
  getInfo: '/common/authService/user/getUserInfo',
  //获取全部权限
  buildMenus: '/common/authService/user/getAllAuth',
  // 退出登录调用接口
  logoutting: '/common/authService/user/logout',
  
  //第三方账号绑定
  thirdAccountBinding: '/authService/user/thirdAccountBinding',
  //修改账号信息
  updateAccountInfo: '/authService/user/updateAccountInfo',
  //修改密码
  updatePassword: '/authService/user/updatePassword',
  
  sendPwdEmail: '/authService/sendPwdEmail', //发送邮件重置密码
  checkCode: '/authService/checkCode' //校验验证码重置密码
}

export default createApi(api)

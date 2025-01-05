import {
  usernameValidGroup
} from '@/utils/validate'

const FORM_DEFAULT_OPTION = {
  submitLoading: true,
  labelWidth: 0,
  size: 'medium',
  emptyBtn: false,
  menuBtn: true
}

export const list = {
  //登录
  login: {
    option: {
      ...FORM_DEFAULT_OPTION,
      submitText: '登录',
      column: [
        {
          label: '',
          prop: 'username',
          clearable: false,
          placeholder: '手机号/登录账号',
          rules: usernameValidGroup
        },
        {
          label: '',
          prop: 'password',
          placeholder: '密码',
          formslot: true,
          rules: [{ required: true, message: '密码为空', trigger: 'blur' }]
        }
      ]
    }
  }
}


export function getOption(type = 'login') {
  return list[type] || {}
}

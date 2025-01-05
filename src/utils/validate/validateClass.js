import { isArray, isString } from 'lodash'
import { validData } from '@/components/avue/utils/util'

export const validatorOptions = {
  //数字
  number: {
    pattern: /^[0-9]*$/,
    message: '请输入数字'
  },
  //正整数
  isInteger: {
    pattern: /^[1-9]\d*$/,
    message: '请输入正整数'
  },
  // 正浮点数
  intFloat: {
    pattern: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
    message: '请输入数字'
  },
  // 非负浮点数（正浮点数 + 0）
  notNFloating: {
    pattern: /(?:^[1-9]([0-9]+)?(?:\.[0-9]+)?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])+$)/,
    message: '请输入数字'
  },
  //金额
  money: {
    pattern: /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/,
    message: '金额格式错误'
  },
  //汉字
  chinese: {
    pattern: /[\u4e00-\u9fa5]/,
    message: '请输入汉字'
  },
  //不支持汉字输入
  notChinese: {
    pattern: /^[^\u4e00-\u9fa5]*$/,
    message: '不支持汉字输入'
  },
  //用户名
  username: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
  },
  //邮箱
  email: {
    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: '请输入有效的邮件'
  },
  //密码强度
  passwordRobust: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
    message: '8到16个字符，包括大小写字母和数字。'
  },
  //小写字母
  lowerCase: {
    pattern: /^[a-z]+$/,
    message: '小写字母'
  },
  //大写字母
  upperCase: {
    pattern: /^[A-Z]+$/,
    message: '大写字母'
  },
  //手机号
  telephone: {
    pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
    message: '请输入正确的手机号'
  },
  //大小写字母
  alphabets: {
    pattern: /^[A-Z\sa-z\d-_]+$/,
    message: '请输入大小写字母'
  },
  //数字字母下划线
  commonCharacters: {
    pattern: /^\w+$/,
    message: '只能输入数字字母下划线'
  },
  //数字和字母
  numberAndLetter: {
    pattern: /^\w+$/,
    message: '只能输入数字字母'
  },
  //数字字母，下划线，加号
  commonCharactersAndPoint: {
    pattern: /^[\w-.+]+$/,
    message: '只能输入数字字母，下划线，加号。'
  },
  //验证银行卡密码
  blankPassword: {
    pattern:/^\d{6}$/,
    message: '只能输入6位数字'
  },
  //身份证号'
  idNumber: {
    pattern: /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/,
    message: '请输入正确的身份证号'
  },
  //不能全部为数字
  notAllIsNumber: {
    pattern: /^\d+$/g,
    message: '不能全部为数字'
  },
  //2-30个字符
  'username2-30': {
    pattern: /^.{2,30}$/,
    message: '用户名必须至少为2个字符，长度不得超过30个字符。'
  },
  //不能存在特殊字符 admin和管理员
  specialCharacter: {
    pattern: /^((?!admin|管理员).)*$/ig,
    message: '用户名不能包含禁止使用的词，请重置它。'
  }
}

//传参
//{prop, label, rules: [{required: true, msg}, {type, message, validator, trigger}]}
// [rule1, rule2] 数组的子项要是String类型 则默认会搜索validatorOptions的key取里面的的正则进行校验
export const ValidateClass = class {
  constructor(option = {}) {
    const { rules = [], prop, label } = this.normalizeOption(option)
    this.prop = prop
    this.label = label
    this.rules = rules
  }

  setRules(isPassRequired) {
    let formatRules = []
    if (!isPassRequired) this.setEmptyRules(formatRules)
    this.setOtherRules(formatRules)
    return formatRules
  }

  normalizeOption(option) {
    if (isArray(option)) option = { rules: option }
    option.rules = option.rules.map(item => {
      if (isString(item)) return ({ type: item })
      return item
    })
    return option
  }

  //设置必填
  setEmptyRules(formatRules) {
    const { prop, label, rules } = this
    const fItem = rules.find(({ required }) => required)
    if (!fItem) return
    let { message } = fItem
    message = message || validData(label, prop, '数据') + ' ' + '是必填的'
    formatRules.push({
      required: true,
      message
    })
  }

  shakingRequiredRule() {
    return this.rules.filter(({ required }) => !required)
  }

  //设置校验规则
  setOtherRules(formatRules) {
    this.shakingRequiredRule().map(item => {
      const { type, message = '', validator, pattern, trigger = null } = item
      const typeItem = type && validatorOptions[type]
      const validatorItem = validator && { validator }
      const patternItem = pattern && { pattern }
      const validItem = validData(typeItem, validatorItem, patternItem, null)
      if (!validItem) return
      if (trigger) validItem.trigger = trigger
      if (message) validItem.message = message
      formatRules.push(validItem)
    })
  }
}


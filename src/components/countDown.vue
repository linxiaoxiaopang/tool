<template>
  <el-button
    class="get-code-component"
    :disabled="finalDisabled"
    v-bind="all$attrs"
    @click.prevent="getCode"
  >
    <slot>
      {{ finalTxt }}
    </slot>
  </el-button>
</template>

<script>

import {
  mobileGroup
} from '@/utils/validate'

console.log('mobileGroup', mobileGroup)
const DEFAULT_OPTION = {
  type: 'default'
}
const TIME_MAX_NUM = 60

export default {
  props: {
    //获取验证码接口
    getCodeFunc: {
      type: Function,
      required: true
    },

    checkFunc: Function,

    btnTxt: {
      type: String,
      default: '获取验证码'
    },

    timeMaxNum: {
      type: Number,
      default: TIME_MAX_NUM
    },

    prop: {
      type: String,
      default: 'phoneNumber'
    },

    disabled: Boolean,

    mobile: null,

    mobileRules: {
      type: Array,
      default: () => mobileGroup
    }
  },

  data() {
    return {
      countDowning: false,
      currentCountDownNum: this.timeMaxNum || 0,
      codeText: '获取验证码'
    }
  },

  computed: {
    all$attrs({ $attrs }) {
      return Object.assign({}, DEFAULT_OPTION, $attrs)
    },

    countDownTxt({ currentCountDownNum }) {
      return (currentCountDownNum + '').padStart(2, '0') + '秒'
    },

    finalTxt({ countDowning, countDownTxt, codeText }) {
      return countDowning ? countDownTxt : codeText
    },

    finalDisabled({ countDowning, disabled, mobile }) {
      if (disabled) return disabled
      if (countDowning) return countDowning
      if (!mobile) return true
      return !this.validMobile(mobile)
    }
  },

  methods: {
    async checkHandler() {
      if (this.checkFunc) {
        const isPass = await new Promise(resolve => {
          this.checkFunc(resolve)
        })
        if (!isPass) return false
        this.$emit('checkCode', isPass)
        return true
      }
      return true
    },

    validMobile(mobile) {
      return this.mobileRules.every(item => {
        if (item.pattern) {
          return item.pattern.test(mobile)
        } else if (item.validator) (
          item.validator(null, mobile, (error) => {
            return !!error
          })
        )
        return true
      })
    },

    async getCode() {
      const isPass = await this.checkHandler()
      if (!isPass) return
      if (this.countDowning) return
      this.countDowning = true
      this.currentCountDownNum = this.timeMaxNum
      let i = 0
      let timerFunc = () => {
        if (i == 0) this.getCodeFunc()
        i++
        if (i > TIME_MAX_NUM) return
        this.currentCountDownNum--
      }

      let timerOutFunc = () => {
        timerFunc()
        if (i <= TIME_MAX_NUM) {
          setTimeout(() => {
            timerOutFunc()
          }, 1000)
        } else {
          this.countDowning = false
        }
      }
      timerOutFunc()
    },

    // 获取验证码
    async getVerificationCode() {
      try {
        const res = await this.getCodeFunc()
        if ($SUC(res)) return this.$emit('onSuccess', res)
        this.errorHandler(res)
      } catch (err) {
        this.errorHandler(err)
      }
    },

    errorHandler(err) {
      this.$message.error('获取验证码失败')
      this.resetHandler()
      this.$emit('onError', err)
    },

    resetHandler() {
      Object.assign(this, this.$options.data())
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button.is-disabled {
  border: none;
}
</style>

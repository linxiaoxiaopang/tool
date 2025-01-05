<template>
  <div class="verification-code-component" :class="`verification-code-component--${prepend}`">
    <el-input
      ref="input"
      class="mobile-input-component mr15"
      v-model="currentCode"
      v-bind="$attrs"
      v-on="$listeners"
      :type="$attrs.type || 'text'"
      :placeholder="$attrs.placeholder || '请输入验证码'"
    >
      <template v-if="countDownInPrepend" slot="append">
        <CountDown
          type="text"
          :mobile="mobile"
          :checkFunc="checkMobile"
          :getCodeFunc="getPhoneMessage"
          v-on="$listeners"
        />
      </template>
    </el-input>

    <CountDown
      v-if="!countDownInPrepend"
      :mobile="mobile"
      :checkFunc="checkMobile"
      :getCodeFunc="getPhoneMessage"
      v-on="$listeners"
    />
  </div>

</template>
<script>
import CountDown from '@/components/countDown'
import loginApi from '@/api/system/login'

export default {
  components: { CountDown },

  props: {
    mobile: {
      required: true
    },

    code: {
      required: true
    },

    prop: {
      type: String,
      default: 'phoneNumber'
    },

    countDownInPrepend: Boolean
  },

  data() {
    return {
      currentCode: ''
    }
  },

  computed: {
    prepend({ countDownInPrepend }) {
      return countDownInPrepend ? 'prepend' : 'normal'
    }
  },

  watch: {
    code: {
      handler(newVal) {
        this.currentCode = newVal
      },
      immediate: true
    },

    currentCode(newVal) {
      this.$emit('update:code', newVal)
    }
  },

  methods: {
    //获取验证码
    async getPhoneMessage() {
      return loginApi.getPhoneMessage({
        phoneNumber: this.mobile
      })
    },

    checkMobile(done) {
      if (!this.mobile) {
        this.$message.warning('请先设置手机号')
        return done(false)
      }
      done(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.verification-code-component {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-input {
    flex: 1;
  }

  .el-button {
    padding: 0;
    width: 146px;
    background: #F1F3F7;
  }
}

.verification-code-component--prepend {
  display: block;
  width: 100%;
  .el-input {
    position: relative;
    width: 100%;

  }
  ::v-deep {
    .el-input__inner {
      padding-right: 90px;
      border-radius: 2px;
    }

    .el-input-group__append {
      display: flex;
      align-items: center;
      justify-content: center;
      right: 0px;
      top: 0;
      position: absolute;
      background: transparent;
      width: 90px;
      height: 100%;
      border: none;
    }

    .el-input-group__append::before {
      content: '';
      width: 1px;
      background: $border-color;
      @include absPos(20%, 0, 20%, 0);
    }
  }

  .el-button {
    width: auto;
    padding: 0 10px;
    background: transparent;
    color: $color-primary;
  }
}
</style>

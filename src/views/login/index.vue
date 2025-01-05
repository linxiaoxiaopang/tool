<template>
  <login-base-template>
    <template #content>
      <div class="title">
        <span class="big">欢迎登录，</span>
        {{ SYSTEM_NAME }}
      </div>
      <div class="form-wrapper">
        <passwordLoginForm :formOption="formOption" />
      </div>
    </template>
  </login-base-template>
</template>

<script>
import loginBaseTemplate from './module/loginBaseTemplate'
import passwordLoginForm from './module/passwordLoginForm'
import { getOption } from './const'

export default {
  components: {
    loginBaseTemplate,
    passwordLoginForm
  },

  data() {
    return {
      type: 'login'
    }
  },

  computed: {
    option({ type }) {
      return getOption(type)
    },

    formOption({ option }) {
      return option.option
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: #000;
  font-size: 1rem;
  min-width: 350px;
  margin-bottom: 20px;

  .big {
    font-size: 1.75rem;
    font-weight: 600;
  }
}

::v-deep {
  .el-col {
    float: none;
  }

  .el-form-item {
    background-color: #eff6fe;
    margin-bottom: 2rem;
  }

  .form-menu-wrapper {
    margin-top: 4rem;

    .el-form-item {
      margin-bottom: 0;
    }

    .el-button {
      width: 100%;
      height: 36px;
      line-height: 36px;
    }
  }
}


</style>


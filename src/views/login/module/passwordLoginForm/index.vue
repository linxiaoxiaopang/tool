<template>
  <div>
    <baseForm
      ref="baseForm"
      :option="formOption"
      v-model="form"
      @submit="onsubmit"
      @keyup.enter.native="onsubmit"
    >
      <template #password="{ placeholder }">
        <icon-input
          uiid="zd-pwd"
          type="password"
          v-model="form.password"
          :placeholder="placeholder"
          show-password
        ></icon-input>
      </template>
    </baseForm>

    <div class="register">
      <el-checkbox class="mr20" v-model="form.rememberMe">记住账号</el-checkbox>
      强烈建议使用
      <b>谷歌浏览器</b>
    </div>
  </div>

</template>

<script>
import iconInput from '~/iconInput'
import { mapActions } from 'vuex'

export default {
  components: {
    iconInput
  },

  props: {
    formOption: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      form: {
        username: '',
        password: '',
        rememberMe: false
      },
      type: 'login'
    }
  },

  methods: {
    ...mapActions(['Login']),

    async onsubmit(form, done) {
      if(!done) {
        this.$refs.baseForm.submit()
        return
      }
      try {
        await this.Login(form)
        this.$router.push({ path: '/' })
      } catch (err) {
        console.log('err', err)
      } finally {
        done()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  margin-top: 1rem;
  font-size: 0.75rem;
  text-align: center;

  b {
    color: $color-primary;
    font-size: 1rem;
  }
}
</style>


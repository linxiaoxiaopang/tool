<template>
  <div class="flex-middle">
    <div>
      <span>{{ label }}</span
      ><span v-if="!show">{{ text }}</span>
    </div>
    <el-input
      ref="inputText"
      v-show="show"
      size="small"
      v-model="text"
      @blur="blur(text)"
      @keyup.enter.native="$event.target.blur()"
    ></el-input
    ><baseButton class="ml10" v-if="!show" type="text" @click="editText">
      <svg-icon v-if="iconType == 'icon'" icon-class="edit" class="connect-icon" />
      <span v-else> 编辑 </span>
    </baseButton>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: String,
      default: ''
    },

    label: {
      type: String,
      default: '用户邮箱：'
    },

    value: {
      type: String,
      default: ''
    },

    iconType: {
      type: String,
      default: 'icon'
    }
  },

  data() {
    return {
      text: '',
      show: false
    }
  },

  computed: {},

  mounted() {
    this.text = this.value
  },

  watch: {
    value(n) {
      this.text = this.value
    }
  },

  methods: {
    blur(text) {
      console.log(888888888)
      this.$emit('inputBlur', text, this.field)
      this.show = false
    },

    editText() {
      this.show = true
      this.$nextTick(() => {
        this.$refs.inputText.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.connect-icon {
  font-size: 25px;
}
</style>

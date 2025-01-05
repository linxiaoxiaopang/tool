export default {
  props: {
    sup_this: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '编辑'
    }
  },
  data() {
    return {
      dialogVisible: false,
      isShowDialog: false
    }
  },
  watch: {
    visible: {
      handler(n) {
        if (n) {
          typeof this.dialogOpen === 'function' && this.dialogOpen()
        }
        this.dialogVisible = n
      },
      immediate: true
    },
    dialogVisible(n) {
      if (n) this.isShowDialog = true
      this.$emit('update:visible', n)
    }
  }
}

/* eslint-disable no-undef */
import dialogMixin from './index'
import formMixin from '@/mixins/form/form'

export default {
  mixins: [dialogMixin, formMixin],
  data() {
    return {
      isSuccess: false
    }
  },
  computed: {
    new$listeners({ $listeners }) {
      return Object.assign(
        {
          ...$listeners
        },
        {
          close: () => this.runFn($listeners?.close?.fns, this.isSuccess),
          closed: () => {
            !this.isSuccess && this.$emit('error')
            return this.runFn($listeners?.closed?.fns, this.isSuccess)
          }
        }
      )
    }
  },
  watch: {
    dialogVisible(n) {
      if (!n) {
        this.destroy()
      }
    }
  },
  methods: {
    dialogOpen(...args) {
      let {
        dialogOpen = this.dialogOpenFn
      } = this.option
      return dialogOpen(...args)
    },
    async dialogOpenFn(value = this.value, type = this.type) {
      this.curType = type
      
      let valid = await this.initValidate(value, type)
      if (!valid) return
      
      this.dialogVisible = true
      // 不 await init，则 setFormCopy 会在 beforeInit 之后执行
      this.init(value, type)
      this.setFormCopy(value)
    },
    dialogClose() {
      this.dialogVisible = false
    },
    success(isInit) {
      this.isSuccess = true
      this.dialogClose()
      this.successFn(isInit)
    }
  }
}

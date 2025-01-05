/* eslint-disable */
import { correctExecute } from '@/utils/functional'
import promise from '@/extend/mixins/dialog/promise'
import componentMethods from '@/mixins/componentMethods'
import { validData } from '@/components/avue/utils/util'

export default {
  mixins: [
    promise,
    componentMethods('child', ['validate', 'doFn'])
  ],
  data() {
    return {
      showChildComponent: true,
      destroyChildAfterClose: true
    }
  },
  methods: {
    dialogOpen(...args) {
      return this.dialogOpenFn(...args)
    },
    dialogOpenFn(...args) {
      this.childMethods('dialogOpen', ...args)
      
      if (validData(this.options.isResolve, true)) {
        return awaitFormResolve(this.createPromise())
      }
      return this.createPromise()
    },
    
    async onsubmit() {
      return awaitLoading(correctExecute(this.validate, this.doFn, this.success))
    },
    success() {
      return this.successFn()
    },
    successFn(...args) {
      this.valueResolve(this.form)
      this.dialogVisible = false
      this.sup_this.init && this.sup_this.init()
      return this.childMethods('success', ...args)
    }
  }
}

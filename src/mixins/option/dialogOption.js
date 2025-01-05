/* eslint-disable */
import option from '@/mixins/option/index'
import { intersection } from 'lodash'

export default function (param = {}) {
  return {
    mixins: [option({ ...param, isInit: false })],
    data() {
      return {
        baseDialog: null
      }
    },
    computed: {
      dialogAttrs() {
        return {
          ...this.option.dialogAttrs,
          ...this.$attrs
        }
      },
      dialogListeners({ $listeners = {}, option: { dialogListeners = {} } }) {
        const listeners = {}
        const arr = intersection(Object.keys($listeners), Object.keys(dialogListeners))
        arr.forEach(key => {
          listeners[key] = (...args) => {
            this.$emit(key, ...args)
            dialogListeners[key](...args)
          }
        })
        return {
          ...$listeners,
          ...dialogListeners,
          ...listeners
        }
      }
    },
    watch: {
      baseDialog: {
        handler(n, o) {
          o?.$off('open', this.dialogOpen)
          n?.$off('open', this.dialogOpen)
          param.init !== false && n?.$on('open', this.dialogOpen)
        },
        immediate: true
      }
    },
    methods: {
      async doSubmit(form, done) {
        const valid = await this.validates()
        if (!valid) return done(false)
        
        const onsubmit = this.option.onsubmit || this.onsubmit || done.bind(null, undefined)
        return onsubmit(form, done)
      },
      
      dialogInit() {
        const { lastRes = true } = this.validateWrapper([
          this.$attrs.beforeInit,
          this.option.beforeInit
        ])
        if (!lastRes) return
        
        const init = this.option.init || this.init
        typeof init === 'function' && init()
      },
      dialogOpen() {
        this.typeInit()
        this.dialogInit()
      },
      
      beforeOpen() {
        return this.validateWrapper([
          this.$attrs.beforeOpen,
          this.option.beforeOpen
        ])
      },
      beforeClose() {
        return this.validateWrapper([
          this.$attrs.beforeClose,
          this.option.beforeClose
        ])
      },
      beforeCancel() {
        return this.validateWrapper([
          this.$attrs.beforeCancel,
          this.option.beforeCancel
        ])
      }
    }
  }
}
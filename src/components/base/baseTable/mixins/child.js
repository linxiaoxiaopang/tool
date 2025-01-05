import { validData } from '@/components/avue/utils/util'

export default function ({ name = 'basePage', fns = [] }) {
  return {
    data() {
      // 对于 disabledParentProp 里的属性，getParentProp会直接取 defaultValue
      this.disabledParentProp = []
      return {}
    },
    computed: {
      attrs() {
        return this.getParentProp('attrs')
      },
      resetMergeData() {
        return {
          ...this.$attrs.resetMergeData,
          ...this.sup_this.resetMergeData
        }
      },
      sup_this() {
        return this.$attrs.parent || this.$attrs.sup_this || this.$parent
      }
    },
    watch: {
      sup_this: {
        handler() {
          this.setParentFns()
        },
        immediate: true
      }
    },
    beforeDestroy() {
      if (this.sup_this) {
        this.setParentFns(false)
      }
    },
    methods: {
      setParentFns(isSet = true) {
        this.sup_this[name] = isSet ? this : undefined
        fns.forEach((fnName) => {
          if (this[fnName] && (!this.sup_this[fnName] || this.sup_this[fnName].origin === name)) {
            this[fnName].origin = name
            this.sup_this[fnName] = isSet ? this[fnName] : undefined
          }
        })
      },
      getParentProp(prop, defaultValue = {}) {
        if (this.disabledParentProp.includes(prop)) return defaultValue

        return validData(this.$attrs[prop], this.sup_this[prop], defaultValue)
      },

      validData
    }
  }
}

/* eslint-disable */
import stepTypeMixin from '@/mixins/functional/stepTypeMixin'
import Vue from 'vue'
import { curry } from 'lodash'
import { validateWrapper } from '@/utils/functional'
import { validatenull } from '@/components/avue/utils/validate'

export default function (param) {
  const { options = {}, isInit = true } = param || {}
  return {
    mixins: [stepTypeMixin({ propOption: { default: 'edit' }, ...param })],
    computed: {
      options() {
        return options
      },
      option() {
        return this.getOption(this.curType, this.childKey || this.isBatch)
      },
      layout() {
        return this.getLayout()
      },
      permission() {
        return this.option.childPermission || {}
      },
      getOption() {
        return curry(getOption)(this.options).bind(this)
      }
    },
    created() {
      if (isInit) {
        this.typeInit()
        const init = this.option.init || this.init
        typeof init === 'function' && init()
      }
    },
    methods: {
      async doSubmit() {
        const valid = await this.validates()
        if (!valid) return
        
        const onsubmit = this.option.onsubmit || this.onsubmit
        if (typeof onsubmit === 'function') return onsubmit()
      },
      validates() {
        return this.validateWrapper([
          this.validate,
          this.option.validate
        ])
      },
      validate() {
        return this.validateWrapper(this.$refs.form?.validate)
      },
      validateWrapper(validates, isSync) {
        validates = Array.isArray(validates) ? validates : [validates]
        validates = validates.filter(item => item !== undefined)
        if (validatenull(validates)) return true
        
        return validateWrapper(
          validates,
          isSync
        )
      },
      
      getLayout() {
        return {
          ...this.options.defaultOption?.layout,
          ...this.defaultOption?.layout,
          ...this.option.layout
        }
      }
    }
  }
}


export function isVueComp(vuecomp) {
  return vuecomp instanceof Vue
}

export function getOption(options, type, childKey) {
  typeof childKey === 'boolean' && (childKey = childKey ? 1 : 0)
  
  const option = this?.[`${type}Option`] || options[type]
  const defaultOption = this?.defaultOption || options.defaultOption
  if (!option && !defaultOption) return {}
  
  const tempObj = {
    ...defaultOption,
    ...option,
    ...option?.[childKey]
  }
  
  if (isVueComp(this)) {
    for (const key in tempObj) {
      if (typeof tempObj[key] === 'function') {
        tempObj[key] = tempObj[key].bind(this)
      }
    }
  }
  
  return tempObj
}
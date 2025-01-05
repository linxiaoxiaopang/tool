/* eslint-disable no-undef */
import { createComponentInstance } from '@/extend/utils'
import dialog from '@/extend/components/dialog'
import { validData } from '@/components/avue/utils/util'

export default {
  install: (Vue) => {
    Vue.prototype.$dialogTable = function (options) {
      let {
        width = '840px',
        customClass = 'dialog-body-t15b35',
        hasFooter = false,
        data,
        option,
        componentAttrs
      } = options
      delete options.data
      
      Object.assign(options, {
        component: 'customTable',
        width,
        customClass,
        hasFooter,
        componentAttrs: {
          data,
          option,
          ...componentAttrs
        }
      })
      return extendDialogResolve.call(this, options)
    }
    Vue.prototype.$dialogForm = function (options) {
      let {
        width = '500px',
        customClass = 'dialog-body-t15b35',
        confirmText = '确定',
        option,
        componentAttrs
      } = options
      
      option.menuBtn = validData(option.menuBtn, false)
      
      Object.assign(options, {
        component: 'avueForm',
        width,
        customClass,
        confirmText,
        componentAttrs: {
          option,
          ...componentAttrs
        }
      })
      return extendDialogResolve.call(this, options)
    }
    Vue.prototype.$dialog = extendDialogResolve
    
    
    function extendDialogResolve(options) {
      return extendDialog.call(this, options)
    }
    async function extendDialog(options = {}) {
      const currentComponent = await createComponentInstance({
        component: dialog,
        option: {
          ...options,
          computed: {
            componentName() {
              return Array.isArray(options.component) ? 'componentList' : options.component
            },
            ...options.computed,
            options() {
              return options
            },
            componentAttrs() {
              return {
                ...options.componentAttrs,
                component: options.component
              }
            }
          },
          methods: {
            ...getExtendDialogMethods(options),
            onclosed() {
              currentComponent.closeDialog()
            },
            closeDialog() {
              currentComponent.$destroy()
            }
          }
        }
      })
      // console.log(currentComponent)
      
      this.$once('hook:beforeDestroy', currentComponent.closeDialog)
      this.$once('hook:deactivated', currentComponent.closeDialog)
      
      return currentComponent.dialogOpen(options.form)
    }
    function getExtendDialogMethods(options) {
      let methods = options.methods || {}
      
      let fnNames = ['validate', 'doFn', 'success', 'onopen', 'onopened', 'onclose', 'onclosed']
      fnNames.forEach(fnName => {
        let fn = methods[fnName] || options[fnName]
        if (typeof fn === 'function') {
          delete options[fnName]
          methods[fnName] = function () {
            typeof this[`${fnName}Fn`] === 'function' && this[`${fnName}Fn`]()
            return fn(this.form, this)
          }
        }
      })
      
      return methods
    }
  }
}

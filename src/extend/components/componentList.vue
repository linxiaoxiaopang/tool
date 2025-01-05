<template>
  <span>
    <callbackComponent
      v-for="(item, index) in component"
      :key="index"
      ref="components"
      v-bind="getComponentAttrs(item)"
      v-on="getComponentListeners(item)"
    ></callbackComponent>
  </span>
</template>

<script>
import callbackComponent from '@/extend/components/callbackComponent'

export default {
  inheritAttrs: false,
  name: 'ComponentList',
  components: {
    callbackComponent
  },
  props: {
    component: Array
  },
  methods: {
    async validate() {
      // console.log(this.$refs.components)
      let p = this.$refs.components?.map(async component => {
        // 不是vue组件（dom元素）
        if (component.isNativeDom()) return true

        let validate = component.$attrs.validate ? (() => component.$attrs.validate(this.form)) : component.validate
        // console.log(component, validate)
        return typeof validate === 'function' ? validate() : true
      })

      let valid = await promiseAll(p)
      console.log(valid)
      return valid.every(Boolean)
    },

    getComponentAttrs(item) {
      return {
        ...this.$attrs,
        ...item,
        ...item.componentAttrs
      }
    },
    getComponentListeners(item) {
      if (item.valueKey) {
        return {
          ...this.$listeners,
          input: () => {
            this.$emit('input', this.$attrs.value)
          }
        }
      }

      return this.$listeners
    }
  }
}
</script>
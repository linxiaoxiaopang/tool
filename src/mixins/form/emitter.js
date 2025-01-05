/* eslint-disable */
import Emitter from 'element-ui/src/mixins/emitter'

export default {
  mixins: [Emitter],
  props: {
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value)
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [value])
      }
    },
    handleChange(value) {
      this.$emit('change', value)
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [value])
      }
    },
    handleBlur(event) {
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.value])
      }
    }
  }
}
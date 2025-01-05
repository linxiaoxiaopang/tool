<script>
import dialog from '@/components/base/appDialog'
import baseForm from '@/components/base/baseForm'
import { getFormDataByOption } from '@/components/base/baseForm/util'
import { cloneDeep } from 'lodash'
import componentMethods from '@/mixins/componentMethods'

export default {
  extends: dialog,
  mixins: [
    componentMethods('body', ['resetFields'])
  ],
  props: {
    option: {
      default: () => ({})
    },
    getFormDataByOption: Boolean
  },
  computed: {
    componentName() {
      return baseForm
    },
    dialogAttrs() {
      return {

      }
    },
    btnAttrs() {
      return {

      }
    },
    bodyOptions() {
      return {
        ...this.$attrs,
        option: this.finalOption,
        value: this.curValue,
        type: this.type
      }
    },
    finalOption() {
      return {
        ...this.option,
        isSearch: false
      }
    }
  },
  methods: {
    cloneDeep(value) {
      return this.getFormDataByOption ? cloneDeep(getFormDataByOption(value, this.finalOption)) : cloneDeep(value)
    },

    clearValidate() {
      this.$refs.body.$refs.form.clearValidate()
    }
  }
}
</script>

<style lang="scss">
</style>

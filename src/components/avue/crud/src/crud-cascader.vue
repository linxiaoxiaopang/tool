<template>
  <el-cascader
    ref="cascader"
    :key="cascaderKey"
    v-model="text"
    :options="dic"
    :size="size"
    :placeholder="placeholder || '请选择'+placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :show-all-levels="showAllLevels"
    :props="cascaderProps"
    :collapse-tags="column.collapseTags"
    v-bind="$attrs"
    v-on="new$listeners"
  ></el-cascader>
</template>

<script>
import propsMixin from '../../mixins/propsMixin'
import { validatenull } from '@/components/avue/utils/validate'

export default {
  name: 'AvueCrudCascader',
  mixins: [propsMixin],
  props: {
    form: {
      type: Object,
      default: () => ({})
    },
    emitPath: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    showAllLevels: {
      type: Boolean,
      default: false
    },
    expandTrigger: {
      type: String
    },
    column: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      cascaderKey: 0
    }
  },
  computed: {
    config() {
      return {
        options: this.dic
      }
    },
    cascaderProps({ props, expandTrigger, emitPath, checkStrictly, isRadio, column }) {
      let {
        multiple
      } = column
      if (!expandTrigger && isRadio) expandTrigger = 'hover'
      return {
        ...this.lazyOption.props,
        ...props,
        expandTrigger,
        emitPath,
        checkStrictly,
        multiple
      }
    },
    isRadio({ checkStrictly, column: { multiple } }) {
      return checkStrictly && !multiple
    },
    new$listeners() {
      return {
        ...this.$listeners,
        change: this.handleCascaderChange
      }
    },
    lazyOption({ column: { lazy } }) {
      if (!lazy) return {}
      return {
        props: {
          lazy: true,
          lazyLoad: async (node, resolve) => {
            // console.log(node)
            if (node.data && validatenull(node.data.children) && typeof node.data.dicApi === 'function') {
              resolve(await node.data.dicApi(node))
            } else {
              resolve()
            }
          }
        }
      }
    }
  },
  watch: {
    config: {
      handler() {
        this.cascaderKey++
      },
      deep: true
    }
  },
  methods: {
    handleCascaderChange(val) {
      if (this.isRadio) this.$refs.cascader.dropDownVisible = false
      this.handleChange(val)
      // console.log(this.$refs.cascader.getCheckedNodes())
    },

    findDicItem(dic = this.options, node) {
      let item = find(dic, { label: node.label, value: node.value })
      if (item) return item

      dic.find(dicItem => {
        return item = dicItem.children && this.findDicItem(dicItem.children, node)
      })
      return item || value
    }
  }
}
</script>

<style>

</style>

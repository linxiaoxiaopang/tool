<template>
  <el-date-picker
    v-model="text"
    class="avue-date"
    popper-class="avue-date-popper"
    :size="size"
    :type="type"
    :format="format"
    :value-format="valueFormat"
    :placeholder="placeholder || '请输入'+label"
    :range-separator="rangeSeparator"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :disabled="disabled"
    :readonly="readonly"
    @change="handleChange"
  ></el-date-picker>
</template>

<script>
import {validatenull} from "@/components/avue/utils/validate";

export default {
  name: 'AvueCrudDate',
  props: {
    label: {
      type: String
    },
    value: {
      default: ''
    },
    size: {
      default: 'small'
    },
    type: {
      default: 'date'
    },
    valueFormat: {
      default: 'yyyy-MM-dd'
    },
    format: {
      default: ''
    },
    rangeSeparator: {
      type: String,
      default: '至'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      text: this.value
    }
  },
  watch: {
    value: {
      handler(n) {
        this.text = n
      },
      deep: true
    }
  },
  methods: {
    handleChange(value) {
      if (this.type==='daterange' && validatenull(value)) {
        this.$emit('input', [])
        this.$emit('change', [])
        this.$emit('search-change')
        return
      }
      this.$emit('input', value)
      this.$emit('change', value)
      this.$emit('search-change')
    }
  }
}
</script>

<style lang="scss" scoped></style>

<template>
  <!-- ElCheckboxGroup 的 input 事件比 change 事件 早一个$nextTick的时间 -->
  <!-- 使用 change 获取值，会导致form表单validate校验时，数据出问题 -->
  <!-- 因为validate会在input事件触发时校验 -->
  <el-checkbox-group
    v-model="text"
    class="avue-checkbox-group"
    :class="{ 'disabled-normal': readonly, [`avue-checkbox-group--${size}`]: size }"
    :size="size"
    :disabled="isDisabled"
    @input="handleChange"
    v-bind="$attrs"
  >
    <el-row :gutter="gutter">
      <el-col v-for="(item, index) in dic" :key="index" :span="1.5">
        <el-checkbox
          :label="item[dictValue]"
          :disabled="validData(item.disabled, !selectable(item))"
          class="avue-checkbox"
          @change="handleSelect(item, $event)"
        >
          {{ item[dictLabel] }}
        </el-checkbox>
      </el-col>
    </el-row>
  </el-checkbox-group>
</template>

<script>
import { validatenull } from '@/components/avue/utils/validate'
import { validData } from '@/components/avue/utils/util'

export default {
  name: 'AvueCrudCheckbox',
  props: {
    value: {
      default: () => {
        return []
      }
    },
    dic: {
      default: () => {
        return []
      }
    },
    props: {
      default: () => {
        return {}
      }
    },
    gutter: {
      type: Number,
      default: 20
    },
    size: {
      default: 'small'
    },
    readonly: Boolean,
    disabled: Boolean,
    selectable: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      text: []
    };
  },
  computed: {
    isDisabled({ readonly, disabled }) {
      return disabled || readonly
    },

    dictLabel() {
      return this.props.label || 'label'
    },
    dictValue() {
      return this.props.value || 'value'
    }
  },
  watch: {
    value: {
      handler(n, o) {
        this.text = this.value
      },
      immediate: true,
      deep: true
    },
    // 第一次点击，rules校验提示，第二次才消失
    text: {
      handler(n) {
        if (validatenull(this.value)) {
          this.$emit('input', n)
          this.$emit('change', n)
        }
      },
      immediate: true
    }
  },
  created() {
    this.text = this.value;
  },
  mounted() {},
  methods: {
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },

    handleSelect(row, selected) {
      this.$emit('select', row, selected)
    },

    validData
  }
}
</script>

<style lang="scss" scoped>
.avue-checkbox-group {
  overflow: hidden;
  &::v-deep .el-row:empty::before {
    display: none;
  }
}
.avue-checkbox {
  display: block;
}
.avue-checkbox-group--small {
  line-height: 32px;
}

.disabled-normal {
  .el-checkbox.is-disabled {
    .el-checkbox__input.is-disabled {
      .el-checkbox__inner {
        background-color: #FFF;
      }
      &.is-checked .el-checkbox__inner {
        background-color: #3841DB;
        border-color: #3841DB;
      }
      .el-checkbox__inner::after {
        border-color: #FFF;
      }
    }

    .el-checkbox__inner::after,
    .el-checkbox__inner,
    .el-checkbox__label {
      color: #666;
      cursor: pointer!important;
    }
  }
}
</style>

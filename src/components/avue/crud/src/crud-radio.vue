<template>
  <el-radio-group
    v-model="text"
    class="avue-radio-group"
    :class="[`avue-radio-group--${size}`, `avue-radio-group--${type}`]"
    :disabled="disabled"
    :size="size"
    @change="handleChange"
  >
    <el-row class="no-empty" :gutter="gutter">
      <el-col v-for="(item,index) in dic" :key="index" :span="1.5">
        <component
          :is="component"
          class="avue-radio"
          :uiid="`zd-radio-${index}`"
          :label="item[dictValue]"
          :border="validData(border, option.border)"
          @click.native="onclick(item[dictValue], item)"
        >{{
            item[dictLabel]
          }}</component>
      </el-col>
    </el-row>
  </el-radio-group>
</template>

<script>
import { validatenull } from '@/components/avue/utils/validate'
import { validData } from '@/components/avue/utils/util'
import { debounce } from 'lodash'

export default {
  name: 'AvueCrudRadio',
  props: {
    type: {
      default: 'radio'
    },
    value: {
      default: ''
    },
    gutter: {
      type: Number,
      default: 20
    },
    size: {
      type: String,
      default: 'small'
    },
    border: {},
    disabled: {
      type: Boolean,
      default: false
    },
    dic: {
      type: Array,
      default: () => {
        return [];
      }
    },
    props: {
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      text: ''
    };
  },
  computed: {
    option() {
      return {
        button: {
          component: 'elRadioButton'
        },
        'button-plain': {
          component: 'elRadio',
          border: true
        }
      }[this.type] || {}
    },
    component() {
      return this.option.component || 'elRadio'
    },

    dictLabel() {
      return this.props.label || 'label'
    },
    dictValue() {
      return this.props.value || 'value'
    },
  },
  watch: {
    value: {
      handler() {
        this.text = this.value;
      },
      immediate: true
    },
    // 第一次点击，rules校验提示，第二次才消失
    text: {
      handler(n) {
        if (validatenull(this.value)) {
          this.$emit('input', n)
          this.$emit("change", n)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change', value)
      this.$emit('search-change')
    },
    onclick: debounce(
      function (value, item) {
        this.$emit('click', value, item)
      }
    ),

    validData
  }
};
</script>

<style lang="scss" scoped>
.avue-radio-group {
  overflow: hidden;
}
//.avue-radio-group {
//  display: block;
//}
[class*=avue-radio-group--button] {
  .avue-radio {
    padding: 0;
  }
}
.avue-radio-group--button-plain {
  ::v-deep {
    .el-radio__input {
      display: none;
    }
    .el-radio__label {
      padding: 0 9px;
    }
    .el-radio.is-bordered+.el-radio.is-bordered {
      margin-left: 8px;
    }
    .el-radio--small.is-bordered .el-radio__label {
      font-size: 14px;
    }
  }
}
.avue-radio-group--text {
  ::v-deep {
    .el-radio__input {
      display: none;
    }
    .el-radio__label {
      padding-left: 0;
    }
    .el-radio .el-radio__input.is-checked + .el-radio__label {
      color: $color-primary;
    }
  }
}
</style>

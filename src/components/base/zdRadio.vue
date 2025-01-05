<template>
  <div class="zd-radio">
    <el-radio-group v-model="text" @change="handleChange" :size="size">
      <el-radio
        :class="[item.disuse ? 'disuse' : '']"
        :disabled="item.disuse || item.disabled"
        v-for="(item, index) in dic"
        :label="item.value"
        :key="index"
        :border="border"
      >
        <span>{{ item.label }}</span>
        <slot :name="item.label"></slot>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import { validatenull } from '@/components/avue/utils/validate'

export default {
  name: 'zdRadio',

  props: {
    value: {
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    },
    dic: {
      type: Array,
      default: () => {
        return []
      }
    },
    props: {
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {
      text: ''
    }
  },

  computed: {},

  watch: {
    value: {
      handler() {
        this.text = this.value
      },
      immediate: true
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

  methods: {
    handleChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss">
.zd-radio {
  .el-radio__label {
    padding-left: 10px;
    font-size: 16px;
    font-weight: 500;
    color: $color-title;
  }
  .el-radio__input.is-checked {
    border-color: $--color-primary;
    border: 3px;
    border-radius: 50%;
  }
  .el-radio__inner::after {
    width: 8px;
    height: 8px;
    background-color: $--color-primary;
  }
  .el-radio__inner,
  .el-radio__input {
    width: 16px;
    height: 16px;
    background-color: $color-white;
    border-radius: 50%;
  }

  .el-radio__label {
    font-size: 14px;
    height: 16px;
    line-height: 16px;
    color: $color-content;
  }
  .el-radio__input.is-checked + .el-radio__label {
    height: 16px;
    line-height: 16px;
  }

  .disuse {
    .el-radio__label {
      span {
        color: $color-placeholder;
      }
    }
    .el-radio__inner::after {
      width: 14px;
      height: 14px;
      background-color: #f2f3f5 !important;
    }
    .el-radio__inner,
    .el-radio__input {
      background-color: #f2f3f5 !important;
    }
  }
}
</style>

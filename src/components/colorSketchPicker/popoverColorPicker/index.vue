<template>
  <el-popover
    class="popover-color-picker-component"
    v-bind="all$Attrs"
  >
    <template>
      <Color :colors.sync="currentValue" :showCommonColors="false" v-bind="$attrs">
        <template #colorStraw>
          <div class="color-straw-wrapper mb10">
            <div class="color-value-wrapper">
              <el-input v-model="hexColor" @change="onChange" size="small"></el-input>
            </div>
          </div>
        </template>
      </Color>
    </template>
    <span class="reference" slot="reference">
      <span class="chunk" :style="chunkStyle"></span>
    </span>
  </el-popover>
</template>

<script>
import Color from '@/components/color'
import tinycolor from 'tinycolor2'

const DEFAULT_OPTION = {
  placement: 'bottom-start',
  title: '颜色',
  width: 245,
  trigger: 'click'
}

export default {
  components: {
    Color
  },

  props: {
    value: {
      type: String,
      default: '#000000'
    }
  },

  data() {
    return {
      currentValue: this.value || '#000000',
      hexColor: this.value || '#000000'
    }
  },

  computed: {
    chunkStyle({ value }) {
      return {
        background: value
      }
    },

    all$Attrs({ $attrs }) {
      return Object.assign({}, DEFAULT_OPTION, $attrs)
    }
  },

  watch: {
    currentValue: {
      handler(newVal) {
        newVal = tinycolor(newVal).toHexString()
        this.hexColor = newVal
        this.$emit('input', newVal)
      },
      deep: true
    },

    value(newVal) {
      this.currentValue = newVal
    }
  },

  methods: {
    onChange(newVal) {
      newVal = `${newVal}`
      const isExist = newVal.indexOf('#') === 0
      if (!isExist) newVal = `#${newVal}`
      this.currentValue = newVal
    }
  }
}

</script>

<style lang="scss" scoped>
.chunk {
  display: inline-block;
  width: 33px;
  height: 25px;
  border: 1px solid $border-color;
}

.color-straw-wrapper {
  display: inline-flex;
  justify-content: flex-start;

  ::v-deep {
    .color-value-wrapper {
      display: inline-block;
      box-sizing: border-box;
      padding: 0 8px;
      width: 48px;
      height: 32px;
      line-height: 32px;
      text-align: left;
      margin-right: 6px;
      background: $color-background;
    }

    .color-value-wrapper {
      width: 99px;

      .el-input {
        width: 100%;

        .el-input__inner {
          padding: 0;
          border: none;
          background: transparent;
        }
      }
    }

    .el-checkbox__input {
      display: none;
    }

    .el-checkbox__label {
      font-size: 12px;
      font-weight: 400;
      padding-left: 0;
      white-space: normal;
    }
  }
}
.popover-color-picker-component {
  display: inline-block;
  line-height: 1;
  font-size: 0;

  ::v-deep {
    .el-popover__reference {
      display: inline-block;
    }
  }
}
.reference{
}
</style>

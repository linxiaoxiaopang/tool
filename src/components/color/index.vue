<template>
  <div class="colorComponent">
    <ColorSketchPicker v-model="value" v-bind="$attrs" :class="['sketch-picker', customClass]">
      <template #colorStraw>
        <slot name="colorStraw"></slot>
      </template>
    </ColorSketchPicker>
  </div>
</template>

<script>
import ColorSketchPicker from '@/components/colorSketchPicker'
import { colorStr2Obj } from '@/utils'
export default {
  components: {
    ColorSketchPicker
  },
  props: {
    customClass: String,
    colors: {
      type: [Object, String],
      default: '#ffffff'
    }
  },

  data() {
    return {
      // value: '#FFAF4141',
      value: this.colors
    }
  },
  watch: {
    colors() {
      if (typeof this.colors === 'string') {
        this.value = colorStr2Obj({
          rgb: this.colors
        })
      }
    },

    value: {
      handler(newVal) {
        this.$emit('onColorChange', newVal)
        // this.$emit('update:colors', newVal.hex)
        this.$emit('update:colors', newVal.rgba)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.colorComponent {
  .title {
    text-align: left;
    margin-bottom: 10px;
    color: $color-gray;
  }
  .sketch-picker {
    width: 100%;
    box-sizing: border-box;
  }
  ::v-deep {
    .vc-sketch {
      box-shadow: none;
    }

    .vc-sketch {
      padding: 0;
    }

    .vc-sketch-controls {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>

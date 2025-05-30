<template>
  <div
    role="application"
    aria-label="Sketch color picker"
    :class="['vc-sketch', disableAlpha ? 'vc-sketch__disable-alpha' : '']"
  >
    <div class="vc-sketch-saturation-wrap">
      <saturation v-model="colors" @change="childChange"></saturation>
    </div>
    <div class="vc-sketch-controls">
<!--      <div class="vc-sketch-color-wrap">-->
<!--        <div-->
<!--          :aria-label="`Current color is ${activeColor}`"-->
<!--          class="vc-sketch-active-color"-->
<!--          :style="{ background: activeColor }"-->
<!--        ></div>-->
<!--        <checkboard></checkboard>-->
<!--      </div>-->

      <div class="vc-sketch-sliders">
        <div class="vc-sketch-hue-wrap">
          <hue v-model="colors" @change="childChange"></hue>
        </div>
<!--        <div class="vc-sketch-alpha-wrap" v-if="!disableAlpha">-->
<!--          <alpha v-model="colors" @change="childChange"></alpha>-->
<!--        </div>-->
      </div>
    </div>

    <slot name="colorStraw"> </slot>

    <div v-if="showCommonColors" class="vc-sketch-presets" role="group" aria-label="A color preset, pick one to set as current color">
      <div class="vc-sketch-presets-title">常用颜色</div>
      <div class="vc-sketch-presets-list">
        <template v-for="c in presetColors">
          <div
            v-if="!isTransparent(c)"
            class="vc-sketch-presets-color"
            :aria-label="'Color:' + c"
            :key="c"
            :style="{ background: c }"
            @click="handlePreset(c)"
          ></div>
          <div v-else :key="c" :aria-label="'Color:' + c" class="vc-sketch-presets-color" @click="handlePreset(c)">
            <checkboard />
          </div>
        </template>
      </div>
    </div>

    <div class="vc-sketch-field" v-if="!disableFieldsInRgba">
      <div class="vc-sketch-field--double">
        <ed-in label="hex" :value="hex" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single">
        <ed-in label="r" :value="colors.rgba.r" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single">
        <ed-in label="g" :value="colors.rgba.g" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single">
        <ed-in label="b" :value="colors.rgba.b" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single" v-if="!disableAlpha">
        <ed-in label="a" :value="colors.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
      </div>
    </div>

    <div class="vc-sketch-field" v-if="!disableFieldsInHsla">
      <div class="vc-sketch-field--single">
        <ed-in label="H" :value="colors.hsl.h" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single">
        <ed-in label="S" :value="colors.hsl.l" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single">
        <ed-in label="L" :value="colors.hsl.s" @change="inputChange"></ed-in>
      </div>
      <div class="vc-sketch-field--single" v-if="!disableAlpha">
        <ed-in label="A" :value="colors.hsl.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
      </div>
    </div>
  </div>
</template>

<script>
import colorMixin from './mixin/color'
import editableInput from './common/EditableInput.vue'
import saturation from './common/Saturation.vue'
import hue from './common/Hue.vue'
import alpha from './common/Alpha.vue'
import checkboard from './common/Checkboard.vue'

const presetColors = [
  '#000000',
  '#FFFFFF',
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2'
]

export default {
  name: 'Sketch',
  mixins: [colorMixin],
  components: {
    saturation,
    hue,
    alpha,
    'ed-in': editableInput,
    checkboard
  },
  props: {
    presetColors: {
      type: Array,
      default() {
        return presetColors
      }
    },
    disableAlpha: {
      type: Boolean,
      default: false
    },
    disableFieldsInRgba: {
      type: Boolean,
      default: true
    },
    disableFieldsInHsla: {
      type: Boolean,
      default: true
    },
    showCommonColors: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    hex() {
      let hex
      if (this.colors.a < 1) {
        hex = this.colors.hex8
      } else {
        hex = this.colors.hex
      }
      return hex.replace('#', '')
    },
    activeColor() {
      var rgba = this.colors.rgba
      return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')'
    }
  },
  methods: {
    handlePreset(c) {
      this.colorChange({
        hex: c,
        source: 'hex'
      })
    },
    childChange(data) {
      this.colorChange(data)
    },
    inputChange(data) {
      if (!data) {
        return
      }
      if (data.hex) {
        this.isValidHex(data.hex) &&
          this.colorChange({
            hex: data.hex,
            source: 'hex'
          })
      } else if (data.r || data.g || data.b || data.a) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: 'rgba'
        })
      }
    }
  }
}
</script>

<style>
.vc-sketch {
  position: relative;
  width: 200px;
  padding: 10px 10px 0;
  box-sizing: initial;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.15);
}

.vc-sketch-saturation-wrap {
  width: 100%;
  padding-bottom: 75%;
  position: relative;
  overflow: hidden;
}

.vc-sketch-controls {
  display: flex;
  padding: 15px 20px;
}

.vc-sketch-sliders {
  padding: 4px 0;
  flex: 1;
}

.vc-sketch-sliders .vc-hue,
.vc-sketch-sliders .vc-alpha-gradient {
  border-radius: 2px;
}

.vc-sketch-hue-wrap {
  position: relative;
  height: 15px;
}

.vc-sketch-alpha-wrap {
  position: relative;
  height: 10px;
  margin-top: 4px;
  overflow: hidden;
}

.vc-sketch-color-wrap {
  width: 20px;
  height: 20px;
  position: relative;
  margin-top: 4px;
  margin-left: 4px;
  border-radius: 50%;
  overflow: hidden;
  right: 10px;
}

.vc-sketch-active-color {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15), inset 0 0 4px rgba(0, 0, 0, 0.25);
  z-index: 2;
}

.vc-sketch-color-wrap .vc-checkerboard {
  background-size: auto;
}

.vc-sketch-field {
  display: flex;
  padding-top: 4px;
}

.vc-sketch-field .vc-input__input {
  width: 100%;
  padding: 4px 0 3px 10%;
  border: none;
  font-size: 10px;
  border: 1px solid #dcdee0;
  border-radius: 4px;
  color: #495060;
  margin: 0;
}

.vc-sketch-field .vc-input__label {
  display: block;
  text-align: center;
  font-size: 11px;
  color: #222;
  padding-top: 3px;
  padding-bottom: 4px;
  text-transform: capitalize;
}

.vc-sketch-field--single {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.vc-sketch-field--single+.vc-sketch-field--single {
    margin-left: 8px;
}

.vc-sketch-field--double {
  flex: 2;
}

.vc-sketch-presets {
  margin-right: -10px;
  margin-left: -10px;
  padding-left: 10px;
  padding-top: 10px;
}
.vc-sketch-presets-title {
  color: #86909C;
  font-size: 14px;
  margin-bottom: 10px;
}

.vc-sketch-presets-list {
  display: flex;
  width: 100%;
  /* justify-content: space-between; */
  flex-wrap: wrap;
}

.vc-sketch-presets-color {
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  margin: 0 10px 10px 0;
  vertical-align: top;
  cursor: pointer;
  width: 22px;
  height: 22px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
}

.vc-sketch-presets-color .vc-checkerboard {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.vc-sketch__disable-alpha .vc-sketch-color-wrap {
  height: 10px;
}
</style>

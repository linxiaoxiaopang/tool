<template>
  <div class="vc-editable-input">
    <span class="vc-editable-read-only-label" v-if="readOnly">
      {{ formatVal }}
    </span>
    <input
      v-else
      :aria-labelledby="labelId"
      class="vc-input__input"
      v-model="val"
      @keydown="handleKeyDown"
      @input="update"
      ref="input"
    >
    <span :for="label" class="vc-input__label" :id="labelId">{{ labelSpanText }}</span>
    <span class="vc-input__desc">{{ desc }}</span>
  </div>
</template>

<script>
export default {
  name: 'editableInput',
  props: {
    label: String,
    labelText: String,
    desc: String,
    value: [String, Number],
    max: Number,
    min: Number,
    readOnly: {
      type: Boolean,
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 1
    }
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(v) {
        // TODO: min
        if (!(this.max === undefined) && +v > this.max) {
          this.$refs.input.value = this.max
        } else {
          return v
        }
      }
    },

    formatVal({val}) {
      if(val >= 1 || val === 0) return parseInt(val)
      return ((val || 0) * 100).toFixed(0)  + '%'
    },

    labelId() {
      return `input__label__${this.label}__${Math.random().toString().slice(2, 5)}`
    },
    labelSpanText() {
      return this.labelText || this.label
    }
  },
  methods: {
    update(e) {
      this.handleChange(e.target.value)
    },
    handleChange(newVal) {
      let data = {}
      data[this.label] = newVal
      if (data.hex === undefined && data['#'] === undefined) {
        this.$emit('change', data)
      } else if (newVal.length > 5) {
        this.$emit('change', data)
      }
    },
    // **** unused
    // handleBlur (e) {
    //   console.log(e)
    // },
    handleKeyDown(e) {
      let val = this.val
      let number = Number(val)

      if (number) {
        let amount = this.arrowOffset || 1

        // Up
        if (e.keyCode === 38) {
          val = number + amount
          this.handleChange(val)
          e.preventDefault()
        }

        // Down
        if (e.keyCode === 40) {
          val = number - amount
          this.handleChange(val)
          e.preventDefault()
        }
      }
    }
    // **** unused
    // handleDrag (e) {
    //   console.log(e)
    // },
    // handleMouseDown (e) {
    //   console.log(e)
    // }
  }
}
</script>

<style lang="scss">
.vc-editable-input {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  position: relative;
}

.vc-editable-read-only-label {
  display: inline-block;
  width: 100%;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: $color-background;
  border-radius: 2px;
}

.vc-input__input {
  padding: 0;
  border: 0;
  outline: none;
}

.vc-input__label.vc-input__label.vc-input__label {
  text-transform: capitalize;
  color: #86909C;
  padding-top: 5px;
}
</style>


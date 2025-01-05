<template>
  <span class="el-pagination__jump" :class="[`jumper--${type}`]">
    跳至
    <el-input
      class="el-pagination__editor is-in-pagination"
      :style="{ width: option.width }"
      :min="1"
      :max="$parent.internalPageCount"
      :value="isFocus ? userInput !== null ? userInput : $parent.internalCurrentPage : placeholder"
      :disabled="$parent.disabled"
      @keyup.native="handleKeyup"
      @input="handleInput"
      @change="handleChange"
      @focus="isFocus = true"
      @blur="isFocus = false"
    />
    页
  </span>
</template>

<script>
import Locale from 'element-ui/src/mixins/locale'
import ElInput from 'element-ui/packages/input'

export default {
  inheritAttrs: false,
  mixins: [Locale],

  components: { ElInput },

  props: {
    type: {
      type: String,
      default: 'default'
    }
  },

  data() {
    return {
      userInput: null,
      isFocus: false
    }
  },

  computed: {
    option() {
      return {
        slash: {
          placeholder: 'page',
          width: '97px'
        },
        default: {
          placeholder: `page`,
          width: '48px'
        }
      }[this.type]
    },
    placeholder({ option: { placeholder } }) {
      placeholder = placeholder.replace('page', this.$parent.internalCurrentPage)
      placeholder = placeholder.replace('total', this.$parent.internalPageCount)
      return placeholder
    }
  },

  watch: {
    '$parent.internalCurrentPage'() {
      this.userInput = null
    }
  },

  methods: {
    handleKeyup({ keyCode, target }) {
      // Chrome, Safari, Firefox triggers change event on Enter
      // Hack for IE: https://github.com/ElemeFE/element/issues/11710
      // Drop this method when we no longer supports IE
      if (keyCode === 13) {
        this.handleChange(target.value)
      }
    },
    handleInput(value) {
      this.userInput = value
    },
    handleChange(value) {
      this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(value)
      this.$parent.emitChange()
      this.userInput = null
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.el-pagination__jump {
  &.jumper--default {

  }
}
</style>

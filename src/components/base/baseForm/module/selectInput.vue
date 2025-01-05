<template>
  <div
    v-if="curItem.type === 'daterange'"
    v-auto-append-width="finalWidth"
    class="select-input el-input el-input-group el-input-group--prepend"
  >
    <div class="el-input-group__prepend">
      <avue-crud-select
        :size="size"
        :style="{ width: labelMaxWidth + 'px' }"
        v-model="curType"
        :dic="dicData"
        :clearable="false"
      ></avue-crud-select>
    </div>
    <div>
      <avueCrudDate
        v-model="text"
        class="input__inner"
        :size="size"
        :type="curItem.type"
        :placeholder="placeholders[curType]"
        @search-change="changeForm"
      ></avueCrudDate>
    </div>
  </div>
  <el-input
    v-else
    v-model="text"
    :size="size"
    class="select-input"
    clearable
    v-auto-append-width="finalWidth"
    :placeholder="placeholders[curType]"
    @keyup.enter.native="changeForm"
    @clear="changeForm"
  >
    <avue-crud-select
      slot="prepend"
      :size="size"
      :style="{ width: labelMaxWidth + 'px' }"
      v-model="curType"
      :dic="dicData"
      :clearable="false"
    ></avue-crud-select>
  </el-input>
</template>

<script>
import { isArray } from 'lodash'
import { setPx, validData } from '@/components/avue/utils/util'
import { validatenull } from '@/components/avue/utils/validate'

function calcAutoWidth(el) {
  const inputDom = el.querySelector('.el-input input')
  const inputValue = inputDom.value
  const spanDom = document.createElement('span')
  spanDom.innerHTML = inputValue
  document.body.appendChild(spanDom)
  const { font } = getComputedStyle(inputDom)
  Object.assign(spanDom.style, {
    font
  })

  const offsetWidth = spanDom.offsetWidth
  const paddingNum = 47 //左右边距
  const value = offsetWidth + paddingNum
  spanDom.parentNode.removeChild(spanDom)
  return value
}

export default {
  name: 'SelectInput',
  inheritAttrs: false,
  props: {
    dic: Array,
    form: {
      type: Object,
      default: () => ({})
    },
    btnWidth: {
      type: [String, Number],
      default: 'auto'
    },
    size: String
  },
  data() {
    return {
      curType: '',
      text: ''
    }
  },

  directives: {
    autoAppendWidth(el, binging) {
      let { value } = binging
      const selectDom = el.querySelector('.el-input-group__prepend .el-select')
      if (!value) return
      setTimeout(() => {
        if (value === 'auto') {
          value = calcAutoWidth(el)
        }
        selectDom.style.width = setPx(value)
      })
    }
  },
  computed: {
    finalWidth({ dicData, curType, btnWidth }) {
      const curWidth = dicData.find(({ value }) => value == curType)?.btnWidth
      return validData(curWidth, btnWidth, null)
    },
    curItem({ curType }) {
      return this.dicData.find(({ value }) => value === curType)
    },

    placeholders({ dicData }) {
      let tempObj = {}
      dicData.forEach(item => {
        tempObj[item.value] = item.placeholder
          || this.$attrs?.replacePlaceholder?.replace('key', item.label)
          || `输入 ${item.label} 搜索`
      })
      return tempObj
    },
    ignoreKeysObj({ dicData }) {
      return dicData.reduce((prev, next) => {
        prev[next.value] = undefined
        return prev
      }, {})
    },
    dicData() {
      return this.dic || []
    },
    labelMaxWidth() {
      return Math.ceil(
        this.dicData.reduce((prev, next) => {
          return Math.max(prev, next.label.pxWidth())
        }, 0)
      ) + 45
    }
  },
  watch: {
    curType() {
      let val = this.text
      this.formInit()
      if (!validatenull(val) && !this.searchChangeLock) {
        this.changeForm()
      }
    },
    dicData: {
      handler(n) {
        let curType = n[0]?.value
        if (isArray(n)) {
          const fItem = n.find(item => this.form[item.value])
          if (fItem) {
            curType = fItem.value
          }
        }
        this.curType = curType
        this.text = this.form[this.curType] || ''
        this.formInit()
        this.formatForm()
        this.searchChangeLock = true //第一次初始化curType，不加载数据
        setTimeout(() => {
          this.searchChangeLock = false
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    formatForm() {
      Object.assign(
        this.form,
        this.ignoreKeysObj,
        {
          [this.curType]: this.text
        }
      )
    },

    changeForm() {
      this.formatForm()
      this.$emit('change')
      this.$emit('search-change', this.curType, this.text)
    },

    formInit() {
      let val = this.text
      const typeVal = this.curItem.type === 'daterange' ? [] : ''
      this.text = typeof typeVal !== typeof val ? typeVal : val
    }
  }
}
</script>

<style lang="scss"></style>

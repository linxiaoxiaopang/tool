<template>
  <el-col
    class="avue-form__row"
    :class="colClass"
    :offset="column.offset"
    :pull="column.pull"
    :md="span"
    :sm="spansm"
    :xs="24"
    :span="24"
    :style="style"
  >
    <el-form-item
      :label="column.label"
      :prop="column.prop"
      :size="size"
      :label-width="labelWidth"
      :show-message="showMessage"
      :error="errorMsg[column.prop]"
      :class="itemClass"
    >
      <slot
        v-if="slotName"
        :name="slotName"
        :form="form"
        :prop="column.prop"
        :label="column.label"
        :value="form[column.prop]"
        :disabled="isDisabled"
        :readonly="isReadonly"
        :column="column"
        :dic="dic"
        :size="size"
        :placeholder="column.placeholder"
        :setError="setError"
        :validate="handleValidate"
      ></slot>
      <component
        v-else
        v-bind="contentAttrs"
        :is="contentComponent"
        :uiid="`zd-${column.prop}`"
        v-model="form[column.prop]"
        :style="contentStyle"
        :trim="column.trim"
        :column="column"
        :precision="column.precision"
        :label="column.label"
        :props="column.props"
        :placeholder="column.placeholder"
        :clearable="column.clearable"
        :type="column.type"
        :size="size"
        :prefix-icon="column.prefixIcon"
        :minRows="column.minRows"
        :maxRows="column.maxRows"
        :maxlength="column.maxlength"
        :dic="dic"
        :disabled="isDisabled"
        :readonly="isReadonly"
        :format="column.format"
        :value-format="column.valueFormat"
        :emitPath="column.emitPath"
        :checkStrictly="column.checkStrictly"
        :show-all-levels="column.showAllLevels"
        :expandTrigger="column.expandTrigger"
        :controls="column.controls"
        :controls-position="column.controlsPosition"
        @search-change="searchChange"
      ></component>
      <slot
        v-if="column.appendSlot"
        :name="`${column.prop}Append`"
        :form="form"
        :column="column"
        :dic="dic"
        :size="size"
        :setError="setError"
        :validate="handleValidate"
      >
        <slot
          name="columnAppend"
          :form="form"
          :column="column"
          :disabled="isDisabled"
          :readonly="isReadonly"
          :dic="dic"
          :size="size"
          :setError="setError"
          :validate="handleValidate"
        ></slot>
      </slot>
    </el-form-item>
  </el-col>
</template>

<script>
import { DEFAULT_FORM_SIZE } from '@/components/avue/utils/const/config'
import { upperFirst } from 'lodash'
import { setDic, setPx, validData, getComponent } from '@/components/avue/utils/util'

export default {
  name: 'formTemp',
  props: {
    form: {
      type: Object,
      default: () => ({})
    },
    column: {
      type: Object,
      default: () => ({})
    },
    group: {
      type: Object,
      default: () => ({})
    },
    option: {
      type: Object,
      default: () => ({})
    },
    DIC: {
      type: Object,
      default: () => ({})
    },
    errorMsg: {
      type: Object,
      default: () => ({})
    },
    disabled: Boolean,
    readonly: Boolean
  },
  data() {
    return {
      DEFAULT_FORM_SIZE
    }
  },
  computed: {
    dic() {
      return setDic(this.column, this.DIC)
    },
    slotName({ column, $scopedSlots }) {
      if (!validData(column.formslot, column.slotName, $scopedSlots[column.prop])) return
      return column.slotName || column.prop
    },
    labelWidth() {
      return setPx(this.column.labelWidth, validData(this.group.labelWidth, this.option.labelWidth, 80))
    },
    size() {
      return this.column.size || this.group.size || DEFAULT_FORM_SIZE
    },
    showMessage({ column }) {
      return validData(
        column.showMessage,
        !(this.isDisabled || this.isReadonly)
      )
    },
    isDisabled() {
      return validData(this.column.disabled, this.group.disabled, this.option.disabled, this.disabled)
    },
    isReadonly() {
      return validData(this.column.readonly, this.group.readonly, this.option.readonly, this.readonly)
    },

    contentComponent() {
      return this.getComponent(this.column.type)
    },
    contentAttrs() {
      return { ...this.column, dicData: [] }
    },
    contentStyle() {
      return { width: setPx(this.column.contentWidth, this.option.contentWidth) }
    },

    itemClass({ column }) {
      return { 'column-append': validData(column.appendFlex, column.appendSlot) }
    },
    colClass({ column }) {
      return { [`avue-form__row--${column.prop}`]: column.prop }
    },

    span() {
      return this.column.span || this.group.span || this.option.span || 12
    },
    spansm() {
      return this.column.spansm || this.group.spansm || this.option.spansm || 12
    },
    style({ column, option }) {
      return { width: setPx(column.width, option.itemWidth), marginLeft: setPx(column.marginLeft) }
    }
  },
  watch: {

  },
  methods: {
    searchChange(...args) {
      this.$emit('search-change', this.column.prop, args)
    },
    setError(prop, error) {
      // console.log(prop, error)
      let { errorMsg } = this
      if (errorMsg[prop] === error) {
        errorMsg[prop] = ''
        this.$nextTick(function () {
          this.$set(errorMsg, prop, error)
        })
      } else {
        this.$set(errorMsg, prop, error)
      }
    },
    handleValidate(prop, valid, error) {
      // console.log(prop, valid, error)
      this.setError(prop, error)
    },

    getComponent(type) {
      return upperFirst(getComponent(type)).replace(/^(avue)?/i, 'avue')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
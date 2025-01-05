<template>
  <div class="extend-dialog-wrapper1">
    <span v-if="getBtnName()" class="extend-dialog-btn">
      <component :is="getBtnName()" :loading="btnLoading" v-bind="btnOptions" @click="onclick"></component>
    </span>
    <span v-else-if="btnOptions.hasBtn" class="extend-dialog-btn" @click="onclick">
      <slot>
        <el-button :loading="btnLoading" v-bind="btnOptions">
          {{ btnOptions.text }}
        </el-button>
      </slot>
    </span>
    <component
      v-if="showDialog"
      v-el-drag-dialog="dialogOptions.is === 'elDialog'"
      :visible.sync="dialogVisible"
      v-bind="dialogOptions"
      @open="doOpen"
      @opened="doOpened"
      @close="doClose"
      @closed="doClosed"
    >
      <template v-if="dialogOptions.titleIcon || dialogOptions.titleHtml" #title>
        <customIcon
          v-if="dialogOptions.titleIcon"
          style="margin-right: 8px"
          v-bind="getCustomIconAttrs(dialogOptions.titleIcon)"
        ></customIcon>
        <span class="el-dialog__title" v-html="dialogOptions.titleHtml">{{ dialogOptions.title }}</span>
      </template>

      <slot name="bodyHeader"></slot>

      <component
        ref="body"
        :is="getComponentName()"
        :visible.sync="dialogVisible"
        v-bind="bodyOptions"
        v-on="new$listeners"
        @body-input="handleBodyInput"
      >
        <template v-for="(val, key) in $scopedSlots" v-slot:[key]="scope">
          <slot :name="key" v-bind="scope"></slot>
        </template>
      </component>

      <slot name="bodyFooter"></slot>

      <template v-if="dialogOptions.hasFooter" #footer>
        <base-button v-if="dialogOptions.cancelBtn" class="text-small" @click="dialogClose">{{
            dialogOptions.cancelText
          }}</base-button>
        <stepButton
          v-if="dialogOptions.confirmBtn"
          :last-text="dialogOptions.confirmText"
          v-model="step"
          :length="stepLen"
          :before-next="beforeNext"
          @submit="doSubmit"
        ></stepButton>
      </template>
    </component>
  </div>
</template>

<script>
import promise from '@/extend/mixins/dialog/promise'
import { setPx, validData } from '@/components/avue/utils/util'
import { getCustomIconAttrs } from '@/components/base/customIcon/utils'
import { defaultOptions, btnDefaultOptions, dialogProps, btnProps } from './const'

import { upperFirst, cloneDeep } from 'lodash'
import stepButton from '@/views/components/stepButton'

export default {
  inheritAttrs: false,
  components: {
    edit: {},
    stepButton
  },
  mixins: [promise],
  props: {
    sup_this: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    },
    loading: Boolean,

    type: {
      default: 'edit'
    },
    value: {
      default: () => ({})
    },
    isDeepValue: {
      type: Boolean,
      default: true
    },

    isOriginData: Boolean,
    isLoadingOnSubmit: {
      type: Boolean,
      default: true
    },
    beforeSubmit: {
      type: Function,
      default: () => true
    },

    beforeOpen: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      curType: this.type,
      curValue: this.value,

      step: 0,
      stepLen: 1,

      btnLoading: false,
      // 为了使dialog动画执行：渲染dialog之后，再打开dialog(visible = true)；在关闭dialog(visible = false)时，延迟销毁dialog
      closeDialogLock: false, // 只有closeDialogLock为false才能销毁dialog，在closed后closeDialogLock设为false
      dialogVisibleImmediate: false, // dialogVisible的直接值：立即渲染dialog
      dialogVisibleDelay: false // dialogVisible的延迟值：渲染dialog之后，然后再打开dialog
    }
  },
  computed: {
    showDialog() {
      return this.closeDialogLock || !this.btnOptions.hasBtn || this.dialogVisibleImmediate
    },
    dialogVisible: {
      get() {
        return this.dialogVisibleDelay
      },
      set(val) {
        val && (this.closeDialogLock = true)
        this.dialogVisibleImmediate = val
        this.$nextTick(function () {
          this.dialogVisibleDelay = val
        })
      }
    },

    dialogOptions({ dialogAttrs = {} }) {
      let tempObj = {}
      Object.keys(defaultOptions).concat(dialogProps).forEach((prop) => {
        tempObj[prop] = validData(this.getDialogProp(prop), dialogAttrs[prop], defaultOptions[prop])
      })

      tempObj.customClass = [
        dialogAttrs.customClass,
        defaultOptions.customClass,
        this.customClass,
        this.$attrs.customClass
      ]
        .filter((item) => item && item.trim())
        .join(' ')

      return {
        ...defaultOptions,
        ...dialogAttrs,
        ...tempObj,
        width: setPx(tempObj.width, dialogAttrs.width, defaultOptions.width)
      }
    },
    btnOptions({ btnAttrs = {} }) {
      let tempObj = {}
      Object.keys(btnDefaultOptions).concat(btnProps).forEach((prop) => {
        tempObj[prop] = validData(this.getDialogProp(`btn${upperFirst(prop)}`), btnAttrs[prop], btnDefaultOptions[prop])
      })
      return {
        ...btnDefaultOptions,
        ...btnAttrs,
        ...tempObj,
        hasBtn: validData(this.getDialogProp('hasBtn'), tempObj.hasBtn),
        text: validData(tempObj.text, btnAttrs.text, btnDefaultOptions.text, this.dialogOptions.title)
      }
    },
    bodyOptions({ bodyAttrs }) {
      return {
        ...bodyAttrs,
        ...this.$props,
        ...this.$attrs,
        step: this.step,
        value: this.curValue,
        type: this.curType
      }
    },

    new$listeners() {
      return {
        ...this.$listeners,
        input: this.oninput,
        success: this.onsuccess,
        cancel: this.oncancel,
        ...this.bodyListeners
      }
    }
  },
  watch: {
    visible: {
      handler(n) {
        if (n) {
          this.dialogOpen()
        }
        this.dialogVisible = n
      },
      immediate: true
    },
    dialogVisible(n) {
      this.$emit('update:visible', n)
    },

    loading: {
      handler(loading) {
        this.btnLoading = loading
      },
      immediate: true
    }
  },
  methods: {
    async doSubmit() {
      let res = await this.onsubmit()
      if (!res && res !== undefined) return
      this.dialogClose()
      this.runFn(this.valueResolve, res)
    },
    onsubmit() {
      return this.onsubmitFn()
    },
    async onsubmitFn() {
      if (!await this.validate()) return

      let valid = await this.beforeSubmit(this.curValue)
      if (!valid) return false

      let res = await this.doFn()
      res && this.success()
      return res
    },
    validate() {
      let { validate } = this.$refs.body || {}
      return typeof validate === 'function' ? validate() : true
    },
    doFn() {
      let promise = this.createPromise()

      this.$emit('submit', this.curValue, this.submitDone, this)
      let { onsubmit } = this.$refs.body || {}
      typeof onsubmit === 'function' && onsubmit(this.curValue, this.submitDone, this)

      this.isLoadingOnSubmit && awaitLoading(promise)
      return promise
    },
    async submitDone(valid = true) {
      if (!this.isOriginData && valid instanceof Promise) {
        valid = await awaitResolve(valid)
      }
      this.valueResolve(valid)
    },
    success() {
      this.$message.success('操作成功')
      this.$emit('success')
    },

    async dialogOpen(value = this.value, type = this.type) {
      this.curType = type
      this.curValue = this.isDeepValue ? this.cloneDeep(value) : value

      this.dialogVisible = true

      return this.createPromise()
    },
    dialogClose() {
      this.dialogVisible = false
    },
    handleBodyInput(type) {
      this.curType = type
    },

    beforeOpenFn() {
      return this.beforeOpen()
    },
    async onclick() {
      if (this.btnLoading) return

      this.btnLoading = true
      let valid = await this.beforeOpenFn()
      this.btnLoading = false
      if (!valid) return

      return this.dialogOpen()
    },
    oninput(...args) {
      this.$emit('input', ...args)
    },
    onsuccess(...args) {
      this.dialogClose()
      this.$emit('success', ...args)
    },
    oncancel(...args) {
      this.dialogClose()
      this.$emit('cancel', ...args)
    },

    doOpen(...args) {
      // console.log('doOpen')
      this.$emit('open')
      return this.runFn(this.onopen, ...args)
    },
    doOpened(...args) {
      // console.log('doOpened')
      this.$emit('opened')
      return this.runFn(this.onopened, ...args)
    },
    doClose(...args) {
      // console.log('doClose')
      this.$emit('close')
      this.runFn(this.$refs.body.onclose, ...args)
      return this.runFn(this.onclose, ...args)
    },
    doClosed(...args) {
      // console.log('doClosed')
      this.closeDialogLock = false
      this.$emit('closed')
      this.runFn(this.$refs.body.onclosed, ...args)
      return this.runFn(this.onclosed, ...args)
    },

    getDialogProp(prop) {
      return validData(this.$attrs[prop], this[prop])
    },
    getComponentName() {
      return validData(this.componentName, this.componentNames?.[this.curType], 'edit')
    },
    getBtnName() {
      return this.btnName
    },

    async beforeNext() {
      let { beforeNext } = this.$refs.body || {}
      return typeof beforeNext === 'function' ? beforeNext() : true
    },

    runFn(fn, ...args) {
      return typeof fn === 'function' && fn(...args)
    },
    getCustomIconAttrs,
    cloneDeep
  }
}
</script>

<style lang="scss">
.extend-dialog-wrapper1 {
  display: inline-block;
}
.extend-dialog-btn {
  .el-button {
    font-size: 14px;

    &.el-button--small:not(.el-button--text) {
      height: 32px;
      padding: 0 12px;
    }
  }
}

.extend-dialog {
  .svg-icon {
    position: relative;
    font-size: 18px;
  }

  .el-table,
  &.el-table {
    //border-top: 1px solid $border-color;
    //border-left: 1px solid $border-color;

    th {
      //border-right: 1px solid $border-color;
    }
  }

  &.dialog-body-center {
    .el-dialog__body {
      text-align: center;
    }
  }

  .el-dialog__footer {
    .el-button {
      margin: 0 0 0 10px;
      border-radius: 2px;
      &.step-button {
        margin-left: 0;
      }

      &.el-button--default {
        color: #1a1a1a;
      }
    }
  }
}
</style>

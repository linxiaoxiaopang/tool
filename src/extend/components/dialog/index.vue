<template>
  <div class="inline-block">
    <span v-if="getBtnName()" class="extend-dialog-btn">
      <component
        :is="getBtnName()"
        :loading="btnLoading"
        v-bind="btnOptions"
        @click="onclick"
      ></component>
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
      <template v-if="getDialogOptions('titleIcon') || getDialogOptions('titleHtml')" #title>
        <customIcon
          v-if="getDialogOptions('titleIcon')"
          style="margin-right: 8px;"
          v-bind="getCustomIconAttrs(getDialogOptions('titleIcon'))"
        ></customIcon>
        <span
          class="el-dialog__title"
          v-html="getDialogOptions('titleHtml')"
        >{{ getDialogOptions('title') }}</span>
      </template>

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

      <template v-if="getDialogOptions('hasFooter')" #footer>
        <el-button
          v-if="getDialogOptions('cancelBtn')"
          class="text-small"
          @click="dialogClose"
        >{{ getDialogOptions('cancelText') }}</el-button>
        <loadingBtn
          v-if="getDialogOptions('confirmBtn')"
          class="text-small"
          type="primary"
          @click="doSubmit"
        >{{ getDialogOptions('confirmText') }}</loadingBtn>
      </template>
    </component>
  </div>
</template>

<script>
import propsMixin from '@/mixins/dialog/props'
import { setPx, validData } from '@/components/avue/utils/util'
import { getCustomIconAttrs } from '@/components/base/customIcon/utils'
import { defaultOptions, dialogProps, btnProps } from './const'
import promise from '@/extend/mixins/dialog/promise'

import { upperFirst } from 'lodash'

export default {
  inheritAttrs: false,
  components: {
    edit: {}
  },
  mixins: [
    promise,
    propsMixin({
      type: 'edit',
      value: {
        default: () => ({})
      }
    })
  ],
  props: {
    sup_this: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    },
    loading: Boolean
  },
  data() {
    return {
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

    dialogOptions() {
      let tempObj = {}
      dialogProps.forEach(prop => {
        tempObj[prop] = this.getDialogOptions(prop)
      })

      tempObj.customClass = [
        'extend-dialog',
        this.dialogAttrs?.customClass,
        defaultOptions.customClass,
        this.customClass,
        this.$attrs.customClass
      ].filter(item => item && item.trim()).join(' ')
      tempObj.width = setPx(tempObj.width, defaultOptions.width)
      return tempObj
    },
    btnOptions({ btnAttrs }) {
      let tempObj = {
        hasBtn: true,
        size: 'small',
        text: this.dialogOptions.title
      }
      btnProps.forEach(prop => {
        tempObj[prop] = validData(
          this.getDialogOptions(`btn${upperFirst(prop)}`),
          tempObj[prop]
        )
      })
      return {
        ...tempObj,
        ...btnAttrs
      }
    },
    bodyOptions({ bodyAttrs }) {
      return {
        ...this.$attrs,
        ...this.$props,
        ...bodyAttrs,
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
      let res = typeof this.onsubmit === 'function' ? await this.onsubmit() : true
      if (!res) return
      this.dialogClose()
      this.runFn(this.valueResolve, res)
    },
    onsubmit() {
      let { onsubmit } = this.$refs.body || {}
      return typeof onsubmit === 'function' ? onsubmit() : true
    },
    async dialogOpen(value = this.curValue, type = this.curType) {
      this.curType = type
      this.curValue = value

      this.dialogVisible = true

      this.$nextTick(function () {
        this.runFn(this.$refs.body.dialogOpen, value, type)
      })
      return this.createPromise()
    },
    dialogClose() {
      this.dialogVisible = false
    },
    handleBodyInput(type) {
      this.curType = type
    },

    onclick() {
      if (this.btnLoading) return
      this.dialogVisible = true
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
      this.runFn(this.$refs.body?.onclose, ...args)
      return this.runFn(this.onclose, ...args)
    },
    doClosed(...args) {
      // console.log('doClosed')
      this.closeDialogLock = false
      this.$emit('closed')
      this.runFn(this.$refs.body?.onclosed, ...args)
      return this.runFn(this.onclosed, ...args)
    },

    getDialogOptions(prop) {
      return validData(this[prop], this.$attrs[prop], this.dialogAttrs?.[prop], defaultOptions[prop])
    },
    getComponentName() {
      return validData(this.componentName, this.componentNames?.[this.curType], 'edit')
    },
    getBtnName() {
      return this.btnName
    },
    getCustomIconAttrs,

    runFn(fn, ...args) {
      return typeof fn === 'function' && fn(...args)
    }
  }
}
</script>

<style lang="scss">
.extend-dialog-btn {
  .el-button {
    font-size: $text-small;

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
    border-top: 1px solid $border-color;
    border-left: 1px solid $border-color;

    th {
      border-right: 1px solid $border-color;
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

      &.el-button--default {
        color: #1A1A1A;
      }
    }
  }
}
</style>

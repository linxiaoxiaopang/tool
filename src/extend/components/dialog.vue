<template>
  <div class="menu-btn-item">
    <span v-if="getOptions('hasBtn')" class="extend-dialog-btn" @click="dialogOpen">
      <slot>
        <el-button :type="getOptions('btnType')" :size="getOptions('btnSize')" v-bind="getOptions('btnAttrs')">
          {{ getOptions('btnText') }}
        </el-button>
      </slot>
    </span>
    <el-dialog
      v-el-drag-dialog
      v-if="!getOptions('hasBtn') || dialogVisible"
      :visible.sync="dialogVisible"
      v-bind="dialogOptions"
      v-on="dialogListeners"
      @open="doOpen"
      @opened="doOpened"
      @close="doClose"
      @closed="doClosed"
    >
      <template v-if="dialogOptions.titleIcon" #title>
        <customIcon v-bind="getCustomIconAttrs(dialogOptions.titleIcon)"></customIcon>
        <span class="el-dialog__title" style="margin-left: 8px;">{{ dialogOptions.title }}</span>
      </template>

      <component
        ref="child"
        v-if="showChildComponent"
        v-model="form"
        :is="componentName"
        v-bind="bodyAttrs"
        :sup_this="curThis"
        v-on="new$listeners"
      ></component>

      <template v-if="dialogOptions.hasFooter" #footer>
        <base-button v-if="dialogOptions.cancelBtn" class="text-small" @click="dialogClose">{{ dialogOptions.cancelText }}</base-button>
        <loadingBtn v-if="dialogOptions.confirmBtn" class="text-small" type="primary" @click="onsubmit">{{ dialogOptions.confirmText }}</loadingBtn>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import propsMixin from '@/mixins/dialog/props'
import dialogComponentsMixin from '@/mixins/dialog'
import dialogMethods from '@/extend/mixins/dialog/dialogMethods'
import componentList from './componentList'
import customTable from '@/views/components/base/customTable'
import { setPx, validData } from '@/components/avue/utils/util'
import { getCustomIconAttrs } from '@/components/base/customIcon/utils'
import { defaultOptions, defaultOption } from './const'

export default {
  inheritAttrs: false,
  components: {
    bodyComponent: {},
    componentList,
    customTable
  },
  mixins: [
    dialogMethods,
    propsMixin({
      type: 'edit'
    }),
    dialogComponentsMixin
  ],
  data() {
    return {
      curThis: this,
      form: {}
    }
  },
  computed: {
    dialogOptions({ dialogAttrs, defaultOptions, options }) {
      dialogAttrs = dialogAttrs || {}
      options = options || {}

      let customClass = [
        'extend-dialog',
        dialogAttrs.customClass,
        defaultOptions.customClass,
        options.customClass,
        this.customClass
      ].filter(item => item && item.trim()).join(' ')

      return {
        ...defaultOptions,
        ...dialogAttrs,
        ...options,
        customClass: customClass,
        width: setPx(dialogAttrs.width, defaultOptions.width)
      }
    },
    defaultOptions({ options }) {
      let tempObj = {}
      for (const key in defaultOptions) {
        tempObj[key] = validData(options[key], this[key], defaultOptions[key])
      }
      return tempObj
    },
    dialogListeners() {
      return this.$listeners
    },
    options() {
      return {}
    },

    componentNames() {
      return {
        edit: 'bodyComponent'
      }
    },
    componentName() {
      return validData(this.componentNames[this.curType], 'bodyComponent')
    },
    bodyAttrs({ options: { componentAttrs = this.componentAttrs } }) {
      return {
        ...this.$attrs,
        ...this.$props,
        ...componentAttrs
      }
    },

    new$listeners() {
      return {
        success: this.onsuccess,
        cancel: this.oncancel,
        ...this.bodyListeners
      }
    }
  },
  methods: {
    getCustomIconAttrs,
    dialogOpen(value = this.value || {}, type = this.type) {
      this.dialogVisible = true
      this.curType = type
      this.form = value
      return this.dialogOpenFn(value, type)
    },
    dialogClose() {
      this.dialogVisible = false
    },

    onsuccess(...args) {
      this.dialogClose()
      this.$emit('success', ...args)
    },
    oncancel(...args) {
      this.dialogClose()
      this.$emit('cancel', ...args)
    },

    doOpen() {
      if (this.destroyChildAfterClose) {
        this.showChildComponent = true
      }
      this.runFn(this.onopen)
    },
    doOpened() {
      this.runFn(this.onopened)
    },
    doClose() {
      this.valueReject('cancel')
      this.runFn(this.onclose)
    },
    doClosed() {
      if (this.destroyChildAfterClose) {
        this.showChildComponent = false
      }
      this.runFn(this.onclosed)
    },

    getOptions(prop) {
      return validData(this[prop], this.$attrs[prop], defaultOption[prop])
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .extend-dialog {
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
      margin: 0 0 0 8px;
      border-radius: 2px;
      &.el-button--default {
        color: #1A1A1A;
      }
    }
  }
}
</style>

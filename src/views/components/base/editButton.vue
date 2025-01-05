<template>
  <div v-else class="edit-button-wrapper">
    <template v-if="isEdit">
      <slot name="editLeft"></slot>
      <el-button
        class="text-small"
        size="small"
        :type="type"
        @click="handleCancel"
      >取消</el-button>
      <loadingBtn
        class="text-small"
        size="small"
        :type="type"
        @click="handleSave"
      >保存</loadingBtn>
    </template>
    <el-button v-else :type="type" @click="handleEdit">编辑</el-button>
  </div>
</template>

<script>
import { validData } from '@/components/avue/utils/util'

export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    value: Boolean,
    beforeSave: Function
  },
  data() {
    return {
      isEdit: false
    }
  },
  watch: {
    value: {
      handler(n) {
        this.isEdit = n
      },
      immediate: true
    }
  },
  methods: {
    async handleSave() {
      if (!await this.runFn(this.beforeSave)) return
      this.handleCommand('save', true)
    },
    handleCancel() {
      this.handleCommand('cancel', false)
    },
    handleEdit() {
      this.handleCommand('edit', true)
    },
    handleCommand(command, isEdit) {
      this.isEdit = validData(isEdit, !this.isEdit)
      this.$emit('input', this.isEdit)
      this.$emit('command', command)
    },

    runFn(fn, ...args) {
      return typeof fn === 'function' ? fn(...args) : true
    }
  }
}
</script>

<style scoped>
::v-deep.edit-button-wrapper .text-small {
  min-width: 69px;
}
</style>
<template>
  <div class="menu-btn-item">
    <span v-if="hasBtn" class="extend-dialog-btn" @click="dialogOpen">
      <slot>
        <el-button :type="btnType" :size="btnSize" v-bind="btnAttrs">
          {{ btnText }}
        </el-button>
      </slot>
    </span>
    <dialog ref="child" v-if="showChildComponent" v-bind="dialogAttrs"></dialog>
  </div>
</template>

<script>
import dialogMethods from '@/extend/mixins/dialog/dialogMethods'
import dialog from '@/extend/components/dialog'

export default {
  components: {
    dialog
  },
  mixins: [dialogMethods],
  data() {
    return {
      hasBtn: true,
      btnType: 'primary',
      btnText: '编辑',
      btnSize: 'small',
      btnAttrs: {}
    }
  },
  computed: {
    dialogAttrs() {
      return {
        ...this.$attrs,
        ...this.$props
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.extend-dialog-btn {
  .el-button--text {
    font-size: 14px;
  }
}
.extend-dialog {
  .svg-icon {
    position: relative;
    top: 2px;
    font-size: 18px;
  }
}
</style>

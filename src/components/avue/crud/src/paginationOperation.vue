<!--<template functional>
  <div
    class="pagination-operation"
    v-bind="data.attrs"
  >
    <div class="operation-left">
      <slot name="left"></slot>
      <div v-if="scopedSlots.leftBottom && scopedSlots.leftBottom()" class="operation-left-bottom">
        <slot name="leftBottom"></slot>
      </div>
    </div>
    <div class="operation-right">
      <slot name="right"></slot>
      <div v-if="scopedSlots.rightBottom && scopedSlots.rightBottom()" class="operation-right-bottom">
        <slot name="rightBottom"></slot>
      </div>
    </div>
    <div v-if="scopedSlots.default && scopedSlots.default()" class="pagination">
      <slot></slot>
    </div>
  </div>
</template>-->

<script>
import { pushSlot } from '@/utils/vue'

export default {
  name: 'PaginationOperation',
  functional: true,
  render(h, { data, scopedSlots }) {
    const leftBottom = scopedSlots.leftBottom && scopedSlots.leftBottom()
    const left = scopedSlots.left && scopedSlots.left()
    const rightBottom = scopedSlots.leftBottom && scopedSlots.rightBottom()
    const right = scopedSlots.right && scopedSlots.right()
    const defaultNode = scopedSlots.default && scopedSlots.default()

    const template = h('div', { class: 'pagination-operation', attrs: data.attrs }, [])
    if (left || leftBottom) {
      const leftWrapper = h('div', { class: 'operation-left' }, [])
      if (left) {
        pushSlot(leftWrapper.children, left)
      }
      if (leftBottom) {
        leftWrapper.children.push(h('div', { class: 'operation-left-bottom' }, leftBottom))
      }
      template.children.push(leftWrapper)
    }
    if (right || rightBottom) {
      const rightWrapper = h('div', { class: 'operation-right' }, [])
      if (right) {
        pushSlot(rightWrapper.children, right)
      }
      if (rightBottom) {
        rightWrapper.children.push(h('div', { class: 'operation-right-bottom' }, rightBottom))
      }
      template.children.push(rightWrapper)
    }
    if (defaultNode) {
      template.children.push(h('div', { class: 'pagination' }, defaultNode))
    }
    return template
  }
}
</script>

<style lang="scss" scoped>
$gutter: 16px;
$button-height: 32px;
$pagination-height: 28px;
$pagination-top: ($button-height - $pagination-height) / 2;
$bottom: 10px;
::v-deep.pagination-operation {
   display: flex;
  width: 100%;

  .operation-left {
    line-height: $button-height;

    .el-button {
      margin-right: 0;
    }
  }
  .operation-right {
    flex: 1;
    padding-left: 16px;
    line-height: $button-height;
    text-align: right;
  }
  .pagination {
    width: 100%;
    margin-bottom: $gutter;
  }

  > .operation-left,
  > .operation-right {
    > .pagination {
      > * {
        margin-bottom: $gutter;

        &.el-pagination {
          height: $button-height;
          padding: $pagination-top 0;
          margin-bottom: $gutter - $pagination-top;
        }
      }
    }
    > * {
      margin-bottom: $gutter;

      + * {
        margin-left: $gutter / 2;
      }
    }
  }

  .el-pagination.el-pagination {
      padding-top: 0;
      padding-bottom: 0;
    }

  .operation-left.operation-left .operation-left-bottom {
    margin-left: 0;
    margin-bottom: $bottom;
    line-height: 1;
  }
  .operation-right {
    position: relative;
  }
  .operation-right-bottom {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-bottom: $bottom;
    line-height: normal;
  }
  
}
.w100 {
  width: 100%;
}
.flex-center-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
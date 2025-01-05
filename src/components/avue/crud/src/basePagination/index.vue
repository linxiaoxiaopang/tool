<template>
  <el-pagination
    v-sticky:[stickyArgument]="'bottom-pagination-sticky'"
    class="base-pagination"
    :class="{ [`base-pagination--${type}`]: type }"
    :current-page.sync="curPage.pageIndex"
    :page-size="curPage.pageSize"
    :page-sizes="pageSizes"
    :total="curPage.total"
    :layout="layout"
    :background="background || ['default', 'border'].includes(type)"
    :hide-on-single-page="isHideOnSinglePage"
    v-bind="$attrs"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  >
    <template v-for="slot in slotList">
      <div v-if="slot === 'slot'" class="display-inline-block">
        <slot></slot>
      </div>
      <component v-else :is="slot" :page="curPage" :type="jumperType" :pageSizes="pageSizes" :popperAppendToBody="popperAppendToBody"></component>
    </template>
  </el-pagination>
</template>
<script>
import jumper from './jumper'
import Locale from 'element-ui/src/mixins/locale'
import { valueEquals } from 'element-ui/src/utils/util'

export default {
  name: 'BasePagination',
  components: {
    jumper,
    Prev: {
      inheritAttrs: false,
      render(h) {
        const onclick = () => {
          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(1)
          this.$parent.$emit('prev-click', this.$parent.internalCurrentPage)
          this.$parent.emitChange()
        }
        return (
          <button
            type="button"
            class="btn-prev btn-Prev"
            disabled={ this.$parent.disabled || this.$parent.internalCurrentPage <= 1 }
            on-click={ onclick }
          >
            <svg-icon icon-class="front-page"></svg-icon>
          </button>
        )
      }
    },
    prev: {
      render(h) {
        return (
          <button
            type="button"
            class="btn-prev"
            disabled={ this.$parent.disabled || this.$parent.internalCurrentPage <= 1 }
            on-click={ this.$parent.prev }>
            {
              this.$parent.prevText
                ? <span>{ this.$parent.prevText }</span>
                : <svg-icon icon-class="previous"></svg-icon>
            }
          </button>
        )
      }
    },
    Next: {
      inheritAttrs: false,
      render(h) {
        const onclick = () => {
          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(this.$parent.internalPageCount)
          this.$parent.$emit('next-click', this.$parent.internalCurrentPage)
          this.$parent.emitChange()
        }
        return (
          <button
            type="button"
            class="btn-next btn-Next"
            disabled={ this.$parent.disabled || this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }
            on-click={ onclick }
          >
            <svg-icon icon-class="last-page"></svg-icon>
          </button>
        )
      }
    },
    next: {
      render(h) {
        return (
          <button
            type="button"
            class="btn-next"
            disabled={ this.$parent.disabled || this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }
            on-click={ this.$parent.next }>
            {
              this.$parent.nextText
                ? <span>{ this.$parent.nextText }</span>
                : <svg-icon icon-class="next"></svg-icon>
            }
          </button>
        );
      }
    },
    sizes: {
      mixins: [Locale],

      props: {
        pageSizes: Array,
        popperAppendToBody: Boolean
      },

      watch: {
        pageSizes: {
          immediate: true,
          handler(newVal, oldVal) {
            if (valueEquals(newVal, oldVal)) return;
            if (Array.isArray(newVal)) {
              this.$parent.internalPageSize = newVal.indexOf(this.$parent.pageSize) > -1
                ? this.$parent.pageSize
                : this.pageSizes[0];
            }
          }
        }
      },

      render(h) {
        return (
          <span class="el-pagination__sizes">
          <el-select
            value={ this.$parent.internalPageSize }
            popperClass={ this.$parent.popperClass || '' }
            popperAppendToBody={ this.popperAppendToBody }
            size="mini"
            on-input={ this.handleChange }
            disabled={ this.$parent.disabled }>
            {
              this.pageSizes.map(item =>
                <el-option
                  value={ item }
                  label={ item + this.t('el.pagination.pagesize') }>
                </el-option>
              )
            }
          </el-select>
        </span>
      );
      },

      methods: {
        handleChange(val) {
          if (val !== this.$parent.internalPageSize) {
            this.$parent.internalPageSize = val = parseInt(val, 10);
            this.$parent.userChangePageSize = true;
            this.$parent.$emit('update:pageSize', val);
            this.$parent.$emit('size-change', val);
          }
        }
      }
    }
  },
  model: {
    prop: 'page'
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    page: {
      type: Object,
      default() {
        return {
          // total: 0, //总页数
          // pageIndex: 0, //当前页数
          // pageSize: 10 //每页显示多少条
        }
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100, 200]
      }
    },
    hideOnSinglePage: Boolean,
    background: Boolean,
    jumperType: String,
    needSticky: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isHideOnSinglePage: true,
      curPage: {},
      slotList: []
    }
  },
  computed: {
    layout() {
      let { $attrs: { layout = 'total, prev, pager, next, sizes, jumper' }, componentKeys } = this
      this.slotList = []
      const components = layout.split(',').map((item) => item.trim())
      components.forEach(key => {
        if (componentKeys.includes(key)) {
          this.slotList.push(key)
          layout = layout.replace(key, 'slot')
        }
      })
      return layout
    },
    componentKeys() {
      return Object.keys(this.$options.components).concat('slot')
    },

    stickyArgument({ needSticky }) {
      return needSticky ? '' : 'disabled'
    }
  },
  watch: {
    page: {
      handler(page) {
        this.curPage = page
      },
      immediate: true
    },
    hideOnSinglePage: {
      handler() {
        this.isHideOnSinglePage = this.hideOnSinglePage
      },
      immediate: true
    }
  },

  methods: {
    handleSizeChange(val) {
      this.isHideOnSinglePage = false

      this.curPage.pageIndex = 1
      this.curPage.pageSize = val
      this.$emit('size-change', val)
      this.oninput()
    },
    handleCurrentChange(val) {
      this.curPage.pageIndex = val
      this.$emit('current-change', val)
      this.oninput()
    },
    oninput() {
      this.$emit('input', this.curPage)
    }
  }
}
</script>
<style lang="scss" scoped>
.display-inline-block {
  display: inline-block;
}
::v-deep.base-pagination.el-pagination {
  $height: 32px;
  $gutter: 8px;
  @mixin item {
    min-width: $height;
    height: $height;
    line-height: $height;
    font-weight: 400;
    background-color: #FFFFFF;
    &:disabled {
      color: $border;
    }
    &:not(:disabled) {
      &:hover,
      &.active {
        color: #FFFFFF;
        background-color: $color-primary;
        border-color: $color-primary;
      }
    }
  }
  .btn-prev,
  .btn-next,
  .more,
  .number {
    @include item;
  }
  .more,
  .number {
    border: $border;
  }
  .btn-prev,
  .btn-next,
  .more,
  .number,
  .el-pagination__total,
  .el-pagination__sizes,
  .el-select .el-input .el-input__inner,
  .el-pagination__jump,
  .el-pagination__editor,
  .el-pagination__editor.el-input .el-input__inner {
    height: $height;
    line-height: $height;
    border-radius: $border-radius--mini;
  }
  .el-pagination__editor.el-input .el-input__inner {
    line-height: 28px;
  }
  .el-pagination__editor,
  .el-select .el-input {
    margin: 0;
    padding: 0;
  }
  .el-select .el-input {
    width: 92px;
  }
  .el-select .el-input.is-focus .el-input__inner,
  .el-select  .el-input__inner:hover {
    border-color: $border;
  }
  .el-input__inner {
    font-size: $text-small;
  }
  > * {
    margin: 0 $gutter 0 0;
    &:last-child {
      margin: 0;
    }
  }
  > slot {
    > * {
      margin: 0 $gutter 0 0;
    }
    &:last-child > *  {
      margin: 0;
    }
    &:nth-of-type(1) {
      > *:not(:nth-child(1)) {
        display: none;
      }
    }
    &:nth-of-type(2) {
      > *:not(:nth-child(2)) {
        display: none;
      }
    }
    &:nth-of-type(3) {
      > *:not(:nth-child(3)) {
        display: none;
      }
    }
    &:nth-of-type(4) {
      > *:not(:nth-child(4)) {
        display: none;
      }
    }
    &:nth-of-type(5) {
      > *:not(:nth-child(5)) {
        display: none;
      }
    }
    &:nth-of-type(6) {
      > *:not(:nth-child(6)) {
        display: none;
      }
    }
  }
  .btn-prev,
  .btn-next {
    line-height: #{$height - 3px};
    font-size: 12px;
  }
  .el-pager {
    margin-left: -#{$gutter / 2};
    margin-right: #{$gutter / 2};
    .more {
      width: 18px;
      min-width: 18px;
      padding: 0;
      margin: 0;
      border: none;
    }
    li {
      margin: 0 #{$gutter / 2};
      color: $color-content;
      font-size: $text-small;
    }
  }
  button,
  span:not([class*=suffix]) {
    height: $height;
    line-height: $height;
  }

  &.base-pagination--border {
    .btn-prev,
    .btn-next {
      border: $border;
    }
  }
}
</style>

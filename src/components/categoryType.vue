<template>
  <div class="treeBoxComponent">
    <!-- slot -->
    <slot></slot>
    <el-tree
      ref="tree"
      :data="data"
      node-key="id"
      :default-expanded-keys="$attrs['default-expanded-keys'] || [category]"
      :props="defaultProps"
      :empty-text="$attrs['empty-text'] || '暂无数据'"
      :iconClass="$attrs.iconClass || 'el-icon-arrow-right'"
      v-bind="$attrs"
      @node-click="handleNodeClick"
    ></el-tree>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import { flatTreeMapDeep } from '@/utils'

export default {
  props: {
    value: {
      type: String | Number
    },
    data: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name'
      })
    },
    cateProp: {
      type: String,
      default: 'categoryQuery'
    }
  },

  computed: {
    category() {
      return this.$store.getters[this.cateProp]
    }
  },

  watch: {
    data: {
      handler(newVal) {
        if (!this.isFirstFresh && newVal.length) {
          this.$nextTick(() => {
            let currentKey = this.value
            const fItem = this.getSelectedItem(newVal)
            currentKey = currentKey || currentKey === 0 ? currentKey : fItem.id
            if (currentKey) {
              this.$refs.tree?.setCurrentKey(currentKey)
              this.handleNodeClick(fItem)
            }
          })
          this.isFirstFresh = true
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * @description: 根据分类id = this.category 的项
     * @param {Array} data
     * @return {Object}
     */
    getSelectedItem(data) {
      data = data || []
      const flatData = flatTreeMapDeep(data)
      return (
        flatData.find((item) => {
          return item.id == this.category
        }) || {}
      )
    },

    handleNodeClick(data) {
      this.$emit('nodeClickHandler', data)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tree-node__content > .el-tree-node__expand-icon {
    position: absolute;
    right: 0;
  }
  .el-tree-node__content {
    height: $menuHeight;
    // border-left: 3px solid transparent;
    padding-right: 20px;
    :hover {
      color: $color-primary;
    }
  }
  .el-tree-node__content > .el-tree-node__label::before {
    content: '';
    display: inline-block;
    width: $menuLeft;
    white-space: nowrap;
  }

  .el-tree-node__label {
    @include overflow;
    color: $color-title;
  }
  .el-tree-node__content:hover {
    color: $--color-primary;
    background-color: #fff;
  }
  .is-current > .el-tree-node__content {
    background-color: $menuHover;
    border-color: currentColor;
    .el-tree-node__label {
      color: $color-primary;
    }
  }
  .is-current > .el-tree-node__content {
    position: relative;
    color: $color-primary;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 3px;
      height: 100%;
      background-color: $--color-primary;
    }
  }

  .el-tree-node__expand-icon {
    font-size: 16px;
    // color: #7F8792;
  }
}
</style>

<template>
  <div :class="['zd-card-tabs', type ? type : '']">
    <el-tabs v-model="defaultValue" @tab-click="handleClick">
      <el-tab-pane
        :label="item.label"
        :name="parseToString(item.value)"
        v-for="item in dic"
        :key="item.value"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'cardTabs',

  props: {
    type: {
      type: String,
      default: null
    },
    value: {
      type: String | Number,
      default: ''
    },
    dic: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      defaultValue: ''
    }
  },

  computed: {
    parseToString() {
      return (str) => String(str)
    }
  },

  watch: {
    value: {
      handler(value) {
        this.defaultValue = this.type === 'button' && value ? [String(value)] : String(value)
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    handleClick(tab, event) {
      this.$emit('tab-change', this.defaultValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.zd-card-tabs {
  ::v-deep {
    .el-tabs__item {
      height: 36px;
      line-height: 36px;
    }
    .el-tabs__item {
      border-top: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      border-left: 1px solid $border-color;
    }
    .el-tabs__item:last-child {
      border-right: 1px solid $border-color;
    }
    .el-tabs__active-bar {
      height: 0;
    }

    .el-tabs__item:hover {
      background: $color-background;
    }

    .el-tabs__nav {
      .el-tabs__item.is-top:nth-child(2) {
        padding-left: 24px;
      }
      .el-tabs__item.is-top:last-child {
        padding-right: 24px;
      }
    }

    .el-tabs__nav-wrap::after {
      background: none;
    }
  }
}
.zd-card-tabs.outline {
  ::v-deep {
    .el-tabs__item:nth-of-type(2n) {
      border-bottom: none;
    }
    .el-tabs__item:nth-of-type(2n + 1) {
      border-top: none;
    }
    .el-tabs__item:hover {
      background: inherit;
    }
  }
}
</style>

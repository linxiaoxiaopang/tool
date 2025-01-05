<template>
  <div v-if="type === 'default'">
    <el-tabs v-model="defaultValue" @tab-click="handleClick">
      <el-tab-pane
        :label="item.label"
        :name="parseToString(item.value)"
        v-for="item in dic"
        :key="item.value"
      ></el-tab-pane>
    </el-tabs>
  </div>
  <div v-else-if="type === 'button'">
    <baseTabs v-model="defaultValue" :dic="dic" @tab-click="handleClickBtn"></baseTabs>
  </div>

  <div v-else-if="type === 'detail'" class="detail-tab">
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
  name: 'zdTabs',

  props: {
    type: {
      type: String,
      default: 'default'
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
    },

    handleClickBtn(val) {
      this.$emit('tab-change', val?.[0])
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tabs__item {
    height: 48px;
    line-height: 48px;
  }
  .el-tabs__active-bar {
    height: 0;
  }

  .el-tabs__item.is-active {
    background: $color-white;
    border-bottom: 2px solid $--color-primary;
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
    background-color: $color-background--extensive;
  }
}

.detail-tab {
  background-color: $color-background;
  ::v-deep {
    .el-tabs__nav-scroll {
      height: 48px;
      line-height: 48px;
    }
    .el-tabs__nav-wrap::after {
      background: none;
    }
    .el-tabs__item.is-active {
      background: $color-white;
      border-top: 3px solid $--color-primary;
      border-bottom: none;
    }
  }
}
</style>

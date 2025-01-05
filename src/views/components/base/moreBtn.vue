<template>
  <el-button
    type="text"
    :size="size"
    class="more-btn"
    :loading="loading"
    :class="{ 'is-expanded': isExpanded }"
    @click="isExpanded=!isExpanded"
  >
    <template v-if="loading">
      {{loadText}}
    </template>
    <template v-else>
      {{ isExpanded ? closeText : openText }}
      <i class="more-btn__icon el-icon-arrow-down"></i>
    </template>
  </el-button>

</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    openText: {
      type: String,
      default: '更多'
    },
    closeText: {
      type: String,
      default: '收起'
    },
    loadText: {
      type: String,
      default: '加载中...'
    },
    size: {
      default: 'mini'
    }
  },
  data() {
    return {
      isExpanded: false
    };
  },
  watch: {
    value: {
      handler(n) {
        this.isExpanded = n
      },
      immediate: true
    },
    isExpanded(n) {
      this.$emit('input', n)
      if (n) this.$emit('open', n)
    }
  },
};
</script>

<style scoped lang="scss">
  .el-button.more-btn {
    padding: 0;
    font-size: 14px;
    .more-btn__icon {
      transition: transform 0.3s
    }

    .el-icon-d-arrow-right {
      transform: rotate(90deg);
    }

    &.is-expanded {
      .el-icon-d-arrow-right {
        transform: rotate(-90deg);
      }
      .el-icon-arrow-down {
        transform: rotate(-180deg);
      }
    }
  }

</style>

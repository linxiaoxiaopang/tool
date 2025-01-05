<template>
  <div class="infinite-component-list-wrapper">
    <el-row
      ref="scrollEle"
      class="list"
      :gutter="gutter"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="20"
    >
      <el-col :span="span" :key="item.id ? `${item.id}_${index}` : index" v-for="(item, index) in data">
        <slot :data="item"></slot>
      </el-col>
      <el-col v-if="isShowLoading" :span="24">
        <p v-if="noMore && data.length">没有更多了</p>
        <p v-if="loading">加载中...</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { isScroll } from '@/utils/element'


export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },

    total: {
      type: Number,
      required: true
    },

    gutter: {
      type: Number,
      default: 5
    },
    //每个col对应的部分
    span: {
      type: Number,
      default: 8
    },
    isShowLoading: {
      default: true
    },
    isLoadForScroll: Boolean
  },
  data() {
    return {
      loading: false
    }
  },
  watch: {
    data(n, o) {
      this.loading = false
      if (this.isLoadForScroll) {
        this.$nextTick(() => {
          // n,o长度不同（表示未全部加载完）且未出现滚动条时，再次load。解决长度不够出现滚动条时，后续数据无法加载
          if (n?.length !== o?.length && !isScroll(this.$refs.scrollEle)) this.load()
        })
      }
    }
  },
  computed: {
    noMore() {
      const bool = this.data.length >= this.total
      if (bool) {
        this.loading = false
      }
      return bool
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  methods: {
    load() {
      this.loading = true
      this.$emit('load')
    }
  }
}
</script>

<style lang="scss" scoped>
.infinite-component-list-wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .el-col {
    margin-bottom: 10px;
  }
  p {
    text-align: center;
    font-size: 14px;
    color: $color-gray;
    position: relative;
  }
}
</style>

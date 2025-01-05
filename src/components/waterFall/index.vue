<template>
  <div class="water-fall-component" v-loading="loading" v-empty:picture="tableData">
    <VueWaterfallEasy
      v-show="tableData.length"
      ref="waterfall"
      :imgsArr="tableData"
      v-bind="all$Attrs"
      v-on="$listeners"
      @preloaded="preloaded"
      @scrollReachBottom="scrollReachBottom">
      <template #[prop]="scoped" v-for="(item, prop) in all$scopedSlots">
        <slot :name="prop" v-bind="scoped">
          <component v-if="isPlainObject(item)" :is="item"></component>
        </slot>
      </template>
    </VueWaterfallEasy>
  </div>

</template>
<script>
import avueCrud from '@/mixins/avueCrud'
import VueWaterfallEasy from 'vue-waterfall-easy'
import { isPlainObject } from 'lodash'

const DEFAULT_OPTION = {
  srcKey: 'thumbnailPath',
  maxCols: 2,
  imgWidth: 100,
  gap: 8
}

export default {
  components: {
    loadingCom: {
      functional: true,
      render(h) {
        return h('span', '加载中')
      }
    },

    waterfallOverCom: {
      functional: true,
      render(h) {
        return h('span', '没有更多了')
      }
    },

    VueWaterfallEasy
  },

  mixins: [
    avueCrud({
      isInfiniteScroll: true
    })
  ],


  props: {
    immediate: {
      type: Boolean,
      default: true
    },

    resetMergeData: Object,

    getListFunc: {
      type: Function,
      required: true
    }
  },


  data() {
    return {
      isMounted: false,
      tableLoading: true,
      tablePage: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  computed: {
    loading({ tableLoading, isMounted, tableData }) {
      if (!isMounted) return false
      const isPreloading = this.$refs.waterfall.isPreloading
      return (isPreloading && tableData.length) || tableLoading
    },

    all$Attrs({ $attrs }) {
      return Object.assign({}, DEFAULT_OPTION, $attrs)
    },

    noMore({ tableData, tablePage }) {
      return tableData.length >= tablePage.total
    },

    all$scopedSlots({ $scopedSlots }) {
      const { loadingCom, waterfallOverCom } = this.$options.components
      const DEFAULT_SCOPED_SLOTS = {
        loading: loadingCom,
        'waterfall-over': waterfallOverCom
      }
      return Object.assign({}, DEFAULT_SCOPED_SLOTS, $scopedSlots)
    }
  },

  watch: {
    // resetMergeData: {
    //   handler() {
    //     const waterfall = this.$refs.waterfall
    //     waterfall && waterfall.reset()
    //     this.searchChange()
    //   },
    //   deep: true
    // },
    //
    // tableLoading(newVal) {
    //   const waterfall = this.$refs.waterfall
    //   if (!waterfall) return
    //   if (!newVal) waterfall.isPreloading = newVal
    // }
  },

  mounted() {
    this.isMounted = true
  },

  methods: {
    isPlainObject,

    handleTableData(data) {
      if (!data || !data.length) return []
      const filterData = data.filter(item => {
        return !this.tableData.find(sItem => sItem.id == item.id)
      })
      if (!filterData.length && !this.noMore) {
        this.scrollReachBottom()
      }
      return filterData
    },

    afterInit() {
      this.$emit('afterInit', this.tableData, this)
    },

    searchChange() {
      const waterfall = this.$refs.waterfall
      waterfall && waterfall.reset()
      this.tableData = []
      this.tablePage.pageIndex = 1
      this.init()
    },

    getList(postData) {
      return this.getListFunc(postData)
    },

    scrollReachBottom() {
      if (this.noMore) {
        this.$refs.waterfall.waterfallOver()
        return
      }
      this.tablePage.pageIndex++
      this.init()
    },

    isDomOverflow() {
      const scrollEl = this.$refs.waterfall.$refs.scrollEl
      return scrollEl.scrollHeight > scrollEl.clientHeight
    },

    preloaded() {
      setTimeout(() => {
        if (this.immediate && !this.isDomOverflow() && !this.noMore) {
          this.tablePage.pageIndex++
          this.init()
        }
      }, 20)
    }
  }
}
</script>

<style lang="scss" scoped>
.water-fall-component {
  width: 100%;
  height: 100%;
}

::v-deep {
  .vue-waterfall-easy-container .vue-waterfall-easy .over.over {
    font-size: $text-small;
    color: $color-sub;
  }
}
</style>

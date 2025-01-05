<template>
  <CategoryType
    class="sidebar-container"
    cateProp="categoryQuery"
    :data="data"
    v-loading="loading"
    @nodeClickHandler="nodeClickHandler"
  >
  </CategoryType>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import CategoryType from '@/components/categoryType'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {
    CategoryType
  },
  data() {
    return {
      data: [],
      loading: true
    }
  },

  created() {
    this.init()
  },

  computed: {
    ...mapGetters(['categoryQuery'])
  },

  methods: {
    ...mapMutations(['SET_CATEGORY']),
    nodeClickHandler({ id, children = [] }) {
      // if (children.length > 0) return
      this.SET_CATEGORY(id)
    },
    async init() {
      this.loading = true
      try {
        const detail = cloneDeep(await this.$store.dispatch('GetDic', 'proCategory'))
        detail.unshift({
          children: [],
          id: 'all',
          name: '全部分类'
        })
        this.data = detail
        if (!this.categoryQuery) {
          this.SET_CATEGORY(detail[0].id)
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  height: 44px;
  font-size: 14px;
  align-items: center;
  margin-left: $menuLeft;
}
</style>

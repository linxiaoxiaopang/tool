<template>
  <div class="exhibitionComponent">
    <div class="thumbnails">
      <SwiperWrapper
        ref="thumb"
        v-slot="{ scoped: { small, indx } }"
        :slideStyle="{
          width: '100%'
        }"
        :swiperData="data"
        :defaultSwiperOptions="{
          direction: 'vertical',
          autoplay: false,
          pagination: false,
          spaceBetween: 10,
          slidesPerView: 6,
          navigation: false,
          watchSlidesVisibility: true
        }"
        @swiperClickHandler="swiperClickHandler"
      >
        <el-image :class="[curIndex == indx && 'active']" :key="indx" :src="small" fit="contain"></el-image>
      </SwiperWrapper>
    </div>
    <div class="origin-pic">
      <SwiperWrapper
        v-if="thumbSwiper"
        @slideChangeHandler="slideChangeHandler"
        v-slot="{ scoped: { mid, indx } }"
        :slideStyle="{
          width: '100%',
          height: '100%'
        }"
        :swiperData="data"
        :defaultSwiperOptions="{
          autoplay: false,
          pagination: false,
          navigation: false,
          thumbs: {
            swiper: thumbSwiper
          }
        }"
      >
        <el-image :key="indx" :src="mid" fit="contain"></el-image>
      </SwiperWrapper>
    </div>
  </div>
</template>

<script>
import {isUndefined} from 'lodash'
import SwiperWrapper from '@/components/swiperWrapper'

export default {
  components: {
    SwiperWrapper
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      curIndex: 0,
      thumbSwiper: undefined
    }
  },
  mounted() {
    this.thumbSwiper = this.$refs.thumb && this.$refs.thumb.swiper
  },
  methods: {
    swiperClickHandler(swiper) {
      const { clickedIndex } = swiper
      if(isUndefined(clickedIndex)) return
      swiper.slideTo(clickedIndex)
      this.curIndex = clickedIndex
    },
    slideChangeHandler(swiper) {
      const { activeIndex } = swiper
      this.curIndex = activeIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.exhibitionComponent {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  .thumbnails {
    flex: 0 0 55px;
    margin-right: 20px;
    height: 360px;
    .el-image {
      width: 45px;
      height: 45px;
      border: 1px solid transparent;
      border-radius: 4px;
    }
    .active {
      transition: 0.25s all;
      border-color: $color-primary;
    }
  }
  .origin-pic {
    width: 430px;
    flex: 1;
    box-sizing: border-box;
    border: 1px solid $border-color;
    .el-image {
      width: calc(100% - 2px);
      height: 100%;
    }
  }
}
</style>
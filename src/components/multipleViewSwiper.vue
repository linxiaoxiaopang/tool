<template>
  <div class="recommendComponent">
    <Swiper
      v-if="data.length"
      class="normal-swiper-component-button"
      v-slot="{ scoped }"
      :isActive="isActive"
      :swiperData="data"
      :defaultSwiperOptions="{
        autoplay: false,
        pagination: false,
        spaceBetween: 10,
        slidesPerView: 6
      }"
    >
      <slot :scoped="scoped"></slot>
    </Swiper>
  </div>
</template>

<script>
import Swiper from '@/components/swiperWrapper'
export default {
  components: {
    Swiper
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    isActive: Boolean
  },
  created() {
    console.log('data', this.data)
  }
}
</script>

<style lang="scss" scoped>
.recommendComponent {
  position: relative;
  ::v-deep {

    .swiper-button-prev {
      left: 10px;
    }

    .swiper-button-next {
      left: auto;
      right: 10px;
    }
  }
}
</style>

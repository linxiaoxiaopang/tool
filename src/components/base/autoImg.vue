<template>
  <div :class="['autoImgComponent', active && 'active']">
    <el-image
      class="active global-image_multiply"
      :fit="$attrs.fit || 'contain'"
      :src="src"
      v-bind="$attrs"
      v-on="$listeners"
      crossOrigin="anonymous"
    ></el-image>
    <div class="name" v-if="name">
      {{ name }}
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    src: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.autoImgComponent.active {
  border-color: $color-primary;
}

.autoImgComponent {
  position: relative;
  width: 100%;
  padding-top: 100%;
  cursor: pointer;
  border: 1px solid transparent;

  .el-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform: initial;
  }

  .name {
    position: absolute;
    bottom: 0;
    height: 1rem;
    width: 100%;
    line-height: 1rem;
    font-size: 12px;
    padding: 0 5px;
    @include overflow;
    color: #fff;
    background: rgba($color: #000000, $alpha: 0.5);
    text-align: center;
    border-radius: 4px 4px 0 0;
  }

  ::v-deep {
    .el-image-viewer__canvas {
      position: absolute;
      z-index: 0;

      img {
        min-width: 600px;
      }
    }
  }
}
</style>

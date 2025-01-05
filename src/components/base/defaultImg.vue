<template>
  <div
    v-loading="loading"
    :style="{ width: setPx(layout.width), height: setPx(layout.height) }"
    class="default-img"
    :class="{ [`default-img--${size}`]: size }"
  >
    <el-image
      v-if="inited"
      :src="finalSrc"
      :previewSrcList="previewSrcList"
      :fit="fit"
      @load="loading = false"
      @error="loading = false"
      v-on="$listeners"
    >
      <template #error>
        <slot name="error">
          <div class="el-image__inner default-img__error"><customIcon option="icon-wutu"></customIcon></div>
        </slot>
      </template>
    </el-image>
  </div>
</template>

<script>
import { parseImgSrc } from '@/utils'
import { getThumbnail } from '@/utils/constant'
import { setPx, validData } from '@/components/avue/utils/util'

export default {
  props: {
    src: String,
    previewSrcList: Array,
    imgSize: {
      default: 'min'
    },
    fit: {
      default: 'contain'
    },
    size: {
      default: 'small'
    },
    width: {
      type: String | Number
    },
    height: {
      type: String | Number
    }
  },
  data() {
    return {
      inited: false,
      finalSrc: '',
      loading: false
    }
  },
  computed: {
    layout() {
      const { width, height } = {
        mini: {
          width: 48,
          height: 48
        },
        small: {
          width: 60,
          height: 60
        },
        medium: {
          width: 80,
          height: 80
        },
        large: {
          width: 208,
          height: 180
        },
        super: {
          width: 500,
          height: 500
        }
      }[this.size] || {}

      return {
        width: validData(this.width, width, 68),
        height: validData(this.height, height, 68)
      }
    }
  },
  watch: {
    src: {
      async handler(n) {
        this.loading = true
        this.finalSrc = await this.getThumbnail(n, this.imgSize)
        this.inited = true
      },
      immediate: true
    }
  },
  methods: {
    async getThumbnail(src, size) {
      if (!src) return ''
      src = parseImgSrc(src)
      if (!size) {
        return src
      } else {
        if (src.includes('?')) return src
        return getThumbnail(src, size)
      }
    },

    setPx
  }
}
</script>

<style lang="scss" scoped>
.default-img {
  display: inline-block;
}
.el-image {
  width: 100%;
  height: 100%;
  background-color: $color-background;
}
.default-img__error {

}
.icon-wutu {
  width: 42%;
  height: 42%;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 50%;
  transform: translateY(-50%);
  color: $color-placeholder;
}
::v-deep {
  .el-image__inner {
    mix-blend-mode: multiply;
  }
}
.default-img--super {
  .icon-wutu {
    width: 80px;
    height: 80px;
  }
}
.default-img--large {
  .icon-wutu {
    width: 40px;
    height: 40px;
  }
}
</style>

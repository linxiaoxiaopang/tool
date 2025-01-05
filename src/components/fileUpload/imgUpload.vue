<template>
  <div class="file-upload-component">
    <FileList
      v-if="showUploadFiles"
      :files="temFilesList"
      :domStyle="domStyle"
      :showFileName="showFileName"
      :uploadSizSuffix="uploadSizSuffix"
      @deleteHandler="deleteHandler"
      v-bind="all$Attrs"
      v-on="$listeners"
    >
      <template #icon="{index, file}">
        <!--        占位-->
        <span v-if="!srcList[file.$srcKey]"></span>
        <el-image
          v-else
          ref="img"
          fit="contain"
          @load="loadedHandler(index, file, $event)"
          :src="parseImgSrc(srcList[file.$srcKey])"
        />
      </template>
    </FileList>

    <el-upload
      v-show="showUploadBtn"
      :style="domStyle"
      :file-list="files"
      v-bind="all$Attrs"
      v-on="$listeners"
    >
      <slot>
        <i slot="default" :class="['el-icon-plus', `icon-upload--${uploadSizSuffix}`]"/>
      </slot>
      <template #tip>
        <slot name="tip"/>
      </template>
    </el-upload>
  </div>
</template>
<script>
import uploadMixin from './mixins/uploadMixin'
import { getThumbnail, parseImgSrc } from '@/utils'
import { validData } from '@/components/avue/utils/util'

export default {
  mixins: [uploadMixin('picture')],

  props: {
    //获取属性
    prop: {
      type: String
    },

    //是否需要获取图片的尺寸
    needPicSIze: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      srcList: {}
    }
  },

  watch: {
    files: {
      handler(newVal) {
        let nSrcList = {}
        newVal.map((file) => {
          const { picName } = this
          let { url, path, uid, id } = file
          url = validData(url, path)
          picName && (file.name = picName)
          const srcKey = validData(uid, id)
          file.$srcKey = srcKey
          if (url) return (nSrcList[srcKey] = url)
          getThumbnail(file).then((res) => {
            this.$set(nSrcList, srcKey, file.url = res.url)
          })
        })
        this.srcList = nSrcList
      },
      deep: true,
      immediate: true
    }
  },


  methods: {
    parseImgSrc,

    loadedHandler(index, file, evt) {
      const { width, height } = evt.currentTarget
      if (this.needPicSIze) {
        this.files[index].width = width
        this.files[index].height = height
        this.files[index].prop = this.prop
      }
    }
  }
}
</script>

<style lang="scss" scoped src="./scss/uploadScss.scss"></style>

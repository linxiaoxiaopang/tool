<template>
  <span>
    <el-button type="primary" size="small" class="filter-item" @click="to">
      <slot name="btnContent">
        <span><img :src="require('./ic_upload_image1.svg')" />上传图片</span>
      </slot>
    </el-button>
    <PicUploadDialog
      v-if="dialogVisible"
      title="上传图片"
      :accept="accept"
      :dialogVisible.sync="dialogVisible"
      :imageFolderId="$attrs.imageFolderId"
      @closeHandler="closeHandler"
    />
    <!-- <PicUploadTableDialog3
      ref="PicUploadTableDialog"
      v-if="uploadTableVisible"
      title="上传图片"
      :dialogVisible.sync="uploadTableVisible"
      :data="fileList"
      :cols="imgListComponentCols"
      :sup_this="sup_this"
      :imageFolderId="$attrs.imageFolderId"
      @uploadMorePic="to"
      type="imgListComponentInvoke"
    /> -->
  </span>
</template>
<script>
import PicUploadDialog from '@/components/picUploadDialog'
// import PicUploadTableDialog3 from './picUploadTableDialog3'
import { uploadTableDialogCols as cols } from './cols'
import { imgListComponentCols } from './cols'

export default {
  components: {
    PicUploadDialog,
    // PicUploadTableDialog3
  },
  props: {
    sup_this: {
      type: Object,
      required: true
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/png,image/jpg'
    }
  },
  data() {
    return {
      cols,
      imgListComponentCols,
      fileList: [],
      dialogVisible: false,
      uploadTableVisible: false
    }
  },
  methods: {
    to() {
      this.dialogVisible = true
    },
    closeHandler() {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
.el-button {
  span {
    line-height: 20px;
    display: inline-block;
  }
  img {
    margin-top: -4px;
    margin-right: 5px;
    height: 18px;
    vertical-align: middle;
  }
}
</style>

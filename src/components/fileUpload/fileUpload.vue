<template>
  <div uiid="zd-fileUpload" class="file-upload-component">
    <FileList
      v-if="showUploadFiles"
      :files="temFilesList"
      :domStyle="domStyle"
      :showFileName="showFileName"
      :uploadSizSuffix="uploadSizSuffix"
      @deleteHandler="deleteHandler"
      v-bind="all$Attrs"
      v-on="$listeners"
    />

    <el-upload
      ref="elUpload"
      v-if="showUploadBtn"
      class="el-upload-wrapper"
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

export default {
  name: 'crudFileUpload',

  mixins: [uploadMixin()]
}
</script>

<style lang="scss" scoped src="./scss/uploadScss.scss"></style>
<style lang="scss" scoped>
::v-deep {
  .icon-wrapper {
    height: calc(100% - 26px);
  }
  .file-name.file-name.file-name {
    position: initial;
    bottom: initial;
  }
}
</style>


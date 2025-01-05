<template>
  <BaseDialog width="500px" :dialogVisible.sync="dialog" :title="title">
    <base-form ref="form" v-model="form" :option="formOption"> </base-form>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit"> 确认</LoadingBtn>
      <LoadingBtn @click="cancel"> 取消</LoadingBtn>
    </template>
  </BaseDialog>
</template>

<script>
import { commonFromMixin } from '@/mixins'
import { formOption } from './const'
import { flatMapDeepByArray,  linkPageMessage } from '@/utils'
import productApi from '@/api/product/productApi'

export default {
  mixins: [commonFromMixin],

  props: {
    data: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      formOption,
      form: {}
    }
  },

  methods: {
    async doSubmit() {
      const valid = await this.validate()
      if (!valid) return
      const showImageIdList = this.getShowImageIdList()
      const bottomBoardShowImageIdList = this.getBottomBoardShowImageList()
      try {
        const { code } = await productApi.batchPreDownloadShowImage({
          ...this.form,
          showImageIdList,
          bottomBoardShowImageIdList
        })
        $SUC({ code }) && this.success()
      } catch (err) {
        console.log('err', err)
      }
    },

    success() {
      linkPageMessage({
        renderMessage: '效果图正在生成中，请稍后前往导出记录下载。',
        routerToOption: { name: 'exportHistory' }
      })
      this.cancel()
    },

    getShowImageIdList() {
      const { data } = this
      const flatShowImageData = flatMapDeepByArray(data, ['customProductList', 'customShowImageList']).filter(Boolean)
      return flatShowImageData.map(({ id }) => id)
    },

    getBottomBoardShowImageList() {
      const { data } = this
      const flatCustomShowImageList = flatMapDeepByArray(data, ['bottomBoardShowImageList']).filter(Boolean)
      return flatCustomShowImageList.map(({ id }) => id)
    },

    async validate() {
      const { form } = this.$refs
      try {
        return await form.$refs.form.validate()
      } catch {
        return false
      }
    },

    cancel() {
      this.dialog = false
    }
  }
}
</script>

<style lang="scss"></style>

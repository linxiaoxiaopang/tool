<template>
  <div class="price-component">
    <div class="user-selected-wrapper mb10" v-if="option.showUserSelected">
      <avue-crud-input type="textarea" v-model="selectedContent" class="mr24" :minRows="6"></avue-crud-input>
      <el-button type="primary" @click="onAnalysis">解析</el-button>
    </div>
    <baseForm ref="baseForm" size="medium" class="base-form-container" v-model="form" :option="finalOption" ></baseForm>

    <el-button class="copy mt10" type="primary" size="medium" @click="onsubmit">复制</el-button>
  </div>
</template>

<script>
import price from '@/views/xlsx/price'
import addOrEdit from '@/views/xlsx/price/module/addOrEdit'

export default {
  mixins: [price, addOrEdit],

  computed: {
    finalOption({ option }) {
      return {
        size: 'large',
        ...option.option
      }
    }
  },

  methods: {
    async onsubmit() {
      const isValid = await this.$refs.baseForm.validate().catch(() => false)
      if (!isValid) return
      this.onExport([this.form])
    }
  }
}
</script>

<style lang="scss" scoped>
.price-component {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  overflow: hidden;

  .base-form-container {
    flex: 1;
    padding: 5px;
    overflow: auto;
    overflow-x: hidden;
    background: #fff;
  }

  .copy {
    padding: 25px;
  }
}
</style>

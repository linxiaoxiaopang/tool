<template>
  <div class="price-component">
    <div class="user-selected-wrapper mb10" v-if="option.showUserSelected">
      <avue-crud-input type="textarea" v-model="selectedContent" class="mr24" :minRows="6"></avue-crud-input>
      <el-button type="primary" @click="onAnalysis">解析</el-button>
    </div>
    <baseForm :key="baseFormKey" ref="baseForm" size="medium" class="base-form-container" v-model="form" :option="finalOption"></baseForm>

    <div class="btn-wrapper mt10">
      <el-button class="copy mr10" type="danger" size="medium" @click="onClear">清空</el-button>
      <el-button class="copy" type="primary" size="medium" @click="onsubmit">复制</el-button>
    </div>
  </div>
</template>

<script>
import price from '@/views/xlsx/price'
import addOrEdit from '@/views/xlsx/price/module/addOrEdit'
import { getUUID } from '@/utils'

export default {
  mixins: [price, addOrEdit],

  data() {
    return {
      baseFormKey: getUUID()
    }
  },

  computed: {
    finalOption({ option }) {
      return {
        size: 'large',
        ...option.option
      }
    }
  },

  created() {
    this.$on('afterDataBaseInitUpdate', () => {
      this.baseFormKey = getUUID()
    })
  },

  methods: {
    onClear() {
      this.$refs.baseForm.resetFields()
    },

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

  .btn-wrapper {
    display: flex;
    align-items: center;
  }

  .copy {
    flex: 1;
    padding: 20px;
  }
}
</style>

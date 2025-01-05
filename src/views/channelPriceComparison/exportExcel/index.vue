<template>
  <pageContainer>
    <baseTable
      class="tabs-active-border--primary"
      :list="list"
      :data="filterData"
      :spanMethod="spanMethod"
      v-bind="$attrs"
    >
      <template #menuLeft="scoped">
        <ExportExcelBtn class="inline-block" @changeData="changeData">
          导入表格
        </ExportExcelBtn>
      </template>
      <template #menu="{row}">
      </template>
    </baseTable>
    <el-button class="mt18 submit-btn" type="primary" @click="onsubmit">
      保存数据
    </el-button>
  </pageContainer>
</template>

<script>
import baseTableChild from '@/components/base/baseTable/mixins/baseTableChild'
import getBaseTableDataMixin from '@/components/base/baseTable/mixins/getBaseTableDataMixin'
import baseExcelMixin from '../mixins/baseExcelMixin'
import ExportExcelBtn from './module/exportExcelBtn'
import { createSpanMethod } from '@/utils'
import { fillValidErrorPassColumnInData } from '@/utils/validate/table'
import { validatenull } from '@/components/avue/utils/validate'
import channelPriceComparisonApi from '@/api/channelPriceComparison'
import { getFormatPrice, getList, TYPE_BIG_GOOD, TYPE_SMALL_GOOD } from '../utils'

export default {
  components: {
    ExportExcelBtn
  },

  mixins: [
    baseTableChild(),
    getBaseTableDataMixin({
      dataAttrs: {
        searchForm: {},
        tableColumn: [],
        curTabItem: {}
      }
    }),
    baseExcelMixin()
  ],

  data() {
    return {
      errDataObj: {
        [TYPE_BIG_GOOD]: [],
        [TYPE_SMALL_GOOD]: []
      }
    }
  },

  computed: {
    list() {
      return getList()
    },

    errData: {
      get({ errDataObj, currentValue }) {
        return errDataObj[currentValue]
      },

      set(data) {
        this.errDataObj[this.currentValue] = data
      }
    }
  },

  methods: {
    async onsubmit() {
      if (!this.data.length) {
        this.$message.error('导入的数据不能为空！')
        return
      }
      if (this.errData.length) {
        this.$message.error('导入的数据存在异常，无法提交。请修改后重新导入！')
        return
      }
      const res = await awaitResolveDetailLoading(channelPriceComparisonApi.create(this.getParams()))
      if (!res) return
      this.$message.success('导入成功')
    },

    getParams() {
      return {
        type: this.currentValue,
        channelPricesList: this.data.map(item => {
          const {
            cargoAttributes,
            countryCnName,
            deliveryShipping,
            expressShippingMethod,
            price,
            registrationFee,
            weight
          } = item
          return {
            type: this.currentValue,
            cargoAttributes,
            countryCnName,
            deliveryShipping,
            expressShippingMethod,
            price,
            registrationFee,
            weight
          }
        })
      }
    },

    changeData(data) {
      const res = fillValidErrorPassColumnInData(this.tableColumn, getFormatPrice(data))
      this.errData = res.filter(item => !validatenull(item.errors))
      this.data = data
    },

    spanMethod(params) {
      return createSpanMethod(params, this.filterData, {
        props: [
          [
            {
              deliveryShipping: ['deliveryShipping']
            }
          ]
        ]
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.submit-btn {
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 50px;
  font-size: 20px;
}
</style>

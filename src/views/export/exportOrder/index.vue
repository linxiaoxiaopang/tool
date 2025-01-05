<template>
  <section class="app-container">
    <baseTable
      :data="data"
      :list="list"
      :option="tableOption"
      checkAll
      isHandleRealData
      :handlePageData="tabOption.handleTableData"
      :spanMethod="tabOption.spanMethod"
      @search-change="searchChange"
      @selection-change="selectionChange"
    >
      <template #menuLeft>
        <exportOrder :data="skuData"></exportOrder>
      </template>

      <template #sku="{ row }">
        <div class="flex">
          <baseImage :src="$GET(row, 'thumbUrlList.0')"></baseImage>
          <div class="ml10">
            <div>尺码名称：{{ row.className }}</div>
            <div>SKU ID：{{ row.productSkuId }}</div>
            <div>SKU 货号：{{ row.extCode }}</div>
          </div>
        </div>
      </template>
    </baseTable>
  </section>
</template>
<script>
import exportOrder from '@/views/export/exportOrder/exportOrder'
import exportApi from '@/api/exportApi'
import { list, tableOption } from './const'
import baseTableMixin from '@/components/base/baseTable/mixins/baseTableMixin'
import { SpanUtils } from '@/utils/table/spanUtils'
import { map } from 'lodash'

export default {
  components: { exportOrder },
  mixins: [
    baseTableMixin({
      dataAttrs: {
        postData: {},
        getPostData: () => {}
      }
    })
  ],
  data() {
    const spanUtils = new SpanUtils({
      isTitle: false,
      flatMap: [
        {
          path: 'skuQuantityDetailList',
          emptyPath: 'current',
          fillProps: {
            assign(data, result) {
              Object.assign(result, data)
              delete result.id
              delete result.skuQuantityDetailList
            }
          }
        }
      ],
      spanProps: [
        'selection',
        'extCode',
        'purchaseQuantity'
      ]
    })
    this.tabOption = spanUtils.tabOption
    return {
      list,
      tableOption,
      data: []
    }
  },
  computed: {
    skuData() {
      return this.tabOption.handleTableData(
        map(this.selectionData, '$parent')
      )
    }
  },
  methods: {
    async searchChange() {
      this.getPostData()
      await new Promise(resolve => setTimeout(resolve))
      if (!this.postData.accessToken) {
        this.$message.warning('未填写授权码')
        return
      }
      const detail = await awaitResolveDetail(exportApi.orderListByToken(this.postData))
      if (!detail?.subOrderForSupplierList) return
      detail.subOrderForSupplierList.forEach((order, orderIndex) => {
        order.id = orderIndex + 1
        order.skuQuantityDetailList?.forEach((sku, skuIndex) => {
          sku.id = `${ orderIndex + 1 }_${ skuIndex + 1 }`
        })
      })
      this.data = detail.subOrderForSupplierList
    }
  }
}
</script>

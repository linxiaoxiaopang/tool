<template>
  <div class="data-base-component">
    <XlsxTable
      ref="xlsxTable"
      class="inline-block ml10"
      :isMergeCell="true"
      :analysisAll="true"
      :keepOrigin="true"
      @on-map-select-file="onSelectMapData"
    >
      <el-button type="primary"> {{ dataBaseDate ? `(${dataBaseDate})` : '' }} 更新数据库</el-button>
    </XlsxTable>
  </div>
</template>

<script>
import price from '@/views/xlsx/price'

export default  {
  mixins: [price]
}
</script>

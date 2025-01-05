<template>
  <el-row :gutter="gutter">
    <el-col :span="1.5">
      <checkAllData
        ref="checkAllData"
        class="avue-checkbox"
        :sup_this="vm"
        :allData="dic"
        :rowKey="rowKey"
        :getInstance="getInstance"
        @selection-change="selectionChange"
        @checkChange="handleSelectAll"
        v-on="$listeners"
      >全部</checkAllData>
    </el-col>
    <el-col :span="1.5">
      <avueCrudCheckbox v-model="text" :dic="dic" :props="props" @select="handleSelect"></avueCrudCheckbox>
    </el-col>
  </el-row>
</template>

<script>
import checkboxMixin from '@/components/checkboxAll/checkboxMixin'

export default {
  mixins: [checkboxMixin],
  props: {
    dic: {
      default: () => []
    },
    gutter: {
      type: Number,
      default: 20
    }
  }
}
</script>

<style lang="scss" scoped>
.avue-checkbox-group {
  &::v-deep .el-row:empty::before {
    display: none;
  }
}
</style>
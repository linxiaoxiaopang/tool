<template>
  <pageContainer>
    <baseTable
      needSticky
      :list="baseTableProps.list"
      :option="baseTableProps.option"
      @selection-change="selectionChange"
      @selectionCountChange="selectionCountChange"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template #tabsLabel="{ column }">
        {{ column.label }}<template v-if="count">({{ count[column.value] || 0 }})</template>
      </template>
      <template #status="{ row }">
        {{ getStatusLabel(row) }}
      </template>
      <template v-for="(val, key) in $scopedSlots" v-slot:[key]="scope">
        <slot :name="key" v-bind="scope"></slot>
      </template>

      <template #infoList="scope">
        <infoList v-bind="scope"></infoList>
      </template>

      <template #menuRightBottom>
        <slot name="menuRightBottom" :searchForm="searchForm"></slot>
      </template>
    </baseTable>
  </pageContainer>
</template>

<script>
import infoList from './module/infoList'
import baseTablesMixin from '@/components/base/baseTable/mixins/baseTablesMixin'
import { getDicItemComplex } from '@/components/avue/utils/util'

export default {
  inheritAttrs: false,
  componentName: 'basePage',
  components: { infoList },
  mixins: [
    baseTablesMixin({
      dataAttrs: {
        searchForm: {},
        postData: {},
        clearSelection: () => {}
      }
    })
  ],
  props: {
    type: String,
    count: Object
  },
  methods: {
    getStatusLabel(data) {
      return getDicItemComplex(this.status, data)?.label
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  &::v-deep {
    .crud-header-before {
      margin-bottom: 12px;
    }
    .crud-header .formPart {
      padding: 0;
      .el-form-item__label {
        position: relative;
        padding-right: 20px;
        text-align-last: justify;
        &::after {
          content: '：';
          position: absolute;
          right: calc(20px - 1em);
        }
      }
    }

    .pagination-operation > .operation-left > * {
      margin-bottom: 20px;
    }
    .operation-left-bottom {
      color: $color-sub;
      .el-checkbox {
        margin-right: 4px;
        color: $color-sub;
      }
      .el-checkbox__label {
        color: $color-sub;
      }
    }
    .operation-right-bottom {
      > * {
        vertical-align: middle;
      }
    }
  }
}
</style>

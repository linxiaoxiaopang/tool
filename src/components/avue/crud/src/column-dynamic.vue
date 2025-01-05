<template>
  <el-table-column
    ref="column"
    :key="columnOption.$sortKey"
    :prop="columnOption.prop"
    :show-overflow-tooltip="validData(columnOption.showOverflowTooltip, columnOption.overHidden)"
    :min-width="validData(columnOption.minWidth, crud.option.autoHeaderWidth && getPxWidth(columnOption))"
    :sortable="columnOption.sortable"
    :align="validData(columnOption.align, crud.option.align)"
    :header-align="validData(columnOption.headerAlign, crud.option.headerAlign)"
    :width="columnOption.width"
    :label="columnOption.label"
    :fixed="columnOption.fixed"
    :class-name="columnOption.className"
  >
    <template slot="header" slot-scope="scope">
      <slot :name="columnOption.headerSlotName || `${columnOption.prop}Header`" :dic="dic" :currentColumn="columnOption" v-bind="scope">
        <slot name="Header" :dic="dic" :currentColumn="columnOption" v-bind="scope">{{
            columnOption.label
          }}</slot>
      </slot>
    </template>
    <template v-for="column in columnOption.children">
      <column-dynamic v-if="column.children && column.children.length>0"
                      :key="column.label"
                      :columnOption="column">
        <template v-for="item in crud.mainSlot"
                  slot-scope="scope"
                  :slot="item">
          <slot v-bind="scope"
                :name="item"></slot>
        </template>
      </column-dynamic>
      <column-slot v-else
                   :column="column"
                   :column-option="columnOption.children">
        <template v-for="item in crud.mainSlot"
                  slot-scope="scope"
                  :slot="item">
          <slot v-bind="scope"
                :name="item"></slot>
        </template>
      </column-slot>
    </template>
  </el-table-column>
</template>

<script>
import column from '@/components/avue/core/column'
import columnSlot from './column-slot'
import { setDic } from '@/components/avue/utils/util'

export default {
  name: 'column-dynamic',
  components: {
    columnSlot
  },
  mixins: [column],
  props: {
    columnOption: Object
  },
  computed: {
    dic() {
      return setDic(this.columnOption, this.crud.DIC)
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
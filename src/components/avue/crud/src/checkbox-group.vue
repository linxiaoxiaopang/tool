<template>
  <div class="table-checkbox-wrapper checkbox-group">
    <el-checkbox
      v-if="checkAll"
      class="mb10"
      :disabled="total <= 0"
      @change="checkAllChange"
      v-bind="checkAllStatus"
    >全选当页</el-checkbox>
    <el-row type="flex" justify="center" v-if="!dic.length" v-empty="dic">
    <!--    <el-col :span="8">-->
    <!--      <slot name="empty">-->
    <!--        暂无数据-->
    <!--      </slot>-->
    <!--    </el-col>-->
    </el-row>
    <el-checkbox-group
      v-else-if="type === 'checkbox'"
      v-model="checkedIdList"
      :class="`checkbox-group--${hiddenCheckbox ? 'hidden' : 'normal'}`"
      :disabled="isDisabled"
      :min="checkboxMin"
      @change="handleChange"
      v-bind="$attrs"
    >
      <el-row :gutter="validData(gutter, 30)">
        <el-col v-for="(item, index) in dic" :key="item[dictValue]" :span="span" class="checkbox-item">
          <check-box-slot
            :prevent="validData($attrs.prevent, true)"
            :label="item[dictValue]"
            :disabled="disabledIdList.includes(item[dictValue])"
            @change="select(item, $event)"
          >
            <slot name="item" :row="item" :$index="index">
              {{ item[dictLabel] }}
            </slot>
          </check-box-slot>
        </el-col>
      </el-row>
    </el-checkbox-group>
    <el-row v-else :gutter="validData(gutter, 30)">
      <el-col v-for="(item, index) in dic" :key="item[dictValue]" :span="span" class="checkbox-item" style="line-height: 19px">
        <slot name="item" :row="item" :$index="index">
          {{ item[dictLabel] }}
        </slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkboxMixin from '@/components/avue/mixins/checkboxMixin'
import checkBoxSlot from '@/components/checkBoxSlot'

export default {
  name: 'checkboxGroup',
  mixins: [checkboxMixin],
  components: {
    checkBoxSlot
  },
  props: {
    type: {
      type: String,
      default: 'checkbox'
    },
    gutter: {
      type: Number,
      default: 30
    },
    span: {
      type: Number,
      default: 6
    },
    min: null,
    radioMode: Boolean,
    hiddenCheckbox: Boolean
  },
  data() {
    return {}
  },

  computed: {
    checkboxMin({min, checkedIdList}) {
      if(!min) return min
      if(checkedIdList.length >= min) return min
      return null
    }
  },

  methods: {
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change', value)
      this.$emit('selection-change', this.checkedList)
    },
    select(row, bool) {
      //单选模式
      if(this.radioMode) {
        if(bool) {
          this.checkedIdList = [row.id]
        } else {
          this.checkedIdList = []
        }
      }
      this.$emit('checkbox-toggle', row, bool)
      this.$once('change', () => this.$emit('select', this.checkedList, row))
    },

    doLayout() {}
  }
}
</script>

<style lang="scss">
.checkbox-group {
  .el-checkbox-group {
    min-height: 100px;
  }
  .el-checkbox,
  .el-checkbox__label {
    width: 100%;
    font-weight: 400;
  }
}

.checkbox-group--hidden {
  .el-checkbox__inner {
    display: none;
  }
}
</style>

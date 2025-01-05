<template>
  <CommonCascader
    ref="cascader"
    :placeholder="placeholder"
    :options="data"
    :value="$attrs.value"
    v-bind="$attrs"
    v-on="$listeners"
  ></CommonCascader>
</template>

<script>
import CommonCascader from '@/components/commonCascader'
import { mapGetters } from 'vuex'

export default {
  props:{
    placeholder:{
      type:String,
      default:'请输入产品名称'
    }
  },
  components: {
    CommonCascader
  },

  computed: {
    ...mapGetters({
      data: 'allProCategory'
    })
  }
}
</script>

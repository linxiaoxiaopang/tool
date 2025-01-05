<template>
  <CommonCascader
    ref="cascader"
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
  components: {
    CommonCascader
  },

  computed: {
    ...mapGetters({
      data: 'allCategory',
    })
  }
}
</script>

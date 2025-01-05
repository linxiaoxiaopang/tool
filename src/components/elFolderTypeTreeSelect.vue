<template>
  <CommonCascader
    ref="cascader"
    placeholder="请选择文件夹"
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
      data: 'foldersList'
    })
  }
}
</script>

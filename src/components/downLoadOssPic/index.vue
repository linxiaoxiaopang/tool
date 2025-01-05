<template>
  <div class='line inline-block'>
    <div
      size='small'
      :is="tagName"
      :class="[isSpan&&'span-class']"
      :disabled="$attrs.isDisabled"
      @click='showDialog'
      v-bind='$attrs'
      v-on='$listeners'
    >
      <slot>
        {{ content }}
      </slot>
    </div>

    <OForm
      v-if='dialogVisible'
      ref='form'
      :title='title'
      :dialogVisible.sync='dialogVisible'
      :sup_this='sup_this'
      v-bind='$attrs'
    />
  </div>
</template>

<script>
import { commonEheaderMixin } from '@/mixins'
import OForm from './module/ossFormDialog'

export default {
  components: {
    OForm
  },

  mixins: [commonEheaderMixin],

  props: {
    content: String,
    isSpan: Boolean,
    title: {
      type: String,
      default: '下载效果图'
    }
  },

  computed: {
    tagName ({isSpan}) {
      return isSpan ? 'span' : 'el-button'
    }
  }
}
</script>

<style lang='scss'>
.span-class {
  display: block;
  margin: 0 -20px;
  padding: 0 20px;
}
</style>
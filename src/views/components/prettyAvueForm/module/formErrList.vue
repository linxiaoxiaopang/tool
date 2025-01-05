<template>
  <ul class="form-err-list">
    <li v-for="msg in errList" class="item">
      {{ msg }}
    </li>
  </ul>
</template>

<script>
import { isArray } from 'lodash'

export default {
  props: {
    data: {
      type: [Object, Array],
      default: () => []
    }
  },
  computed: {
    errList({ data }) {
      isArray(data) || (data = [data])
      return data.map(item => $GET(item, 'message', '')).filter(Boolean)
    }
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
.form-err-list {
  position: absolute;
  transform: translateY(-100%);
  font-size: $text-small;
  color: #FF4D4F;
  list-style: none;

  .item {
    margin: 5px 0;
  }
}
</style>

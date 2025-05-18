<template>
  <avue-crud-select :dic='dic' v-bind='$attrs' v-on='$listeners'></avue-crud-select>
</template>

<script>
import { dic } from '../const'

export default {
  data() {
    return {
      dic
    }
  }
}
</script>

<template>
  <base-button
    class="color-btn-component"
    type="text"
    :class="type"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </base-button>
</template>

<script>
export default {
  props: {
    type: String,
    default: 'primary'
  }
}
</script>

<style lang="scss" scoped>
// hover经过，颜色无变化
.color-btn-component {
  font-weight: 400;
}
.color-btn-component.danger {
  color: $color-danger;
}
.color-btn-component.success {
  color: $color-success;
}
.color-btn-component.warning {
  color: $color-warning;
}

.color-btn-component.text {
  color: $color-content;
}

.color-btn-component.default {
  color: $color-gray;
}
.color-btn-component.info {
  color: $color-info;
}
.is-disabled.is-disabled {
  color: #C0C4CC;
}
</style>

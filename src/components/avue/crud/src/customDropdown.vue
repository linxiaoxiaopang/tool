<template functional>
  <el-dropdown
    class="custom-dropdown"
    :trigger="props.trigger"
    :placement="props.placement || 'bottom-start'"
    :class="data.staticClass"
    v-on="listeners"
  >
    <slot>
      <!-- <el-button plain icon="el-icon-more"></el-button> -->
      <div class="opacity el-button">
        <div class="icon-more">
          <i class="dot"></i>
          <i class="dot"></i>
          <i class="dot"></i>
        </div>
      </div>
    </slot>
    <el-dropdown-menu
      slot="dropdown"
      class="custom-dropdown-menu"
      :visibleArrow="props.visibleArrow === true"
      :class="props.dropdownMenuClass"
    >
      <el-dropdown-item
        v-for="item in props.dic || props.list"
        :key="item.value"
        :command="item.value"
        :class="`custom-dropdown-${item.value}`"
      >
        <slot :name="item.value">
          <div v-if="item.prefix" class="dropdown-icon-wrapper">
            <customIcon :option="item.prefix"></customIcon>
          </div>{{ item.label }}
        </slot>
        <slot :name="`suffix-${item.value}`">
          <customIcon v-if="item.suffix" :option="item.suffix"></customIcon>
        </slot>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.custom-dropdown {
  .el-button.el-button.el-button {
    width: 24px;
    height: 24px;
    padding: 0;
    margin: 0;
    border: none;
  }
}
.opacity {
  @include border-radius();
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: $color-title;
  i {
    color: #fff;
  }
  .main-color {
    font-size: 16px;
    position: relative;
    top: 0px;
  }
}

.custom-dropdown-menu {
  padding: 8px 0;
  margin-top: 10px;
  @include box-shadow;
  @include border-radius();
  .el-dropdown-menu__item {
    min-width: 108px;
    line-height: 32px;
    padding: 0;
    color: $color-content;
    text-indent: 10px;
    &:focus,
    &:not(.is-disabled):hover {
      color: $color-content;
      background: $color-background--extensive;
    }
    .dropdown-icon-wrapper {
      position: relative;
      display: inline-block;
      width: 40px;
      margin-left: -12px;
      text-align: center;
    }
    i {
      margin-right: 0;
    }

    ::v-deep .el-button {
      display: block;
      width: 100%;
      padding: 0 10px;
      text-align: left;
    }
  }
  .el-dropdown-menu__item:hover {
    color: $color-content;
    background: $color-background--extensive;
  }
}
</style>

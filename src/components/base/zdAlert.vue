<template>
  <transition name="el-alert-fade">
    <div
      class="el-alert"
      :class="[typeClass, center ? 'is-center' : '', 'is-' + effect, `size--${size}`, className]"
      v-show="visible"
      role="alert"
    >
      <template v-if="showIcon">
        <slot name="icon">
          <customIcon
            v-if="['delete', 'refresh'].includes(type)"
            class="el-alert__icon"
            :class="[iconClass, isBigIcon]"
            :option="iconClass"
          ></customIcon>
          <i v-else class="el-alert__icon" :class="[iconClass, isBigIcon]"></i>
        </slot>
      </template>
      <div class="el-alert__content">
        <span class="el-alert__title" :class="[isBoldTitle]" v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="el-alert__description" v-if="$slots.default && !description"><slot></slot></p>
        <p class="el-alert__description" v-if="description && !$slots.default">{{ description }}</p>
        <i
          class="el-alert__closebtn"
          :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }"
          v-show="closable"
          @click="close()"
          >{{ closeText }}</i
        >
      </div>
      <div v-if="linkTitle" class="alert_link">
        <a class="show-link" :href="linkHref">{{ linkTitle }}</a>
      </div>
    </div>
  </transition>
</template>

<script>
const TYPE_CLASSES_MAP = {
  success: 'el-icon-success',
  warning: 'el-icon-warning',
  error: 'el-icon-error',
  primary: 'el-icon-success',
  delete: 'removed',
  refresh: 'needredesign'
}
export default {
  name: 'zdAlert',

  props: {
    className: String,
    size: {
      type: String,
      default: 'mini'
    },
    linkTitle: {
      type: String,
      default: ''
    },
    linkHref: {
      type: String,
      default: '#'
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    },
    closable: Boolean,
    closeText: {
      type: String,
      default: ''
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    center: Boolean,
    effect: {
      type: String,
      default: 'light',
      validator: function (value) {
        return ['light', 'dark'].indexOf(value) !== -1
      }
    }
  },

  data() {
    return {
      visible: true
    }
  },

  computed: {
    typeClass({ type }) {
      return `el-alert--${type}`
    },

    iconClass({ type }) {
      return TYPE_CLASSES_MAP[type] || 'el-icon-info'
    },

    isBigIcon({ description }) {
      return description || this.$slots.default ? 'is-big' : ''
    },

    isBoldTitle({ description }) {
      return description || this.$slots.default ? 'is-bold' : ''
    }
  },

  methods: {
    close() {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.alert_link {
  white-space: nowrap;
  padding-right: 80px;
}

.el-alert {
  align-items: flex-start;
  &.size--small {
    padding: 15px 20px 20px;
  }
  &.size--super-mini {
    padding-top: 3px;
    padding-bottom: 3px;
  }
}
::v-deep {
  .el-alert__icon {
    width: 20px;
    height: 20px;
    margin-top: 3px;
  }
  .el-alert {
    padding: 12px 16px;
  }
  .el-alert__closebtn {
    font-size: 15px;
  }
  .el-alert__content,
  .el-alert__description {
    color: $color-title !important;
    font-size: 14px;
    line-height: 30px;
    margin: 0;
  }
  .el-alert__title {
    font-weight: normal;
    font-size: 14px;
    line-height: 30px;
  }
  .el-icon-success {
    background: url('~@/assets/icon/success.png') center no-repeat;
    background-size: cover;
  }
  .el-icon-success:before {
    content: '替';
    font-size: 28px;
    visibility: hidden;
  }

  .el-icon-info {
    background: url('~@/assets/icon/info.png') no-repeat;
    background-size: cover;
  }
  .el-icon-info:before {
    content: '替';
    font-size: 28px;
    visibility: hidden;
  }

  .el-icon-warning {
    background: url('~@/assets/icon/warning.png') center no-repeat;
    background-size: cover;
  }
  .el-icon-warning:before {
    content: '替';
    font-size: 28px;
    visibility: hidden;
  }
  .el-icon-error {
    background: url('~@/assets/icon/error.png') center no-repeat;
    background-size: cover;
  }
  .el-icon-error:before {
    content: '替';
    font-size: 28px;
    visibility: hidden;
  }
}

.el-alert.el-alert--info {
  background: rgba(53, 105, 253, 0.1);
}
.el-alert.el-alert--primary {
  background-color: rgba(53, 105, 253, 0.1);
}

.el-alert--info {
  a,
  a:focus,
  a:hover {
    color: $color-primary--bg;
  }
}
.el-alert--success {
  a,
  a:focus,
  a:hover {
    color: $color-success--bg;
  }
}
.el-alert--warning {
  a,
  a:focus,
  a:hover {
    color: $--color-warning--bg;
  }
  background: $--color-warning--bg;
}
</style>

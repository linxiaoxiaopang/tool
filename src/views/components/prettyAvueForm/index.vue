<template>
  <div class="pretty-avue-form" :class="[`pretty-avue-form--${fillOption.size}`]" @keyup.enter="formSubmit">
    <form-err-list :data="errRes"></form-err-list>
    <avue-form ref="form" :option="fillOption" v-bind="$attrs" v-on="$listeners">
      <template v-for="(val, key) in  $scopedSlots" #[key]="scoped">
        <slot :name="key" v-bind="scoped"></slot>
      </template>
    </avue-form>
  </div>
</template>

<script>
import formErrList from './module/formErrList'

const DEFAULT_OPTION = {
  size: 'large',
  showMessage: false,
  hideRequiredAsterisk: true
}

export default {
  components: {
    formErrList
  },

  props: {
    errRes: null,

    option: {
      type: Object,
      required: true
    },

    isKeyupEnter: {
      type: Boolean,
      default: true
    },

    isClearFirstLoadingError: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isMounted: false
    }
  },

  computed: {
    fillOption({ option }) {
      return {
        ...DEFAULT_OPTION,
        ...option
      }
    }
  },

  mounted() {
    this.isMounted = true
    this.clearErrorHandler()
  },

  methods: {
    clearErrorHandler() {
      if (!this.isClearFirstLoadingError) return
      setTimeout(() => {
        const { $refs: { form } } = this
        form.clearValidate()
      }, 20)
    },

    async formSubmit() {
      await this.$nextTick()
      const { $refs: { form: aVueFormEl }, isKeyupEnter } = this
      if (!aVueFormEl || !isKeyupEnter) return
      aVueFormEl.submit()
    }
  }
}
</script>

<style lang="scss" scoped>
.pretty-avue-form {
  position: relative;
}

::v-deep {
  .form-menu {
    margin: 0;

    .el-button {
      width: 100%;
      margin: 0;
    }
  }

  .el-form-item {
    &.is-error {
      .el-input {
        .el-input__inner {
          background: #FEECE8;
        }

        .el-input__inner:focus {
          border-color: #FF4D4F;
        }
      }

      .mobile-input-component {
        .el-input__prefix {
          background: $color-background;
        }

        .el-input__inner:focus + .el-input__prefix {
          border-right-color: #FF4D4F;
        }

        .el-input__inner:focus + .el-input__prefix {
          border: 1px solid #FF4D4F;
          border-right-color: transparent;
          border-radius: 4px 0 0 4px;
          background: #fff;
        }
      }
    }

    .el-form-item__error {
      font-size: $text-small;
      color: #FF4D4F;
    }

    .el-input {
      .el-input__inner {
        color: $color-title;
        border-radius: 4px;
        background: $color-background;
        border-color: $color-background;
      }
      .el-input__inner::placeholder {
        color: $color-sub;
      }

      .el-input__inner:focus {
        border-color: $color-primary;
        background: #fff;
      }
    }
  }
}

.pretty-avue-form--large {
  ::v-deep {
    .el-form-item {
      .el-input {
        .el-input__inner {
          height: 46px;
          line-height: 46px;
        }
      }
    }

    input::placeholder {
      color: $color-sub;
    }

    .el-button {
      padding-top: 0;
      padding-bottom: 0;
      height: 46px;
      line-height: 46px;
    }
  }
}
</style>

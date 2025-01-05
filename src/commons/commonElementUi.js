/* eslint-disable */
import { validData } from '@/components/avue/utils/util'
import { MessageBox, Message } from 'element-ui'

export default {
  install: (Vue) => {
    const confirmOption = {
      info: {
        title: '确认'
      },
      warning: {
        title: '确认',
        iconClass: 'iconfont icon-warning'
      },
      success: {
        title: '确认'
      },
      error: {
        title: '确认'
      },
      confirm: {
        title: '确认',
        iconClass: 'bg-icon bg-icon-confirm'
      },
      default: {
        title: '',
        iconClass: ''
      },
      paymentSuccess: {
        type: 'success',
        center: false,
        showCancelButton: false,
        showClose: false,
        customClass: 'payment-success-message',
        message: '支付成功'
      },
      paymentFailed: {
        type: 'error',
        center: false,
        showCancelButton: false,
        showClose: false,
        customClass: 'payment-failed-message',
        dangerouslyUseHTMLString: true,
        message: '支付失败'
      }
    }
    Vue.prototype.$Confirm = function (option) {
      typeof option === 'string' && (option = { message: option, type: 'success' })
      option.type = option.type || 'success'
      const typeOption = confirmOption[option.type]
      let { message, title = typeOption.title } = option

      return awaitFormResolve(
        MessageBox.confirm(message, title, {
          center: true,
          confirmButtonText: option.confirmButtonText || '确 定',
          cancelButtonText: option.cancelButtonText || '取 消',
          ...typeOption,
          ...option,
          type: validData(typeOption.type, option.type),
          showConfirmButton: validData(option.showConfirmButton, option.showButton, typeOption.showConfirmButton),
          showCancelButton: validData(option.showCancelButton, option.showButton, typeOption.showCancelButton),
          cancelButtonClass: [
            option.cancelButtonClass,
            typeOption.cancelButtonClass,
            `uiid-zd-${option.prop || option.type}-cancel`
          ].join(' '),
          confirmButtonClass: [
            option.confirmButtonClass,
            typeOption.confirmButtonClass,
            `uiid-zd-${option.prop || option.type}-confirm`
          ].join(' '),
          customClass: [
            'common-message',
            `el-message-box--${option.type || typeOption.type || 'default'}`,
            option.customClass,
            typeOption.customClass,
            `uiid-zd-${option.prop || option.type}`
          ].join(' ')
        })
      )
    }
  
    function message(option) {
      if (typeof option === 'string') {
        option = {
          message: option
        }
      }
      return Message({
        ...option,
        customClass: [
          option.customClass,
          `uiid-zd-${option.type || 'info'}`
        ].join(' ')
      })
    }
    ['success', 'warning', 'info', 'error'].forEach(type => {
      message[type] = options => {
        if (typeof options === 'string') {
          options = {
            message: options
          }
        }
        options.type = type
        return message(options)
      }
    })
    Vue.prototype.$message = message
  
    Vue.prototype.$reconfirm = ({ msg = '确定执行该操作？', title = '提示', success, error, finallyFn, ...options } = {}) => {
      return Vue.prototype
        .$confirm(msg, title, {
          type: 'warning',
          ...options
        })
        .then(() => {
          // console.log(typeof success === 'function', success)
          if (typeof success === 'function') {
            success()
            return true
          } else {
            Vue.prototype.$message.success('已确定该操作')
          }
          return true
        })
        .catch(() => {
          console.log(typeof error === 'function', error)
          if (typeof error === 'function') {
            error()
          } else {
            Vue.prototype.$message.info('已取消该操作')
          }
          return false
        })
        .finally(finallyFn)
    }

    Vue.prototype.$isSuccess = ({
      success,
      successText = '操作成功',
      error,
      errorText = '操作失败',
      msg,
      ...res
    } = {}) => {
      return new Promise((resolve, reject) => {
        if ($SUC(res)) {
          Vue.prototype.$message.success(successText)
          if (typeof success === 'function') success()
          resolve(true)
        } else {
          Vue.prototype.$message.error(msg || errorText)
          if (typeof error === 'function') error()
          reject(false)
        }
      }).catch((err) => {
        return err
      })
    }

    Vue.prototype.validData = validData
  }
}

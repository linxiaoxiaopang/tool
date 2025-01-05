/* eslint-disable */
import { debounce } from 'lodash'
import { debouncePromise } from '@/utils'

export default {
  data() {
    return {
      paymentResult: null,
      waitTxt: '正在后台处理中。\n不要刷新或关闭浏览器。'
    }
  },
  created() {
    this.$on('finally', this.onPaymentFinally)
    this.$on('error', async () => {
      await this.$Confirm({
        type: 'error',
        center: false,
        showCancelButton: false,
        showClose: false,
        customClass: 'payment-failed-message',
        message: '授权失败'
      })
      this.onPaymentFailed()
    })
    this.$on('success', async () => {
      await this.$Confirm({
        type: 'success',
        center: false,
        showCancelButton: false,
        showClose: false,
        customClass: 'payment-success-message',
        message: '授权成功'
      })
      this.onPaymentSuccess()
    })
  },
  methods: {
    handlePayment: debounce(
      function (url) {
        if (!url) return
        // 在原窗口上开一个小窗口
        var childWindow = window.open(url, 'childWindow', 'width=650,height=550,top=100,left=100');
  
        // 设置小窗口的位置和大小
        childWindow.resizeTo(650, 550);
        childWindow.moveTo(100, 100);
  
        // 设置小窗口的特性
        childWindow.toolbar = 0;  // 隐藏工具栏
        childWindow.menubar = 0;  // 隐藏菜单栏
        childWindow.scrollbars = 1;  // 显示滚动条
        
        this.openWaitingBox()
      }
    ),
    openWaitingBox: debounce(
      async function () {
        this.$Confirm({
          type: 'warning',
          showButton: false,
          showClose: false,
          customClass: 'payment-waiting-message',
          title: '请稍等',
          message: this.waitTxt
        }).finally(() => { // 直接关闭（支付中断）
          this.onWaitingBoxClose()
          this.onPaymentBreak()
        })
        
        this.addMessageEvent()
      }
    ),
    addMessageEvent() {
      this.removeMessageEvent()
      window.addEventListener('message', this.onmessage)
      this.$once('hook:destroyed', () => {
        this.removeMessageEvent()
      })
    },
    removeMessageEvent() {
      window.removeEventListener('message', this.onmessage)
    },
    onmessage: debounce(
      async function (query) {
        console.log(query)
        const res = await this.validatePaymentResult(query)
        this.closeWaitingBox()
        console.log(res, this.paymentResult)
        this.$emit('finally', this.paymentResult)
        if (!res) {
          this.$emit('error', this.paymentResult)
          return
        }
  
        this.$emit('success', this.paymentResult)
      }
    ),
    validatePaymentResult({ data }) {
      // paymentResult 支付结果 0-失败 1-成功 2-未支付
      this.paymentResult = Number(data === 'success')
      return [false, true][this.paymentResult]
    },
    // 关闭 payment-waiting-message
    closeWaitingBox() {
      const msgBox = document.querySelector('.payment-waiting-message')?.parentNode
      msgBox?.__vue__.$parent.close()
  
      // doClose 不触发 $Confirm 回调
      this.onWaitingBoxClose()
    },
    onWaitingBoxClose() {
      this.removeMessageEvent()
    },
    
    onPaymentBreak() {
      // this.$router.back()
    },
    onPaymentFinally() {
      // this.$router.back()
    },
    onPaymentSuccess() {},
    onPaymentFailed() {}
  }
}
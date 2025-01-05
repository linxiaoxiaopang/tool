import ReconnectingWebSocket from 'reconnecting-websocket'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
const baseUrl = process.env.VUE_APP_BASE_API || process.env.VUE_APP_BASE_URL
const APP_WS_BASE_API = baseUrl
  .replace(
    /https?/,
    /192.168.10/.test(baseUrl) ? 'ws' : 'wss'
  )

export default {
  data() {
    return {
      APP_WS_BASE_API
    }
  },
  destroyed() {
    this.closeWebSocket()
  },
  computed: {
    ...mapGetters(['id']),
    websocketUrl() {
      return '/message/websocket'
    },
    websocketQuery() {
      return {
        userId: this.id
      }
    }
  },
  methods: {
    getToken,
    getWebsocketUrl() {
      return `${APP_WS_BASE_API}${this.websocketUrl}${this.getWebsocketParams()}`
    },
    getWebsocketParams() {
      let { websocketQuery } = this
      let tempArr = []
      for (const websocketQueryKey in websocketQuery) {
        tempArr.push(`${websocketQueryKey}=${websocketQuery[websocketQueryKey]}`)
      }
      return `?${tempArr.join('&')}&x-access-token=${getToken()}`
    },
    // 创建 websocket 链接
    createWebsocket() {
      this.closeWebSocket()

      this.websocket = new ReconnectingWebSocket(
        this.getWebsocketUrl()
      )
      // this.websocket = new ReconnectingWebSocket('ws://121.40.165.18:8800') //测试的链接
      // 连接发生错误的回调方法
      this.websocket.onerror = this.websocketOnerror
      // 连接成功建立的回调方法
      this.websocket.onopen = this.websocketOnopen
      // 接收到消息的回调方法
      this.websocket.onmessage = this.websocketOnmessage
      // 连接关闭的回调方法
      this.websocket.onclose = this.websocketOnclose
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      this.websocket.onbeforeunload = this.websocketOnbeforeunload

      // 监听浏览器tab切换
      // this.visibilitychange()
    },
    // 连接发生错误的回调方法
    websocketOnerror() {
      console.log('连接发生错误的回调方法')
    },
    // 连接成功建立的回调方法
    websocketOnopen() {
      console.log('连接成功建立的回调方法')
    },
    // 接收到消息的回调方法
    websocketOnmessage(event) {
      const data = JSON.parse(event.data)
      console.log('接收到的event', event)
      console.log('接收到消息的回调方法', data)
    },
    // 连接关闭的回调方法
    websocketOnclose() {
      console.log('连接关闭的回调方法')
    },
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
    websocketOnbeforeunload() {
      this.closeWebSocket()
      console.log(
        '监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常'
      )
    },
    // 关闭WebSocket连接
    closeWebSocket() {
      this.websocket?.close?.()
    },

    visibilitychange() {
      this.visibilitychangeClose?.()
      this.visibilitychangeClose = visibilitychange({
        onShow: this.createWebsocket,
        onHide: this.closeWebSocket
      })
      this.$once('hook:destroyed', () => {
        this.visibilitychangeClose()
      })
    }
  }
}

export function visibilitychange({ onShow, onHide }) {
  var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
      'mozHidden' in document ? 'mozHidden' :
        null
  var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
  var onVisibilityChange = function(){
    if (!document[hiddenProperty]) {
      onShow()
      // console.log('页面激活', document[hiddenProperty], +new Date())
    }else{
      onHide()
      // console.log('页面非激活', document[hiddenProperty], +new Date())
    }
  }
  document.addEventListener(visibilityChangeEvent, onVisibilityChange)

  return () => {
    document.removeEventListener(visibilityChangeEvent, onVisibilityChange)
  }
}

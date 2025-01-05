<template>
  <div v-show="showBox" :class="mode == 'pop' ? 'mask' : ''">
    <div :class="mode == 'pop' ? 'verifybox' : ''" :style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }">
      <div v-if="mode == 'pop'" class="verifybox-top">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close" />
        </span>
      </div>
      <div class="verifybox-bottom" :style="{ padding: mode == 'pop' ? '15px' : '0' }">
        <!-- 验证码容器 -->
        <components
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :captcha-type="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :v-space="vSpace"
          :explain="explain"
          :img-size="imgSize"
          :block-size="blockSize"
          :bar-size="barSize"
          :default-img="defaultImg"
        />
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
/**
 * Verify 验证码组件
 * @description 分发验证码使用
 * */
import VerifySlide from './Verify/VerifySlide'
import VerifyPoints from './Verify/VerifyPoints'

export default {
  name: 'Vue2Verify',
  components: {
    VerifySlide,
    VerifyPoints
  },
  props: {
    // 双语化
    locale: {
      require: false,
      type: String,
      default() {
        // 默认语言不输入为浏览器语言
        if (navigator.language) {
          var language = navigator.language
        } else {
          var language = navigator.browserLanguage
        }
        return language
      }
    },
    captchaType: {
      type: String,
      required: true
    },
    figure: {
      type: Number
    },
    arith: {
      type: Number
    },
    mode: {
      type: String,
      default: 'pop'
    },
    vSpace: {
      type: Number
    },
    explain: {
      type: String
    },
    imgSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '155px'
        }
      }
    },
    blockSize: {
      type: Object
    },
    barSize: {
      type: Object
    }
  },
  data() {
    return {
      // showBox:true,
      clickShow: false,
      // 内部类型
      verifyType: undefined,
      // 所用组件类型
      componentType: undefined,
      // 默认图片
      defaultImg: require('./image/default.jpg')
    }
  },
  computed: {
    instance() {
      return this.$refs.instance || {}
    },
    showBox() {
      if (this.mode == 'pop') {
        return this.clickShow
      } else {
        return true
      }
    }
  },
  watch: {
    captchaType: {
      immediate: true,
      handler(captchaType) {
        switch (captchaType.toString()) {
          case 'blockPuzzle':
            this.verifyType = '2'
            this.componentType = 'VerifySlide'
            break
          case 'clickWord':
            this.verifyType = ''
            this.componentType = 'VerifyPoints'
            break
        }
      }
    }
  },
  mounted() {
    this.uuid()
  },
  methods: {
    // 生成 uuid
    uuid() {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      var slider = 'slider' + '-' + s.join('')
      var point = 'point' + '-' + s.join('')
      // 判断下是否存在 slider
      console.log(localStorage.getItem('slider'))
      if (!localStorage.getItem('slider')) {
        localStorage.setItem('slider', slider)
      }
      if (!localStorage.getItem('point')) {
        localStorage.setItem('point', point)
      }
    },
    /**
     * i18n
     * @description 兼容vue-i18n 调用$t来转换ok
     * @param {String} text-被转换的目标
     * @return {String} i18n的结果
     * */
    i18n(text) {
      if (this.$t) {
        return this.$t(text)
      } else {
        // 兼容不存在的语言
        const i18n = this.$options.i18n.messages[this.locale] || this.$options.i18n.messages['en-US']
        return i18n[text]
      }
    },
    /**
     * refresh
     * @description 刷新
     * */
    refresh() {
      if (this.instance.refresh) {
        this.instance.refresh()
      }
    },
    closeBox() {
      this.clickShow = false
      this.refresh()
    },
    show() {
      if (this.mode == 'pop') {
        this.clickShow = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    /* display: none; */
    transition: all 0.5s;
  }
::v-deep {
  .verifybox {
    position: relative;
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px solid #e4e7eb;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .verifybox-top {
    padding: 0 15px;
    height: 50px;
    line-height: 50px;
    text-align: left;
    font-size: 16px;
    color: #45494c;
    border-bottom: 1px solid #e4e7eb;
    box-sizing: border-box;
  }
  .verifybox-bottom {
    padding: 15px;
    box-sizing: border-box;
  }
  .verifybox-close {
    position: absolute;
    //top: 13px;
    right: 9px;
    width: 24px;
    height: 24px;
    text-align: center;
    cursor: pointer;
  }

  .verify-tips {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #fff;
  }
  .suc-bg {
    background-color: rgba(92, 184, 92, 0.5);
    filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
  }
  .err-bg {
    background-color: rgba(217, 83, 79, 0.5);
    filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
  }
  .tips-enter,
  .tips-leave-to {
    bottom: -30px;
  }
  .tips-enter-active,
  .tips-leave-active {
    transition: bottom 0.5s;
  }
  .verify-code {
    font-size: 20px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 5px;
    border: 1px solid $color-border;
  }

  .cerify-code-panel {
    height: 100%;
    overflow: hidden;
  }

  .verify-code-area {
    float: left;
  }

  .verify-input-area {
    float: left;
    width: 60%;
    padding-right: 10px;
  }

  .verify-change-area {
    line-height: 30px;
    float: left;
  }

  .varify-input-code {
    display: inline-block;
    width: 100%;
    height: 25px;
  }

  .verify-change-code {
    color: #337ab7;
    cursor: pointer;
  }

  .verify-btn {
    width: 200px;
    height: 30px;
    background-color: #337ab7;
    color: #ffffff;
    border: none;
    margin-top: 10px;
  }

  .verify-bar-area {
    position: relative;
    background: #f6f8f9;
    text-align: center;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    border: 1px solid $border-color;
    -webkit-border-radius: 4px;
  }

  .verify-bar-area .verify-move-block {
    position: absolute;
    top: -1px;
    left: 0;
    background: #008bf6;
    cursor: pointer;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    border: 1px solid;
    //border: 1px solid;
    -webkit-border-radius: 1px;
  }

  .verify-bar-area .verify-move-block:hover {
    background-color: #008bf6;
    color: #ffffff;
  }

  .verify-bar-area .verify-left-bar {
    position: absolute;
    top: -1px;
    left: -1px;
    background: #c8e6fd;
    cursor: pointer;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    border: 1px solid $color-border;
  }

  .verify-img-panel {
    margin: 0;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    border-top: 1px solid $color-border;
    border-bottom: 1px solid $color-border;
    border-radius: 3px;
    position: relative;
  }

  .verify-img-panel .verify-refresh {
    width: 25px;
    height: 25px;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
  }

  .verify-img-panel .icon-refresh {
    font-size: 20px;
    color: #fff;
  }

  .verify-img-panel .verify-gap {
    background-color: #fff;
    position: relative;
    z-index: 2;
    border: 1px solid #fff;
  }

  .verify-bar-area .verify-move-block .verify-sub-block {
    position: absolute;
    text-align: center;
    z-index: 3;
  }

  .verify-bar-area .verify-move-block .verify-icon {
    font-size: 18px;
  }

  .verify-bar-area .verify-msg {
    z-index: 3;
  }

  .iconfont {
    font-family: 'iconfont' !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon-check:before {
    content: ' ';
    display: block;
    width: 16px;
    height: 16px;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+VpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA0LTEwVDE1OjM1OjQ3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNC0xMFQxNTozNjowNyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNC0xMFQxNTozNjowNyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUI3MTFCRTlENzcyMTFFRDhCMjJCNTg1NjAxMjM4MDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUI3MTFCRUFENzcyMTFFRDhCMjJCNTg1NjAxMjM4MDMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QjcxMUJFN0Q3NzIxMUVEOEIyMkI1ODU2MDEyMzgwMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QjcxMUJFOEQ3NzIxMUVEOEIyMkI1ODU2MDEyMzgwMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgHjYysAAAAGUExURf///wAAAFXC034AAAACdFJOU/8A5bcwSgAAAtNJREFUeNrs3Qtu4zAMBNCZ+196Cyy6SBe1rR/JoTE6gKiXyLZEUwn4kgZDDDHEEEMMMcQQQwwxxBBDDDHEEEMMMcQQQwwxxBBDmgz8q70Agu/WG4KP1hkC/CJBd0dfCPCrBO0dhqg5ekLwEgheAsFLIHgJ5NbRCHLv6AN5cLSBPDm6QB4dTSDPjh4QvAQy4ugAGXI0gIw5+kLYDTLokIeMOtQhww5xyLhDGzLhkIbMOJQhUw5hyJxDFzLpkIXMOlQh0w5RCF4CWXBIQlYcipAlRyMIu0HWHHqQRYccZNWhBll2iEHWHVqQDYcUZMehBNlyCEH2HDqQTYcMZNehAtl2iEDwEsgBhwTkhOM/CNDV8QlZ60DhQv8B2ehDwfEPstdLveMCgnaOb8iBnmodlxA0c1xD0MtxA0Erxx0EnRy3EDRy3EPQx/EAQRvH1QMxWoIwSK4kIBhYIIkIBeZLQgKB+ZKQMGC6JCYImC0JCgEmS6ICgLmSsO7BVElc52CmJLJrJkoiv2wwTxI7adMevcFbBeQthoJvh2nL7OAHFJIWdvEP2pwlKuogR2MnrOGQET1lLZoQP2V3gIQR5Oxy4j/LnH0nwmdF1v45en6nZTSCr9S0HBNi7zmJubLQu2di9nJjOFByjJVwLEpS8+JbUx06jtGimpUDHblvXDZvo1BxjJc5TUogC5kbWrpjpvBsYnD5Dh5Y/kHBMVcKODrAAgePbC1Q75gtzhz6hZIKBw9tW1Ht4LFMAmodC3W/95IqBw9mqVDpWKrEvpbUOXg0A1roWKyN13PwcHa9zLF8WkHNwdNvbqocPP8yrR+ESg5GvKitOfXAQAnbQCjj2D4spuJgVIFJ+lGtA6VrEg5GFS+xIYQKDsYUxrEphPUORhRdsjGE1Q6eL+hlc8hfC8ua//7JEEMMMcQQQwwxxBBDDDHEEEMMMcQQQwwxxBBDDDGkafsjwACJtYsTGTh/nQAAAABJRU5ErkJggg==');
    background-size: contain;
  }

  //.icon-close:before {
  //  display: block;
  //  width: 16px;
  //  height: 16px;
  //  position: absolute;
  //  margin: auto;
  //  left: 0;
  //  right: 0;
  //  top: 0;
  //  bottom: 0;
  //  z-index: 9999;
  //  //background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+VpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA0LTEwVDE1OjA1OjU1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNC0xMFQxNTowNzo0OSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNC0xMFQxNTowNzo0OSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Njc2ODI5RDFENzZFMTFFRDlEODlBRjk4OTA5REFDRTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Njc2ODI5RDJENzZFMTFFRDlEODlBRjk4OTA5REFDRTgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NzY4MjlDRkQ3NkUxMUVEOUQ4OUFGOTg5MDlEQUNFOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NzY4MjlEMEQ3NkUxMUVEOUQ4OUFGOTg5MDlEQUNFOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pkv/9wsAAAAGUExURf///wAAAFXC034AAAACdFJOU/8A5bcwSgAAAwNJREFUeNrs3cthwzAMA1Bg/6V7aO+1JZJgEHgAyS+tHfEjBTS5EEgggQQSSCCBBBJIIIEEEkgggQQSSCCBrIYAYu2jG8D/g/xeQsWjG8CzUVSU5zeAx8MoJC9u4A0EYscxBNBKXs3/DgKtoxACqeMQAiglb2d/DYHSUQqB0IG6Z2RGcjDzCQQqRzkEIscpRCQ5m/UQAoXjHKKQnE4J7pIcTwiukpxPB26SXEwGLpLcTAXukVxNBK6R3E0DbpFcTgIukdxOAe6QXE8ArpDcDw9ukBQMDi6QVAwN6iUlA4NySc2woFpSNCgollQNCWolZQOCUkndcKBSUjgYpJMXfijKj7H2jyt8YZY+brpHtPq1IVvkFb/IVa//+i8kUWBavkTQLC06ljqSZFrD4lOxbO1ZRM8HEj1hzXxI1BWeTQepXQHzdLjdF/jPJkD6UjGzqZzOlNJkcq0zyTeZJuxNVs4lbnvTx3Mp6O40OIck3YWJqfJGf4GFI5L+ktdM6WyidMcByUQxdaYsO1EUplLCnRAKHcUbYXQOzrWTdDeyUCXhbghFjobNYhoHZ9vgOpvvqJDwMyAUOJo2VM47ON++2zVjIN/wr+XysLu8fl2+EF2WKC6LRpdlvEtg5RLquiQfXNJBLgk6l5SpSxLbpazgUuhxKb25FENdytMuDQMuLRwuTTUubU4ujWcurYAuzZku7bIuDcwuLeUuTf4u2y5cNsK4bE1y2Szmsn3PZUOlyxZXl03HLtvAXTbmuxyV4HJ4hctxIn3hdslCQe8YPnKnN01YsAjd4Bg8lqq/vHEd4OxwDB3dNlOWvQyetzgGjjecaye5SszscTQfATrbBneR9NvkaDwmd7599zihvMvRdJS0wNFzuLfC0XHcusbRcAC+yDH3kwSkSnIG0TmKf7ZD6Jj4IRVSKal7RkilpO5hJ6WSMgiplVR9s5NaSdUShRRLila/pFhSE1hRdBUFVn9DUXqh6tcuPuIKJJBAAgkkkEACCSSQQAIJJJBAAgkkkECE148AAwAjJ4BdSktqtAAAAABJRU5ErkJggg==');
  //  background-size: contain;
  //}

  .icon-right:before {
    content: ' ';
    display: block;
    width: 16px;
    height: 16px;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-size: cover;
    z-index: 9999;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+VpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA0LTEwVDE1OjI4OjM5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNC0xMFQxNTozMjowOCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNC0xMFQxNTozMjowOCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0NBMEFFRDZENzcxMTFFREIxQzBEOEU3RjcxMTFDRUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0NBMEFFRDdENzcxMTFFREIxQzBEOEU3RjcxMTFDRUUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDQ0EwQUVENEQ3NzExMUVEQjFDMEQ4RTdGNzExMUNFRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDQ0EwQUVENUQ3NzExMUVEQjFDMEQ4RTdGNzExMUNFRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plc1wbsAAAAGUExURf///wAAAFXC034AAAACdFJOU/8A5bcwSgAAAgZJREFUeNrs3VFuwzAQA1H2/pfuFYql2k7Z8X+AvBixJS21ysfIFSFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECF/8xv8OiTJBCR5JAnA8UQSguOFJAjHA0kYjl4SiKOWhOJoJcE4Skk4jk4SkKOShORoJEE5CklYjrskMMdZEprjKuHdkaME9x+5SmhPrbME9h65S1hv9kKCGms1EtLot5KA5iOdhDNDLCWYOXsroayi1BLIulYvYaw0PpAg1n5fSAir8U8kgPrIGwmgYvVGQii9PZEgaogvJIxi6AMJpKrbSyjl6VqCqbO3Ek5goJSAkg+dhBThqCSoLEojYYVqCgksHXSX0GJOZwkur3WV8IJnRwkwQXeTEKOAJwky03iR5IsfhV0zkMxAMgPJDCQzkMxAMgPJDCQzkMxAMgPJDCQzkMxA4h3xP+JTa/894ljL0a/zkf0ZoqsoaIcrjTTH3Gq89RErVvM1xKPDOrvJh3+RRSkc5rVM0H2Tw5QpzWESm+ZwtwLN4Y4emsNdbzSHO0NpDndP0xx2GKA57MJBc9iphuawmxPNYcczmsOugN8m+fhDkJnOmTu9THe6y+70+93pwLzTE3unS/lO3/idTv47ZyvsnHaxc/7IzokwO2f0wH4PIUKECBEiRIgQIUKECBEiRIgQIUKECBEiRIgQIT99fQowAM7LfEXlbTjXAAAAAElFTkSuQmCC');
    background-size: contain;
  }

  .icon-refresh:before {
    content: ' ';
    display: block;
    width: 18px;
    height: 18px;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+VpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA0LTEwVDE1OjM2OjUwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNC0xMFQxNTozNzozNiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNC0xMFQxNTozNzozNiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTAyOTBENURENzcyMTFFREE4QTJDQUE5MTM4MUUxMTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTAyOTBENUVENzcyMTFFREE4QTJDQUE5MTM4MUUxMTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MDI5MEQ1QkQ3NzIxMUVEQThBMkNBQTkxMzgxRTExNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MDI5MEQ1Q0Q3NzIxMUVEQThBMkNBQTkxMzgxRTExNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsR09vAAAAAGUExURQCL9gAAAMBccTcAAAACdFJOU/8A5bcwSgAAAxlJREFUeNrs3UGW4zAIBNDi/peeWc5i2i1EAYUNBwB+lPjFcoJgLwksZCELWchCFrKQPAgeIpKuEILDuM1ZAoEzrrJmQ3AZ/syZEMTCmTsNgni4kudAwIpeCJjRBgE9DotwIUiJcgiyohiCxCiEIDmqIEChJA+CksiHALWSJAjqIhWC0siDAPWSBAjqIwUCtEjoEM6XWX8SNiT59jX+JZnuqPjQ3UMStngilmtIkuLacgvJZLD2w0ApU70RcwcpYHgpV5AaRvjKiGB2mQ1wKDkil3lEElc/WLmH1DvOKFRI4lM0OqTHcXfBx12+7CebVIjcRZcP6Xb4IMIOF0TZwYEIODwQaYcDUnXdbYPYMIj4ghxDIL4gYYjpvrMMnQ7i1ffVELn7wbNfehwnb7sdnAEhPa34H6T4Vqoa0nlje9QJmheEsFnqgph8vBYy1fFayFjHtyA2D4KFTIDYQtogeDXEFrKQKASvhthCFpICsYX0QbCQhXwZ8lNjwyA/t4ZRF62H5kZBnrqbBHlsbyEKjn/7W4iEYyELWchCFrKQhbggWMhC3g7BByE2D2IfhGAhtR+RD0EwEGLTIDYPgoWISZwQ2SU5eIW/BMFCch1PEJsEMTcEC6l7Z434kf9RTwMguIIISs460oeACsE8iNqSnL6w7X+ozINoLcnxy9r+X916CIQcZxChJQnOfNBZkjHDK3iO5nEidw7HaRcSkPCoBBVJdMKAypsLFEi/JDwqQUTiLt8+uo1VvX+YHqm2wHhDTmWFgZOUwoIjQO/KwsQkuCyqNib3umJgcHG1IwIpHsEcqQbTkYRq6YxbDxZSGYAfrqJxJAGhhMIhEZT8rGM7MhlnPbKKIY1x2CKvnt/CzMo+bIitOM6YcfxTcTInhHSuNCdLCNJyRJplQEzZIX2MoK81k5VYJsRUHbKHn/rbMkmJVUBqDzpOhZieQ/AQ7duGTExi1ZAcSqCb3HvUKkYQQrVEG8nfAalgMCAEC6WHmv21gh2+qi3P7C1X7j50E4IPyds5aoD8xskqaC+JhSxkIQtZyEIW8jf+CDAA3Khxfht1LEoAAAAASUVORK5CYII=');
    background-size: contain;
  }
}
</style>

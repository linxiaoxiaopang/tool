<template>
  <div class="empty-component">
    <i :class="['iconfont', 'icon', emptyObj.icon]"></i>
    <div class="txt">
      <slot>
        <span v-html="emptyObj.txt"></span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'data'
    }
  },

  computed: {
    emptyObj({ type }) {
      return ({
        data: {
          icon: 'icon-wushuju',
          txt: '暂无数据'
        },
        picture: {
          icon: 'icon-wutu',
          txt: '暂无图片'
        },
        error: {
          icon: 'icon-yemiandiushi',
          txt: '404<br/>抱歉，页面没找到'
        },
        searchResult:{
          icon:'icon-wushuju',
          txt:`<p class="txt">很抱歉，没有搜索到相关信息。</p><p class="txt">您可以尝试调整关键字进行搜索。</p>`
        }
      })[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-component {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 30px;
  font-size: $text-medium;
  color: $color-sub;
  width: 100%;
}

.icon {
  font-size: 50px;
  max-width: 50vw;
}

.txt {
  text-align: center;
  margin-top: 8px;
}
</style>

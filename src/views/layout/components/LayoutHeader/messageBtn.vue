<template>
  <el-popover
    popper-class="message-popover-class"
    placement="bottom"
    width="420"
    trigger="hover"
    v-model="visible"
    :visible-arrow="false"
    :offset="-30"
  >
    <div class="messageBox">
      <!-- <div class="messageTitle">消息通知</div> -->
      <div class="message-box-content" v-if="data.length">
        <InfiniteScroll style="padding: 0 10px" :span="24" :data="data" :total="unReadNumber" @load="load">
          <template #default="{ data: item }">
            <div class="messageCard" @click="messageCardClick(item)">
              <div class="card-title">
                <span>{{ item.businessTypeName || '默认消息' }}</span>
                <span>{{ item.createTime }}</span>
              </div>
              <div class="card-body">
                <i class="makeicon" v-if="!item.isRead"></i>
                {{ item.context }}
              </div>
            </div>
          </template>
        </InfiniteScroll>
      </div>
      <div v-else class="empty" v-loading="tableLoading"  v-empty="data">
        <!-- <i class="iconfont icon-renwu icon"></i>
        <div>暂无消息</div> -->
      </div>
      <section class="messageFoot">
        <ColorTextBtn @click="clickAllRead" type="info" class="footbtn" v-p="['externalbusiness:message:isRead']">
          <i class="iconfont icon-shejiqi_qingkong readClass"></i> <span style="color:#86909C;">全部已读</span> </ColorTextBtn
        >
        <ColorTextBtn @click="clickAllMessage" class="footbtn" v-p="['externalbusiness:message:allMessage']"
          >全部消息 <i class="el-icon-arrow-right"></i
        ></ColorTextBtn>
      </section>
    </div>
    <el-badge
      slot="reference"
      :value="unReadNumber"
      :max="99"
      :class="{ customBadgeClass: unReadNumber > 9 }"
      :hidden="!unReadNumber"
    >
      <div class="notice-icon">
        <svg-icon icon-class="ic_message" />
      </div>
    </el-badge>
  </el-popover>
</template>

<script>
import InfiniteScroll from '@/components/infiniteScroll'
import websocketMixin from '@/mixins/websocketMixin'
import initDataMixin from '@/mixins/initData'
// import { readUpdateStatus, messageList, firstLoginMessage } from '@/api/message'
import { mapState } from 'vuex'
export default {
  mixins: [websocketMixin, initDataMixin],
  components: {
    InfiniteScroll
  },
  props: {},
  data() {
    return {
      visible: false,
      url: '/externalbusiness/messageService/messageSendRecord/list',
      query: {
        isRead: 0,
        orderItems: [{ asc: false, column: 'create_time' }]
      },
      xMenuType: 'other',
      size: 5,
      unReadNumber: 0,
      infiniteScroll: true
    }
  },

  watch: {
    isLinkWebsocket: {
      handler(newVal) {
        if (newVal) {
          this.createWebsocket()
        } else {
          this.closeWebSocket()
        }
      }
    },

    visible(newVal) {
      if (!newVal) {
        this.page = 1
        this.data = []
      }
      if (newVal) {
        this.init()
      }
    }
  },

  created() {
    this.$bus.$on('changeUnReadNum', (val) => {
      this.unReadNumber = val
    })
  },

  mounted() {
    this.firstLogin()
    // 创建 websocket 链接
    this.createWebsocket()
  },

  computed: {
    ...mapState({
      isLinkWebsocket(state) {
        return state.user.isLinkWebsocket
      }
    })
  },

  methods: {
    load() {
      this.page++
      this.init()
    },

    getLabel() {},

    async clickAllRead() {
      const unReadIdList = this.data
        .filter(({ isRead }) => {
          return isRead === 0
        })
        .map(({ id }) => {
          return id
        })
      this.data.map((item) => {
        item.isRead = 1
      })
      if (!unReadIdList.length) {
        this.$message.warning('当前暂无未读消息')
        return
      }
      const { code } = await readUpdateStatus({ idList: unReadIdList })
      if (code === 0) {
        this.$message.success('全部消息已读')
        this.unReadNumber = 0
      } else {
        this.$message.error('操作失败')
      }
    },

    clickAllMessage() {
      this.visible = false
      this.$router.push({
        path: '/message/center'
      })
    },

    websocketOnmessage(event) {
      const data = JSON.parse(event.data)
      console.log(data)
      for (let key in data) {
        if (key === 'forbidden') {
          this.$store.commit('WEBSOCKET_STATUS_CHANGE', false)
        }
        // tradeType这个字段标示支付通知类型，ORDER_PAY是订单支付结果，RECHARGE_PAY是充值支付结果
        if (key === 'tradeType') {
          this.$store.commit('EMIT_WEBSOCKET_EVENT', {
            type: data[key],
            message: data
          })
        }
      }
      this.init()
    },

    async messageCardClick(item) {
      if (!item.isRead) {
        item.isRead = 1
        let id = item.id
        this.unReadNumber--
        const { code } = await readUpdateStatus({ idList: [id] })
        this.judge(code)
      }
    },

    // 判断
    judge(code) {
      if (code !== 0) {
        this.$message.error('操作失败')
      }
    },

    // 是否首次登录
    async firstLogin() {
      await firstLoginMessage()
    },

    initCallBack({ page } = {}) {
      this.unReadNumber = page?.total
    }
  }
}
</script>
<style lang="scss">
.message-popover-class {
  padding: 0;
  top: 55px !important;
  .icon {
    width: 55px;
    height: 40px;
  }
}
</style>
<style scoped lang="scss">
::v-deep{
  .empty-component{
    .txt{
    margin-top: 20px;
  }
  }
  
}
.notice-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  .svg-icon {
    width: 100%;
    height: 100%;
  }
  .svg-icon:hover {
    color: #eee;
  }
}
.font-color {
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
}
.font {
  color: #eee;
}
::v-deep .el-badge__content {
  left: -5px;
  top: -5px;
  border: none;
  height: 16px;
  width: 16px;
  padding: 0;
  line-height: 16px;
  font-size: 12px;
  border-radius: 50%;
  text-align: center;
  background-color: #ff4949;
  transform: translateY(-10%) translateX(100%) scale(0.7)!important;
}
.customBadgeClass {
  ::v-deep .el-badge__content {
    border: none;
    padding: 0;
    height: 18px;
    width: 28px;
    line-height: 18px;
    font-size: 12px;
    border-radius: 9px;
    text-align: center;
    background-color: #ff4949;
    left: -20px;
  }
}
.empty {
  padding: 40px 0px;
  text-align: center;
}
.messageBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .messageTitle {
    font-size: 16px;
    color: #495060;
    font-weight: medium;
    border-bottom: 1px solid rgba(15, 32, 68, 0.1);
    padding: 15px 10px;
  }
  .message-box-content {
    height: 450px;
  }
  .messageCard {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    .card-title {
      font-size: 12px;
      display: flex;
      color: #9da3ac;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .card-body {
      @include overflow-more(2);
      font-size: 14px;
      color: #495060;
      font-weight: medium;
      .makeicon {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        color: #495060;
        background-color: red;
        line-height: 20px;
        margin-bottom: 2px;
      }
    }
  }

  .messageFoot {
    height: 50px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(173, 173, 173, 0.2);
    .readClass {
      font-size: 20px;
      position: relative;
      top: 2px;
    }
    .footbtn {
      font-size: 14px;
      padding: 0 10px;
    }
  }
}
::v-deep .el-badge__content.is-fixed {
  // right:10px;
  transform: translateY(-10%) translateX(100%);
}
</style>

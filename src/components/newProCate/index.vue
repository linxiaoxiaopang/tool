<template>
  <div class="sidebar-container2">
    <div class="select">
      <div class="cascader">
        <ProtoTypeTreeSelect v-model="query.productCategoryId" @change="searchChange" placeholder="请选择分类"/>
      </div>
      <div class="cascader_line2">
        <el-input
          clearable
          size="mini"
          placeholder="搜索产品名称款式"
          suffix-icon="el-icon-search"
          v-model="query.nameOrStyle"
          @keyup.native.enter="searchChange"
          @clear="searchReset(false)"
        >
        </el-input>
        <el-button size="mini" @click="searchReset">重置</el-button>
      </div>
    </div>
    <div class="list-grounp" v-if="showData.length > 0">
      <div class="list" v-for="v in showData" :key="v.id" @click="changePrototypeId(v)">
        <div :class="['list-left', 'bg-multiply', isActive(v) && 'active']">
          <!-- <el-image class="multiply" fit="contain" :src="v.imgurl" alt="" /> -->
          <base-image :src="v.imgurl" class="multiply" size="110" imgSize="none" fit="contain" ></base-image>
        </div>
        <div class="list-right">
          <div class="list-right-name">{{ v.chineseName }}</div>
          <div class="item-style">
            <el-tooltip v-if='v.styleName.length > 1' effect="light" :content="v.styleName.join('，')" placement="top">
              <div>款式：{{ v.styleName.join('，') }}</div>
            </el-tooltip>
            <div v-else>款式：{{ v.styleName.join('，') }}</div>
          </div>
          <div>￥{{ v.price }}起</div>
        </div>
      </div>
    </div>
    <div class="noData" v-else>暂无数据</div>
  </div>
</template>

<script>
import ProtoTypeTreeSelect from '@/components/elProtoTypeTreeSelect'
import { initDataMixin } from '@/mixins'
import { mapGetters, mapMutations } from 'vuex'
import get from 'lodash/get'
import { getPrototypeListMinPrice } from '@/utils'
export default {
  mixins: [initDataMixin],

  components: {
    ProtoTypeTreeSelect
  },

  data() {
    return {
      url: '/externalbusiness/productService/finishedProd/publicPrototypeList',
      showData: [],
      first: true
    }
  },

  computed: {
    ...mapGetters(['prototypeId']),

    //当前激活的原型
    isActive({ prototypeId }) {
      return (row) => {
        return prototypeId == row.id
      }
    },

    restart() {
      const { sizeList = [] } = this.data
      const allPrice = []
      ;(sizeList || []).map(({ sizeLevelCategoryPriceList }) => {
        ;(sizeLevelCategoryPriceList || []).map(({ price }) => {
          allPrice.push(price)
        })
      })

      if (allPrice.length) {
        return Math.min.apply(null, allPrice)
      } else {
        return '0'
      }
    }
  },

  watch:{
    'query.productCategoryId'(n){
      if(!n) this.searchReset(false)
    } },

  methods: {
    ...mapMutations(['CAHNGE_PROTOTYPE_ID', 'changeDataLength']),
    initCallBack(res) {
      this.showData = this.data.map((v) => {
        const chineseName = v.chineseName
        let price = 0
        const id = v.id
        const styleName = get(v, 'styleList', []).map((item) => item.name)
        const imgurl = get(v, 'styleList[0].styleDisplayImageList[0].displayImagePath', '')
        const sizeList = v.sizeList || []
        return {
          id,
          chineseName,
          styleName,
          price: getPrototypeListMinPrice(sizeList),
          imgurl
        }
      })
      if (this.showData.length > 0) {
        console.log('重置')
        this.changeDataLength(this.showData.length)
        !this.first && this.changePrototypeId(this.showData[0])
        this.first =  false
      } else {
        this.changeDataLength(0)
        this.$emit('changeReturnEmptyData',null)
      }
    },
    /**
     * @description: 调用vuex 更换原型id
     * @param {Object} v
     * @return {undefined}
     */
    changePrototypeId(v) {
      this.CAHNGE_PROTOTYPE_ID(v.id)
    },
    searchReset(flag=true) {
      flag && ( this.first =  true)
      this.changePrototypeId({ id: undefined })
      this.$emit('reset')
      this.query = {
        nameOrStyle: ''
      }
      this.searchChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-container2 {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #000;
  width: 236px;
  max-height: $app-container-height;
  background-color: #fff;
  border: 1px solid #F2F3F5;
  padding: 10px 7px;
  margin-right: 16px;
  .cascader {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .classify {
      white-space: nowrap;
      font-size: 14px;
      width: 60px;
    }
    .classify::first-letter {
      letter-spacing: 20px;
    }
  }
  .cascader_line2 {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding-top: 0px;
    .el-button {
      margin-left: 5px;
    }
  }
  .list-grounp {
    flex: 1;
    margin-top: 25px;
    overflow-y: auto;
    .list {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      cursor: pointer;
      .list-left {
        margin-right: 10px;
        width: 100px;
        height: 90px;
        font-size: 14px;
        border-radius: 4px;
        border: 1px solid $border-light-color;
        box-sizing: border-box;
        .el-image {
          width: 100%;
          height: 100%;
        }
      }
      .list-left.active {
        border-color: $color-primary;
      }
      .list-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 110px;
        height: 80px;
        font-size: 14px;
        color: #636c78;
        div {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .list-right-product {
          color: #9da3ac;
        }
      }
    }
  }
  .noData {
    font-size: 14px;
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
  }
}
</style>

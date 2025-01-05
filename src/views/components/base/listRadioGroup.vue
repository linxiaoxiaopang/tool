<template>
  <div class="search-radio-group" :class="`search-radio-group--${theme}`">
    <div v-show="!openMore" class="search-radio-init">
      <avueCrud-radio
        v-if="!openMore"
        type="button-plain"
        :size="size"
        :gutter="4"
        :value="curVal"
        :dic="allDic.concat(sliceList.list[0])"
        :props="props"
        @click="handleClick"
      ></avueCrud-radio>
    </div>
    <el-card v-if="sliceList.isMore" v-show="openMore" shadow="never" style="margin-bottom: 4px">
      <div class="card-header" v-if="optionTheme.showCardHeader">
        <avueCrud-radio
          v-if="curSearchList.length"
          type="button-plain"
          size="mini"
          :gutter="4"
          :value="curSearchType"
          :dic="[{ [searchProps.label]: '全部', [searchProps.value]: 'all' }].concat(curSearchList)"
          :props="searchProps"
          @click="handleSearchClick"
        ></avueCrud-radio>
        <div v-else></div>
        <el-input
          v-model="moreSearchInput"
          class="search-input"
          size="small"
          suffix-icon="el-icon-search"
          placeholder="请输入关键字"
        ></el-input>
      </div>

      <div class="card-content">
        <avueCrud-radio
          :type="optionTheme.cardContentType"
          :gutter="14"
          :value="curVal"
          :dic="allDic.concat(moreList)"
          :props="props"
          @click="handleClick"
        ></avueCrud-radio>
      </div>
    </el-card>
    <more-btn v-if="sliceList.isMore" :openText="$attrs.openText" :closeText="$attrs.closeText" v-model="openMore" :size="size"></more-btn>
  </div>
</template>

<script>
import moreBtn from './moreBtn'
export default {
  name: 'ListRadioGroup',
  components: {
    moreBtn
  },
  props: {
    theme: {
      type: String,
      default: 'default'
    },
    // 绑定值
    value: {},
    // 单选列表字典
    list: {
      type: Array,
      default: () => []
    },
    hasAll: {
      type: Boolean,
      default: true
    },
    allValue: {
      type: String,
      default: 'all'
    },
    allText: {
      type: String,
      default: '全部'
    },
    // 收缩时按钮展示数量
    topSize: {
      type: Number,
      default: 10
    },
    // label: 字典的名称属性值
    // value: 字典的值属性值
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    // 展开后，搜索框字段
    searchInputProp: String,
    // 展开后，搜索单选默认值
    searchType: {
      default: 'all'
    },
    // 展开后，搜索单选列表字典
    searchList: {
      type: Array,
      default: () => []
    },
    // 展开后，搜索单选列表字典
    // label: 字典的名称属性值
    // value: 字典的值属性值
    searchProps: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    // 展开后，搜索单选列表字段
    searchRadioProp: String,
    searchRadioValidateType: String,
    dic: {},
    dicData: {},
    column: {},

    size: {
      default: 'mini'
    }
  },
  data() {
    return {
      moreSearchInput: '',
      openMore: false,
      curVal: '',
      curSearchType: ''
    }
  },
  computed: {
    optionTheme({ theme }) {
      return {
        border: {
          cardContentType: 'button-plain',
          showCardHeader: false
        },
        default: {
          cardContentType: 'text',
          showCardHeader: true
        }
      }[theme]
    },

    // 收缩时，单选列表字典
    sliceList({ list, topSize }) {
      return {
        topSize,
        // 展开按钮是否显示
        isMore: list.length > topSize,
        // 根据topSize，将单选列表字典切割成两份
        list: [list.slice(0, topSize), list.slice(topSize)]
      }
    },
    // 展开时，单选列表字典
    moreList({ sliceList, validateBySearchInput, validateBySearchRadio }) {
      let allSliceList = []
      allSliceList = allSliceList.concat(sliceList.list[0], sliceList.list[1])
      return allSliceList.filter(
        (item) => validateBySearchInput(item) && validateBySearchRadio(item)
      )
    },
    // 通过搜索框值，验证字典项是否正确（筛选单选列表字典）
    validateBySearchInput({ curSearchInputProp, moreSearchInput }) {
      let regExp = new RegExp(moreSearchInput, 'img')
      return (item) => {
        regExp.lastIndex = 0
        return regExp.test(item[curSearchInputProp])
      }
    },
    // 搜索框字段
    curSearchInputProp({ props, searchInputProp }) {
      return  searchInputProp || props.label
    },
    // 通过搜索单选值，验证字典项是否正确（筛选单选列表字典）
    validateBySearchRadio({ curSearchRadioProp, curSearchType }) {
      if (this.searchRadioValidateType === 'equal') {
        return (item) => {
          return ['all', item[curSearchRadioProp]].includes(curSearchType)
        }
      }

      let regExp = new RegExp(
        curSearchType === 'all' ? '' : curSearchType,
        'img'
      )
      return (item) => {
        regExp.lastIndex = 0
        return regExp.test(item[curSearchRadioProp])
      }
    },
    // 搜索单选字段
    curSearchRadioProp({ searchProps, searchRadioProp }) {
      return searchRadioProp || searchProps.value
    },
    // 展开后，搜索单选列表字典
    curSearchList({ searchList }) {
      // console.log(searchList)
      return searchList.slice(0, 7)
    },

    defaultValue() {
      if (!this.hasAll) return this.list[0]?.value
      return this.allValue
    },
    allDic({ props }) {
      return this.hasAll
        ? [{
          [props.label] : this.allText,
          [props.value] : this.allValue
        }]
        : []
    }
  },
  watch: {
    value: {
      handler(n) {
        this.curVal = n
      },
      immediate: true
    },
    searchType: {
      handler(n) {
        this.curSearchType = n
      },
      immediate: true
    },
    curSearchType(n) {
      this.$emit('update:searchType', n)
    }
  },
  methods: {
    onchange(val) {
      // console.log(val)
      this.curVal = val
      this.$emit('input', val)
      this.$emit('change', val)
      this.$emit('search-change', val)
    },
    handleClick(val) {
      if (this.curVal === val) {
        this.onchange(this.defaultValue)
      } else {
        this.onchange(val)
      }
    },
    handleSearchClick(val) {
      if (this.curSearchType === val) {
        this.curSearchType = 'all'
      } else {
        this.curSearchType = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-radio-group {
  $line-height: $form-line-height;
  $radio-height: 28px;
  $wrap-top: 6px;
  $radio-top: 0;
  $radio-left: 0;
  $more-btn-width: 52px;

  position: relative;
  width: 100%;
  height: 100%;
  margin-right: 5.5%;
  .search-radio-init {
    width: 100%;
    padding-right: $more-btn-width;
  }
  .more-btn {
    position: absolute;
    top: $wrap-top;
    right: 0;
  }
  .search-input {
    width: 246px;
  }
  ::v-deep {
    .el-card {
      margin-right: $more-btn-width;
    }
    .el-card__body {
      padding: 0;
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: calc(#{$radio-height} + 2 * #{$wrap-top});
      padding: 0 5px 0 10px;
      background-color: #f7f8fa;
    }
    .card-content {
      height: 100px;
      padding: 6px  24px 10px;
      overflow: auto;
      .el-radio {
        font-size: $text-normal;
        line-height: #{$text-normal + 20px};
      }
    }

    .el-radio.is-bordered {
      @include border-radius(half, 28);
      color: $color-sub;
      border-color: #D9D9D9;
      background-color: $color-white;
      &.is-checked {
        border-color: $color-primary;
      }
      .el-radio__input.is-checked + .el-radio__label {
        color: $color-primary;
      }
      .el-radio__label {
        padding: 0 11px;
      }
    }
  }
}

.search-radio-group--border {
  .el-card {
    border: none;
  }
  .card-content {
    background: $color-background;
    padding: 0;
    ::v-deep {
      .el-row {
        margin: 0!important;
      }
      .el-col[class*='el-col-1.5'] {
        margin-bottom: 15px;
        padding: 0 2px!important;
      }
    }
  }
}
</style>

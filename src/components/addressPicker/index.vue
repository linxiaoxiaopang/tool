<template>
  <el-row>
    <el-col :span="colSpan" v-for="(item, index) in addressList" :key="index">
      <el-form-item :label="item.label" :prop="item.prop">
        <el-select
          :class="[customClass]"
          :style="customStyle"
          size="small"
          clearable
          v-model="ruleForm[item.prop]"
          :placeholder="item.placeholder"
        >
          <el-option
            v-for="(curData, index) in addressListData[index] || []"
            :key="index"
            :label="curData.areaCnName"
            :value="curData.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter'
import addressApi from '@/api/userManage/address'

const { list } = addressApi

export default {
  mixins: [emitter],

  props: {
    colSpan: {
      type: Number,
      default: 3
    },
    customClass: {
      type: String,
      default: 'mr20'
    },
    customStyle: {
      type: String,
      default: 'width: 200px'
    },

    ruleForm: {
      type: Object,
      default: () => ({})
    },
    selectCountryId: {
      type: String,
      default: ''
    },
    hasCountryList: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      //记录上次选择的省ID
      addressListData: [],

      addressList: [
        {
          label: this.showLabel ? '所在地区' : undefined,
          placeholder: '请选择省/自治区/直辖市',
          type: 'province',
          prop: 'provinceCode'
        },
        {
          label: undefined,
          placeholder: '请选择市/区',
          type: 'city',
          prop: 'cityCode'
        },
        {
          label: undefined,
          placeholder: '请选择区/县',
          type: 'county',
          prop: 'countyCode'
        }
      ]
    }
  },
  watch: {
    'ruleForm.provinceCode': {
      handler(newVal) {
        this.addressListData = [this.addressListData[0]]
        this.ruleForm.cityCode = ''
        this.ruleForm.countyCode = ''
        if (newVal) {
          this.getNextData(newVal, 1)
        }
        if (this.selectCountryId && this.ruleForm.provinceCode == '') {
          this.$emit('update:selectCountryId', undefined)
          this.$nextTick(() => this.getCountryData())
        }
      },
      immediate: true
    },
    'ruleForm.cityCode'(newVal) {
      this.addressListData = [this.addressListData[0], this.addressListData[1]]
      this.ruleForm.countyCode = ''
      if (newVal) {
        this.getNextData(newVal, 2)
      }
    },
    selectCountryId: {
      handler(newVal) {
        if (this.hasCountryList && !this.selectCountryId) {
          this.ruleForm.cityCode = ''
          this.ruleForm.countyCode = ''
          this.ruleForm.provinceCode = ''
          this.getCountryData()
          return
        }
        this.getCountryData()
      },
      immediate: true
    }
  },

  mounted() {
    this.$watch(
      function () {
        const { provinceCode, cityCode, countyCode } = this.ruleForm
        return provinceCode + cityCode + countyCode
      },
      () => {
        this.$emit('adressUpdate', this.ruleForm)
        this.validateEvent && this.dispatch('ElFormItem', 'el.form.change', [this.ruleForm])
      }
    )
  },

  methods: {
    //根据当前id获取市或县的列表
    async getList(id) {
      const { detail } = await list({ id })
      return detail
    },
    //获取下一级数据并显示
    async getNextData(newVal, index) {
      const data = await this.getList(newVal)
      this.addressListData.splice(index, 1, data)
    },
    getCountryData() {
      try {
        const countryCode = this.hasCountryList ? this.selectCountryId : 'CN'
        const data = { countryCode }
        list(data).then(({ detail }) => {
          this.addressListData.splice(0, 1, detail || [])
        })
      } catch (error) {}
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-form-item__content {
    height: 40px !important;
  }
}
</style>

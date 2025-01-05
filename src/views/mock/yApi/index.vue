<template>
  <section class="app-container">
    <div class="input-wrapper flex-middle mb20">
      <avue-crud-input placeholder="输入yApi的导航栏url" v-model="url" style="width: 400px;"></avue-crud-input>
      <el-button class="ml10" @click="getYApiData">获取yApi数据</el-button>
    </div>

    <el-button class="mb20" @click="createMockData">
      生成模拟数据
    </el-button>

    <avue-crud-input class="mb20" v-model="mockDescribeJson" type="textarea"></avue-crud-input>
    <deepForm :form="form" :option="optionList"/>
  </section>
</template>
<script>
import { Notification } from 'element-ui'
import deepForm from './deepForm'
import { formatDate } from 'element-ui/src/utils/date-util'
import {
  createFormByDeepMapData,
  createFormColumns,
  fillForeignKeyList, formatMockData,
  getMockjsSyntax
} from './utils'
import axios from 'axios'
import Mock from 'mockjs'

const NO_LOGIN_CODE = 40011
window.Mock = Mock
export default {
  components: {
    deepForm
  },

  data() {
    return {
      form: {},
      url: 'http://192.168.10.198:3000/project/41/interface/api/10483',
      mockDescribeJson: '{}',
      optionList: {}
    }
  },

  computed: {
    mockDescribeData({ mockDescribeJson }) {
      return JSON.parse(mockDescribeJson)
    },

    id({ url }) {
      if (!url) return ''
      return url.split('/').pop()
    }
  },

  watch: {
    mockDescribeJson() {
      this.init()
    }
  },

  methods: {
    init() {
      this.form = createFormByDeepMapData(this.mockDescribeData)
      this.optionList = createFormColumns(this.form)
    },

    createMockData() {
      const foreignKeyList = []
      const syntaxRes = getMockjsSyntax(this.form, foreignKeyList)
      console.log('syntaxRes', syntaxRes)
      console.log('foreignKeyList', foreignKeyList)
      const mockRes = Mock.mock(syntaxRes)
      formatMockData(mockRes)
      fillForeignKeyList(mockRes, foreignKeyList)
      console.log('mockRes', mockRes)
      const fileName = `yApi_${this.id}-${formatDate(Date.now(), 'yyyyMMdd')}.json`
      this.downloadJSON(mockRes, fileName)
    },

    downloadJSON(data, filename) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url) // 释放对象 URL
    },

    validUrl() {
      if (!this.url) {
        this.$message.error('url不能为空')
        return false
      }
      try {
        new URL(this.url)
      } catch {
        this.$message.error('请输入合理的路径')
        return false
      }
      return true
    },

    async getYApiData() {
      const isValid = this.validUrl()
      if (!isValid) return
      let [err, data] = await awaitLoading(this.getBody())
      if (err && data == NO_LOGIN_CODE) {
        const [err1] = await this.login()
        if (err1) return;
        ;[err, data] = await awaitLoading(this.getBody())
        if (err) return
      }
      this.mockDescribeJson = data.res_body || '{}'
    },

    async getBody() {
      const res = await axios({
        method: 'get',
        url: `/api/interface/get?id=${this.id}`
      })
      return this.handleAxiosData(res)
    },

    handleAxiosData(res) {
      if (res.status !== 200 || res.data?.errcode !== 0) {
        Notification({
          type: 'error',
          title: '提示',
          message: '请求异常'
        })
        return [true, res?.data?.errcode]
      }
      return [false, res.data.data]
    },

    async login() {
      const res = await axios({
        method: 'POST',
        url: '/api/user/login',
        data: {
          email: '541953126@qq.com',
          password: 'Test123456'
        }
      })
      return this.handleAxiosData(res)
    }
  }
}
</script>

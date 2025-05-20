import axios from 'axios'
import axiosJsonpAdapter from 'axios-jsonp'
import { md5 } from '@/utils/md5'
import { merge, isString } from 'lodash'

// 创建支持 JSONP 的 axios 实例
const jsonpClient = axios.create({
  adapter: axiosJsonpAdapter
})

const baidu = {
  appid: '20240102001927895',
  key: 'yXzTz3znmVPXNN_nqsoj',
  url: '//api.fanyi.baidu.com/api/trans/vip/translate',
  headers: {
    type: 'get',
    dataType: 'jsonp',
    jsonp: 'callback',           // 服务端回调参数名
    jsonpCallback: 'customName'  // 自定义回调函数名（可选）
  }
}


class Translate {
  constructor(option = {}) {
    const { appid = baidu.appid, key = baidu.key, url = baidu.url, headers = baidu.headers } = option
    this.appid = appid
    this.key = key
    this.url = url
    this.headers = headers
  }

  getParams(option) {
    const { key, appid } = this
    const { from = 'auto', to = 'en', query: q } = option
    const salt = (new Date).getTime()
    const str1 = appid + q + salt + key
    const sign = md5(str1)
    return {
      q,
      appid,
      salt,
      from,
      to,
      key,
      sign
    }
  }

  async action(option) {
    if (isString(option)) {
      option = {
        query: option
      }
    }
    const params = this.getParams(option)
    const finalParams = merge(this.headers, {
      url: this.url,
      params: params
    })
    const res = await jsonpClient(finalParams)
    return res
  }

}

export const baiduTranslate = new Translate()


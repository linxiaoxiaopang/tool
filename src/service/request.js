import axios from 'axios'
import * as Sentry from '@sentry/vue'
import { requestInterceptorsClass, responseInterceptorsClass, responseErrorInterceptorsClass } from './serviceClass'

// 创建axios实例
// const baseURL = window.baseURL = process.env.NODE_ENV === 'production' ? '/' : process.env.VUE_APP_BASE_API
const baseURL = (window.baseURL = process.env.VUE_APP_BASE_API)

const service = axios.create({
  baseURL
  // timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  async (config) => {
    return await requestInterceptorsClass.requestInterceptorsHandler(config)
  },
  (error) => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    const { code } = $GET(response, 'data', {})
    const valid = code == 0 || (code >= 200 && code < 300)
    if (!valid) Sentry.captureException({ ...response.data, traceId: response.config.headers['x-trace-id'] })
    return responseInterceptorsClass.interceptorsHandler(response)
  },
  (error) => {
    const data = $GET(error, 'response.data', {})
    Sentry.captureException(data)
    return responseErrorInterceptorsClass.errorInterceptorsHandler(data)
  }
)

export default service

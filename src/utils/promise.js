/* eslint-disable */
import { createGlobalWait } from '@/components/avue/utils/globalWait'
import { debounce } from 'lodash'

export class GetLastPromise {
  constructor({ time } = {}) {
    this.globalWait = createGlobalWait()
    this.time = time
    this.createDebounced(time)
  }
  
  wait(promise) {
    return new Promise(async (resolve, reject) => {
      this.lastPromise = promise
      await promise
      // 只有最后一次才会被返回
      if (this.lastPromise !== promise) return reject('当前请求不是最后一次')
      resolve(promise)
    })
  }
  
  
  debounce = (time = this.time) => {
    return this.wait(this.debounceWait(time))
  }
  throttle = (time = this.time) => {
    return this.wait(this.globalWait(time))
  }
  
  
  /**
  * @description:  防抖 - 返回一个Promise，只有最后一次Promise为resolve
  * @param: time: 定时时间
  * @return: Promise
  */
  debounceWait(time) {
    if (time !== undefined) {
      this.debounced.cancel()
      this.createDebounced(time)
    }
    return new Promise((resolve, reject) => {
      this.debounceResolve = resolve
      this.debounceReject?.()
      this.debounceReject = reject
      this.debounced()
    })
  }
  createDebounced(time) {
    this.debounced = debounce(
      () => {
        this.debounceResolve()
      },
      time
    )
  }
}
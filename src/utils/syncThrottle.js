/* eslint-disable */
import { now } from 'lodash'

export class SyncThrottle {
  constructor({ wait = 1000 / 12 } = {}) {
    this.createWaitTimeDebounced(wait)
  }
  waitTimeThrottle(num) {
    const curWaitTime = new Promise(async (resolve) => {
      if (this.prevWaitTime) {
        await this.prevWaitTime
      }
  
      resolve(this.waitTime(num))
    })
    return this.prevWaitTime = curWaitTime
  }
  stop() {
    this.waitTimeByNumReject?.()
  }
  waitTime(num) {
    this.waitTimeDebounced()
    // console.log(this.timer)
    if (this.timer === null) {
      this.timer = undefined
      return this.waitTimeByNum(num)
    }
  }
  waitTimeByNum(num) {
    return new Promise((resolve, reject) => {
      this.waitTimeByNumReject = reject
      setTimeout(() => {
        resolve(true)
      }, num)
    })
  }
  createWaitTimeDebounced(wait) {
    let debouncedTimer
    const waitTimeDebounced = SyncThrottle.debounceTime(
      () => {
        this.timer = null
        debouncedTimer = setTimeout(() => {
          this.timer = undefined
          waitTimeDebounced.init()
        })
      },
      wait
    )
    this.waitTimeDebounced = () => {
      clearTimeout(debouncedTimer)
      return waitTimeDebounced()
    }
  }
  static debounceTime(func, wait) {
    let lastCallTime
    function debounced () {
      const time = now()
      if (!lastCallTime) {
        lastCallTime = time
        return
      }
      if (time - lastCallTime >= wait) {
        lastCallTime = undefined
        return func()
      }
    }
    debounced.init = () => lastCallTime = undefined
    return debounced
  }
}

export default new SyncThrottle()
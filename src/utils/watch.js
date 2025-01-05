/* eslint-disable */
import { isArray, isFunction, isEqual } from 'lodash'

// this需要指向vm实例（放入methods或者bind）
export function watchFormProps(props, cb, formName = 'form') {
  const { [formName]: form } = this
  for (const prop of props) {
    const value = form[prop]
    delete form[prop] // 响应式设置失败：已被赋值，但未被设置响应式的属性，在使用$set时，无法设置为响应式，需要先删除属性再设置
    this.$set(form, prop, value)
  }
  
  const callback = wrappedFunc(cb)
  return this.$watch(
    ({ [formName]: form }) => {
      return props.reduce((prev, next) => {
        prev[next] = form[next]
        return prev
      }, {})
    },
    (n, o) => {
      if (isEqual(n, o) || !Object.values(n).every(Boolean)) return
  
      callback()
    },
    { immediate: true, deep: true }
  )
}
export function watchProps(option, cb) {
  if (isArray(option)) option = { props: option }
  if (isFunction(option)) option = { expOrFn: option }
  
  let { expOrFn } = option
  if (!expOrFn) {
    function handleOption(option) {
      const { formName = 'form', props } = option
      if (props) {
        // 为props属性设置响应式
        const { [formName]: form } = this
        for (const prop of props) {
          const value = form[prop]
          delete form[prop] // 响应式设置失败：已被赋值，但未被设置响应式的属性，在使用$set时，无法设置为响应式，需要先删除属性再设置
          this.$set(form, prop, value)
        }
        return ({ [formName]: form }) => {
          return props.reduce((prev, next) => {
            prev[next] = form[next]
            return prev
          }, {})
        }
      }
    }
    expOrFn = handleOption(option)
    if (!expOrFn) {
      const { options } = option
      if (options) {
        const expOrFns = []
        for (const option in options) {
          const fn = handleOption(option)
          fn && expOrFns.push(fn)
        }
        expOrFn = (that) => {
          return expOrFns.reduce((prev, next) => {
            return Object.assign(prev, next(that))
          }, {})
        }
      }
    }
  }
  
  if (isArray(cb) || isFunction(cb)) cb = { after: cb }
  const { before, after } = cb
  const beforeCB = wrappedFunc(before)
  const afterCB = wrappedFunc(after)
  this.$watch(
    expOrFn,
    (n, o) => {
      const isPerfect = isEqual(n, o) || !Object.values(n).every(Boolean)
      
      beforeCB(n, o, isPerfect)
      
      if (isPerfect) return
      
      afterCB()
    },
    { immediate: true, deep: true }
  )
}
export function wrappedFunc(cb) {
  if (!cb) return () => {}
  return isArray(cb) ? (...args) => cb.map(cb => cb(...args)) : cb
}

export function awaitTimeout(timeout = 10000) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export function awaitLoading(type) {
  if (this[type]) {
    return new Promise(resolve => {
      const unwatch = this.$watch(
        type,
        (loading) => {
          if (!loading) {
            unwatch()
            resolve()
          }
        },
        {
          immediate: true
        }
      )
    })
  }
}
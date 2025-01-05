/* eslint-disable */
import { isArray, isPlainObject } from 'lodash'

export default function ({ ref, methods } = {}) {
  if (isArray(methods)) {
    methods = methods.map(name => [name, name])
  } else if (isPlainObject(methods)) {
    methods = Object.entries(methods)
  }
  return {
    methods: {
      ...methods.reduce((prev, [name, alias]) => {
        prev[alias] = function (...args) {
          return this.$refs[ref][name](...args)
        }
        return prev
      }, {})
    }
  }
}
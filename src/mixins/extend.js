/* eslint-disable */
import { createComponentInstance } from '@/extend/utils'
import upperFirst from 'lodash/upperFirst'

export default function (option) {
  let { name = 'extend', component } = option
  let componentElName = upperFirst(name)
  if (option._compiled) {
    component = option
  }
  
  return {
    computed: {
      [name]() {
        if (this[componentElName]) return this[componentElName]
        
        return this[componentElName] = createComponentInstance({
          component,
          option: this[`${name}Option`]
        })
      }
    },
    beforeDestroy() {
      this[componentElName]?.$destroy()
    }
  }
}

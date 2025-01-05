/* eslint-disable */
import Vue from 'vue'
import store from '@/store'
import router from '@/router'

export function createComponentInstance(options) {
  let { component, componentName } = options
  
  if (!component && componentName) {
    return registerComponent(componentName).then((component) => {
      return createComponentInstanceSync({
        ...options,
        component
      })
    })
  }
  
  return createComponentInstanceSync(options)
}

export function createComponentInstanceSync({ component, option, $mount }) {
  let Component = Vue.extend(component)
  return new Component({ ...option, store, router }).$mount($mount)
}
export async function registerComponent(componentName) {
  let component = await import(`@/views/components/${componentName}`)
  return component.default
}
export function getParentByComponentName(componentName, instance = this) {
  var parent = instance.$parent || instance.$root
  var name = parent.$options.name
  
  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent
    
    if (parent) {
      name = parent.$options.name
    }
  }
  
  return parent
}
export function invokeParentMethods(componentName, name, ...rest) {
  return getParentByComponentName(componentName, this)?.[name](...rest)
}

export function getParentByClassName(className, instance = this) {
  var parent = instance.$el.parentNode
  var classList = parent.classList
  
  while (parent && (!classList || ![...parent.classList].includes(className))) {
    parent = parent.parentNode
    
    if (parent) {
      classList = parent.classList
    }
  }
  
  return parent
}

export function pushSlot(children, slot) {
  slot = Array.isArray(slot) ? slot : [slot]
  children.push(...slot)
}
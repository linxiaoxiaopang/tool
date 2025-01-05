/* eslint-disable */
import { Message } from 'element-ui'
import { cloneDeep, uniq } from 'lodash'
import { getObjType } from '@/components/avue/utils/util'
import { validatenull } from '@/components/avue/utils/validate'

export async function showMessage({ isMsg = true, empty }, rules, data) {
  const p = handleDataRules(rules, data)
  if (!isMsg) return p
  try {
    const res = await p
    const { rightData } = res
    !rightData.length && Message.warning(empty || '所有数据校验不通过')
  } catch (e) {
    if (e !== false) Message.warning(e)
  }
  return p
}
export function handleDataRules(rules, data) {
  if (!Array.isArray(data)) return
  rules = cloneDeep(rules)
  
  return new Promise(async (resolve, reject) => {
    let p
    let type = getObjType(rules)
    if (type === 'array') {
      const mustRules = [] // isMust规则必须全部满足，否则直接报错
      const normalRules = []
      rules.forEach((rule) => {
        (rule.isMust ? mustRules : normalRules).push(rule)
        if (typeof rule.getAsyncData === 'function') rule.getAsyncData = rule.getAsyncData(data)
      })
      
      p = data.map(async (item, index) => {
        const mustP = mustRules.map(rule => handleRule(rule, item, { data, index }))
        try {
          await Promise.all(mustP)
        } catch (err) {
          reject(err)
          throw err
        }
        
        for (const rule of normalRules) {
          try {
            await handleRule(rule, item, { data, index })
          } catch (err) {
            return err
          }
        }
        return true
      })
    } else if (type === 'object') {
      const asyncData = {}
      for (const key in rules) {
        let rule = rules[key]
        if (!rule) continue
        
        rule = Array.isArray(rule) ? rule : [rule]
        rule.filter((rule, index) => {
          if (typeof rule.getAsyncData === 'function') {
            asyncData[rule.asyncDataName || `${ key }${ index }`] = rule.getAsyncData = rule.getAsyncData(data)
          }
        })
      }
      
      p = data.map(async (item, index) => {
        let valid = await handleFormRules(rules, item, { data, index, row: item, asyncData })
        return Object.values(valid).every(msg => !isErrMsg(msg)) ? true : valid
      })
    }
    
    let valids
    try {
      valids = await Promise.all(p)
    } catch (err) {
      return
    }
    
    const rightData = []
    const failData = []
    data.forEach((item, index) => {
      (isErrMsg(valids[index]) ? failData : rightData).push(item)
    })
    function validateProp(prop, index) {
      let valid = valids[index]
      return !isErrMsg(valid) || !isErrMsg(valid[prop])
    }
    resolve({
      valids,
      rightData,
      failData,
      getErrMsg() {
        let errMsg = []
        valids.forEach((valid) => {
          if (isErrMsg(valid)) {
            for (const validKey in valid) {
              if (isErrMsg(valid[validKey])) {
                errMsg = errMsg.concat(valid[validKey])
              }
            }
          }
        })
        return uniq(errMsg).join('；')
      },
      getErrProps(index) {
        const errKeys = []
        for (const key in valids[index]) {
          if (!validateProp(key, index)) {
            errKeys.push(key)
          }
        }
        return errKeys
      },
      validateProp
    })
  })
}
export async function handleFormRules(rules, form, data) {
  let valid = {}
  for (const key in rules) {
    let rule = rules[key]
    rule = Array.isArray(rule) ? rule : [rule]
    try {
      valid[key] = await handleRules(rule, form[key], { ...data, valid })
    } catch (err) {
      valid[key] = err
    }
  }
  return valid
}
export async function handleRules(rules, value, data) {
  const mustRules = [] // isMust规则必须全部满足，否则直接报错
  const normalRules = []
  rules.forEach((rule) => {
    (rule.isMust ? mustRules : normalRules).push(rule)
  })
  
  const valid = []
  for (const rule of normalRules) {
    try {
      await handleRule(rule, value, data)
    } catch (err) {
      valid.push(err)
      break
    }
  }
  for (const rule of mustRules) {
    try {
      await handleRule(rule, value, data)
    } catch (err) {
      valid.push(err)
    }
  }
  return valid.length ? valid : true
}
export function handleRule(rule, value, data) {
  return new Promise(async (resolve, reject) => {
    const { message, validator, required } = rule
    if (!validator && !required) return resolve(true)
    
    if (required && validatenull(value)) {
      return reject(message)
    }
    if (validator) {
      validator(
        rule,
        value,
        (msg = true) => {
          if (isErrMsg(msg)) reject(message || msg)
          resolve(msg)
        },
        data
      )
    } else {
      resolve(true)
    }
  })
}
export function isErrMsg(msg = true) {
  return msg !== true
}
import Hashids from 'hashids'

const hashids = new Hashids('MySalt', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')

// 短码封装
export function encode(val) {
  return hashids.encode(val)
}

// 短码解析
export function decode(val) {
  return hashids.decode(val)[0]
}
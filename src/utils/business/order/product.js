/* eslint-disable */
import { validData } from '@/components/avue/utils/util'

//获取名称
export function getProductNam(data, lang = 'en') {
  const propList = {
    en: 'productEnName',
    cn: 'productCnName',
    default: 'productEnName'
  }
  return $defaultPlaceholder($GET(data, validData(propList[lang], propList.default), ''))
}
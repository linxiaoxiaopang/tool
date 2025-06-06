import { formatDate } from 'element-ui/src/utils/date-util'
import { analysisFileByAxios, getFillFileName, isFile } from '@/utils/utils/fileUtil'
import { getUUID } from '@/utils'
import { Message } from 'element-ui'
import { isString } from 'lodash'

const client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
  region: 'oss-cn-beijing',
  authorizationV4: true,
  // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
  accessKeyId: 'LTAI5t8jvtQrUDXJ2b3mAVR7',
  accessKeySecret: 'fqzD00TRCShXXQws0LxB0Qf4NQthCf',
  // 填写Bucket名称。
  bucket: 'lgy-tool'
})

const ossDicDic = {
  asset: '/asset'
}

export async function uploadToOss(file, option = {}) {
  const dir = $GET(option, 'dir', ossDicDic.asset)
  const useNormalName = $GET(option, 'useNormalName', false)
  try {
    if (isString(file)) {
      const fileName = getFillFileName(file)
      const blob = await analysisFileByAxios(file, { passFileReader: true })
      if (!blob) {
        throw '获取文件数据失败'
      }
      file = new File([blob], fileName, {
        type: blob.type,          // 继承 Blob 的 MIME 类型
        lastModified: Date.now()  // 当前时间作为修改日期
      })
    }
    if (!isFile(file)) {
      const fileName = file.name || `empty.${file.type.replace(/.+\/([a-zA-Z]+)/, '$1')}`
      file = new File([file], fileName, {
        type: file.type,          // 继承 Blob 的 MIME 类型
        lastModified: Date.now()  // 当前时间作为修改日期
      })
    }
    let fillFileName = dir + '/'
    if (!useNormalName) {
      fillFileName += formatDate(new Date(), 'yyyy-MM-dd-hh-mm-ss') + getUUID().replace(/-/g, '').slice(0, 4) + '_'
    }
    fillFileName += file.name
    const options = {}
    const result = await client.put(fillFileName, file, options)
    return result
  } catch (err) {
    Message.error(err.toString())
    return false
  }
}






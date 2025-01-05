//字体配置对象
import { Message } from 'element-ui'

export const DEFAULT_FONT_LIST = [
  // {
  //   fontFamily: 'Academic M54',
  //   url: '/fonts/1_1.woff'
  // }
]

DEFAULT_FONT_LIST.map(item => {
  item.label = item.value = item.fontFamily
})

export async function loadAllFont(fontList = DEFAULT_FONT_LIST) {
  const pArr = fontList.map(({ fontFamily, url }) => {
    return loadFont(fontFamily, url)
  })
  await Promise.all(pArr)
  return fontList
}


export async function loadFont(name, url) {
  const font = new FontFace(name, `url(${url})`)
  const isExist = document.fonts.check(`12px ${name}`) //检验字体是否存在
  if (isExist) return
  await font.load().catch(() => {
    Message.error(`${name}字体加载失败`)
  })
  document.fonts.add(font)
}

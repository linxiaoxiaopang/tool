/* eslint-disable */
import PDFMerger from 'pdf-merger-js'
// import jsQR from 'jsqr'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf/pdf.worker.js'
export default class Pdf {
  constructor(src) {
    this.src = src
  }
  
  async analysisQRCode() {
    await this.decode()
    return Pdf.analysisQRCode(null, this.loadedPdf)
  }
  
  async getPages() {
    await this.decode()
    return this.loadedPdf.numPages
  }
  async decode() {
    if (this.loadedPdf) return this.loadedPdf
    return this.loadedPdf = await Pdf.decode(this.src)
  }
  
  
  
  static async analysisQRCode(src, pdf) {
    pdf = pdf || await Pdf.decode(src)
    if (!pdf) return
    const res = []
    const pages = await pdf.numPages
    for (let i = 1; i <= pages; i++) {
      const page = await pdf.getPage(i)
      if (!page) continue
      //解析出pdf内容为image类型
      const viewport = page.getViewport({
        scale: 1,
        rotation: 0, // 默认会旋转180度需要设置回来rotation：0
        offsetX: 0,
        offsetY: 0,
        dontFlip: false
      })
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      const renderTask = page.render({
        canvasContext: context,
        viewport: viewport
      })
      await renderTask.promise
      const imageData = context.getImageData(0, 0, viewport.width, viewport.height)
      //使用jsQR，解析image
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      })
      res.push(code)
    }
    return res
  }
  static decode(src) {
    return pdfjsLib.getDocument(src).promise
  }
  
  static async merge(files) {
    const merger = new PDFMerger()
    
    for (const file of files) {
      await merger.add(file)
    }
    
    return merger.saveAsBlob()
    // return URL.createObjectURL(mergedPdf)
  }
}
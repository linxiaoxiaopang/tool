<template>
  <div class="xlsxContainer" :class="[`reference-type--${referenceType}`]">
    <div @click="handleUploadBtnClick">
      <slot>
        <div v-if="referenceType === 'icon'" class="xlsx-reference">
          <i class="el-icon-plus"></i>
        </div>
        <base-button v-else type="primary">上传文件</base-button>
      </slot>
    </div>
    <input :ref="uploadInputId" type="file" :accept="accept" class="c-hide" @change="handkeFileChange" />
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { getObjType, getOption } from '@/components/avue/utils/util'
import { cloneDeep, findIndex, pull } from 'lodash'

export default {
  name: 'xlsx-upload',
  props: {
    referenceType: {
      default: 'icon'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    accept: {
      type: String,
      default: '.xlsx, .xls, .xlsm'
    },
    getFirstMergeData: Boolean,
    sheetOptions: Array | Object | String
  },
  data() {
    return {
      rawFile: null,
      xlsxData: {},
      uploadInputId: new Date().getUTCMilliseconds()
    }
  },
  computed: {
    rABS() {
      return this.xlsxOptions.rABS
    },
    xlsxOptions({ options, sheetOptions }) {
      const DEFAULT_OPTION = {
        rABS: false
      }
      const xlsxOptions = Object.assign(DEFAULT_OPTION, options)
      const option = cloneDeep(xlsxOptions)

      switch (getObjType(sheetOptions)) {
        case 'object':
          xlsxOptions.sheetNames = Object.keys(sheetOptions)
          for (const name in sheetOptions) {
            xlsxOptions[name] = {
              ...option,
              ...sheetOptions[name]
            }
          }
          break
        case 'array':
          xlsxOptions.sheetNames = sheetOptions
          for (const name of sheetOptions) {
            xlsxOptions[name] = option
          }
          break
        case 'string':
          if (sheetOptions === 'all') {
            xlsxOptions.sheetNames = sheetOptions
          }
          break
      }

      return xlsxOptions
    },
    getFormatters() {
      const options = {
        default: {
          formatData: ({ xlsxArr, merges: xlsxMerges }) => {
            const { data, header, merges } = this.xlsxArrToTableArr(xlsxArr, xlsxMerges)
            return {
              header,
              data,
              merges,
              body: data.filter((item) => {
                const key = header.filter((item) => item.indexOf('EMPTY') === -1)[0]
                return item[key]
              })
            }
          }
        },
        1: {
          statusParams: {
            header: 1
          },
          formatData: ({ xlsxArr }, { fields }) => {
            // console.log(xlsxArr, xlsxMerges)
            const header = options[1].formatHeader(xlsxArr, fields)
            const body = options[1].formatBody(xlsxArr, fields, header)

            return {
              header,
              body,
              xlsxArr
            }
          },
          formatHeader(xlsxArr, fields) {
            fields = [...fields]
            const header = {}
            xlsxArr.find((row, rowIndex) => {
              for (const field of fields) {
                const index = findIndex(row, (value) => value === field)
                if (index >= 0) {
                  header[field] = index
                  header[`${field}_rowIndex`] = rowIndex
                }
              }
              Object.keys(header).forEach((field) => pull(fields, field))
              if (fields.length === 0) return true
            })
            return header
          },
          formatBody(xlsxArr, fields, header) {
            const body = []
            xlsxArr.forEach((row, rowIndex) => {
              const newRow = {}
              for (const field of fields) {
                // 防止将表头上面的行作为值（取表头下面的行作为值）
                const fieldRowIndex = header[`${field}_rowIndex`]
                if (rowIndex <= fieldRowIndex) break

                const index = header[field]
                const value = row[index]
                if (![field, undefined].includes(value)) {
                  newRow[field] = value
                }
              }
              if (Object.keys(newRow).length) {
                body.push(newRow)
              }
            })
            return body
          }
        }
      }
      return getOption.bind(null, options)
    }
  },
  methods: {
    handkeFileChange(e) {
      if (this.rawFile !== null) {
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.rawFile = e.target.files[0]
      // console.log(' this.rawFile ', this.rawFile)
      this.$nextTick(() => {
        this.$emit('getFileName', this.rawFile.name)
        this.$emit('update:fileName', this.rawFile.name.split('.')[0])
        this.$emit('update:file', this.rawFile)
      })

      this.fileConvertToWorkbook(this.rawFile)
        .then((workbook) => {
          this.$emit('on-select-file-name', workbook.SheetNames)
          // console.log(_.cloneDeep(workbook))

          try {
            const sheetNames = this.getSheetNames(workbook)
            const results = this.sheetsHandler(workbook)

            if (sheetNames <= 1) {
              this.$emit('on-select-file', results[sheetNames[0]])
            } else {
              this.$emit('on-select-file', results)
            }
          } catch {
            this.$message.warning('解析失败')
          }
        })
        .catch((err) => {
          this.$emit('on-select-file', false)
          console.error(err)
        })
        .finally(() => loading.close())
    },
    fileConvertToWorkbook(file) {
      let reader = new FileReader()
      return new Promise((resolve, reject) => {
        try {
          reader.onload = (renderEvent) => {
            const data = new Uint8Array(renderEvent.target.result)
            const workbook = XLSX.read(data, {
              type: this.rABS ? 'binary' : 'array'
            })
            resolve(workbook)
          }
          reader.onerror = (error) => {
            reject(error)
          }
          if (this.rABS) {
            reader.readAsBinaryString(file)
          } else {
            reader.readAsArrayBuffer(file)
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    getSheetNames(workbook) {
      const { xlsxOptions } = this
      return this.xlsxData.sheetNames = xlsxOptions.sheetNames === 'all'
        ? workbook.SheetNames
        : (xlsxOptions.sheetNames || [workbook.SheetNames[0]])
    },
    sheetsHandler(workbook) {
      const { xlsxOptions, xlsxData: { sheetNames } } = this

      const results = {}
      for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName]
        const options = xlsxOptions[sheetName] || xlsxOptions
        if (typeof options.formatSheet === 'function') {
          results[sheetName] = options.formatSheet(sheet, options)
        } else {
          results[sheetName] = this.formatSheet(sheet, options)
        }
      }
      // console.log(_.cloneDeep(results))
      return this.xlsxData.results = results
    },
    formatSheet(sheet, options) {
      if (!sheet) return

      this.formatNumToString(sheet)

      let xlsxArr = XLSX.utils.sheet_to_json(sheet, options.opts)

      const formatData = options.formatData || this.getFormatters(options.opts)?.formatData
      return typeof formatData === 'function' ? formatData({ xlsxArr, merges: sheet['!merges'] }, options) : xlsxArr
    },
    formatNumToString(sheet) {
      var column_arr = /([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/i.exec(sheet['!ref'])
      const rows = [Math.max(column_arr[2] - 1, 0), Math.max(column_arr[4] - 1, 0)]
      let startCol = 0
      let endCol = 0
      while (!sheet[XLSX.utils.encode_cell({ c: startCol, r: rows[0] })]) {
        ++startCol
      }
      endCol = startCol
      while (sheet[XLSX.utils.encode_cell({ c: endCol, r: rows[0] })]) {
        ++endCol
      }
      const range = {
        s: { c: +startCol, r: +rows[0] },
        e: { c: +endCol, r: +rows[1] }
      }
      for (let i = range.s.c; i <= range.e.c; i++) {
        for (let j = range.s.r; j <= range.e.r; j++) {
          let cell = sheet[XLSX.utils.encode_cell({ c: i, r: j })]
          if (!isNaN(Number(cell && cell.v)) && String(cell && cell.v).length >= 12) {
            cell.w = cell.v
          }
        }
      }
    },
    xlsxArrToTableArr(xlsxArr, merges) {
      // console.log(JSON.parse(JSON.stringify(xlsxArr)))
      // console.log(JSON.parse(JSON.stringify(merges)))
      let tableArr = []
      let tempObj = {}
      xlsxArr.forEach((item) => {
        Object.assign(tempObj, item)
      })
      let tableHeader = Object.keys(tempObj)
      let maxLength = tableHeader.length
      let rowItem = {}
      xlsxArr.forEach((item) => {
        rowItem = {}
        for (let i = 0; i < maxLength; i++) {
          if (typeof item[tableHeader[i]] === 'number' || typeof item[tableHeader[i]] === 'string') {
            rowItem[tableHeader[i]] =
              item[tableHeader[i]]
                .toString()
                .replace(/^\s+/, '')
                .replace(/\s+$/, '')
                .replace(/^['‘’]/, '') || ''
          } else {
            rowItem[tableHeader[i]] = item[tableHeader[i]] || ''
          }
        }
        tableArr.push(rowItem)
      })

      // console.log(tableHeader, JSON.parse(JSON.stringify(tableArr)))
      if (this.getFirstMergeData && Array.isArray(merges)) {
        merges.forEach(({ s, e }) => {
          if (s.r === 0) return
          const firstData = tableArr[s.r - 1]
          for (let i = s.c; i <= e.c; i++) {
            const headerKey = tableHeader[i]
            for (let j = s.r + 1; j <= e.r; j++) {
              tableArr[j - 1][headerKey] = firstData[headerKey]
            }
          }
        })
      }

      // console.log(tableHeader, JSON.parse(JSON.stringify(tableArr)))
      return {
        header: tableHeader,
        data: tableArr,
        merges
      }
    },

    handleUploadBtnClick() {
      this.clearAllData()
      this.$refs[this.uploadInputId].click()
    },
    clearAllData() {
      this.$refs[this.uploadInputId].value = null
      this.rawFile = null
      this.xlsxData = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.xlsxContainer {
  .c-hide {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: none;
  }
  &.reference-type--icon {
    display: inline-block;
    .xlsx-reference {
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      border: 1px solid;
      font-size: 20px;
    }
  }
}
</style>

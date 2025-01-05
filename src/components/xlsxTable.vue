<template>
  <div class="xlsxContainer" @drop.prevent="onDrop" @dragover.prevent @dragleave.prevent>
    <div uiid="zd-xlsxTable" @click="handleUploadBtnClick">
      <slot>
        <el-button type="primary">上传文件</el-button>
      </slot>
    </div>
    <input
      :ref="uploadInputId"
      type="file"
      :accept="accept"
      class="c-hide"
      @change="handkeFileChange"
    />
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { fileConvertToWorkbook } from '@/utils'
export default {
  name: 'vue-xlsx-table',
  data() {
    return {
      rawFile: null,
      workbook: null,
      tableData: {
        header: [],
        body: []
      },
      uploadInputId: new Date().getUTCMilliseconds()
    }
  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    accept: {
      type: String,
      default: '.xlsx, .xls'
    },
    className: {
      type: String,
      default: 'xlsx-button'
    },
    limit: {
      type: Number,
      default: Infinity
    },
    isMergeCell: Boolean
  },
  computed: {
    rABS() {
      const DEFAULT_OPTION = {
        rABS: false
      }
      const xlsxOptions = Object.assign(DEFAULT_OPTION, this.options)
      return xlsxOptions.rABS
    }
  },
  methods: {
    handkeFileChange(e) {
      if (this.rawFile !== null) {
        return
      }
      let rawFile = this.rawFile = e.target.files[0]
      if(!this.checkFile(rawFile)) return
      const loading = this.$loading({
        lock: true,
        text: '上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$nextTick(() => {
        this.$emit('input-file', rawFile)
        this.$emit('getFileName', rawFile.name)
      })

      let fileType = rawFile.name.split('.').pop()
      // console.log(rawFile, fileType)
      console.log('accept', this.accept)
      if (['csv', 'tsv'].includes(fileType)) {
        this.handleCsvFile(loading)
      } else {
        if(!this.isMergeCell) {
          this.handleXlsxFile(loading)
        } else {
          this.handleXlsxMergeCellFile(loading)
        }
      }
    },
    onDrop(e) {
      this.handkeFileChange({ target: { files: e.dataTransfer.files } })
    },

    checkFile(rawFile) {
      return this.checkAccept(rawFile) && this.checkSize(rawFile)
    },
    checkSize(rawFile) {
      if(rawFile.size <= this.limit) {
        return true
      }
      this.$message.warning(`请上传不超过${this.limit / 1024 / 1024}M文件`)
      return false
    },
    checkAccept (rawFile) {
      let fileType = rawFile.name.split('.').pop()
      if(this.accept.indexOf(fileType) >=0 ) {
        return true
      }
      this.$message.warning(`请上传${this.accept}文件`)
      return false
    },
    async handleCsvFile(loading) {
      try {
        const workbook = await fileConvertToWorkbook(this.rawFile)
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        this.formatNumToString(sheet)
        this.update_sheet_range(workbook.Sheets[workbook.SheetNames[0]])
        let xlsxArr = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        )
        this.workbook = workbook

        let tableData = this.xlsxArrToTableArr(xlsxArr)
        this.initTable(tableData)
      } catch (e) {}
      loading.close()
    },
    handleXlsxFile(loading) {
      this.fileConvertToWorkbook(this.rawFile)
        .then((workbook) => {
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          this.formatNumToString(sheet)
          this.update_sheet_range(workbook.Sheets[workbook.SheetNames[0]])
          let xlsxArr = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          )
          this.workbook = workbook
          loading.close()
          this.initTable(this.xlsxArrToTableArr(xlsxArr))
        })
        .catch((err) => {
          this.$emit('on-select-file', false)
          loading.close()
          console.error(err)
        })
    },
    handleXlsxMergeCellFile(loading) {
      this.fileConvertToWorkbook(this.rawFile)
        .then((workbook) => {
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          this.dealMergeCol(sheet)
          this.formatNumToString(sheet)
          this.update_sheet_range(sheet)
          let xlsxArr = XLSX.utils.sheet_to_json(
            sheet
          )
          this.workbook = workbook
          loading.close()
          this.initTable(this.xlsxArrToTableArr(xlsxArr))
        })
        .catch((err) => {
          this.$emit('on-select-file', false)
          loading.close()
          console.error(err)
        })
    },
    dealMergeCol(worksheet) {
      // 获取合并单元格的范围
      const merges = worksheet['!merges']
      if(!merges) return
      // 遍历合并单元格
      merges.forEach(merge => {
        const startCell = merge.s
        const endCell = merge.e

        // 获取合并单元格的起始行、列
        const startRow = startCell.r
        const startCol = startCell.c

        // 获取合并单元格的结束行、列
        const endRow = endCell.r
        const endCol = endCell.c

        // 获取合并单元格的值（通常为左上角单元格的值）
        const mergeedCell = worksheet[XLSX.utils.encode_cell(startCell)]
        if (!mergeedCell) return
        const mergedCellValue = mergeedCell.v
        console.log('mergedCellValue', mergedCellValue)

        // 将合并单元格中的值填充到每个单元格
        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
            worksheet[cellAddress] = mergeedCell
          }
        }
      })
    },
    // formatNumToString(sheet) {
    //   var column_arr = /([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/i.exec(sheet["!ref"]);
    //   const cols = [column_arr[1], column_arr[3]];
    //   const rows = [column_arr[2], column_arr[4]];
    //   if (cols.some((col) => col.length >= 2)) return;
    //   const colsCodes = cols.map((col) => col.charCodeAt(col));
    //   let start = Math.max(2, rows[0]);
    //   for (let i = start; i < rows[1]; i++) {
    //     for (let j = colsCodes[0]; j < colsCodes[1]; j++) {
    //       const key = `${String.fromCharCode(j)}${i}`;
    //       if (
    //         !isNaN(Number(sheet[key] && sheet[key].v)) &&
    //         String(sheet[key] && sheet[key].v).length >= 12
    //       ) {
    //         sheet[key].w = sheet[key].v;
    //       }
    //     }
    //   }
    // },
    formatNumToString(sheet) {
      var column_arr = /([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/i.exec(sheet['!ref'])
      const rows = [
        Math.max(column_arr[2] - 1, 0),
        Math.max(column_arr[4] - 1, 0)
      ]
      let startCol = 0
      let endCol = 0
      while (!sheet[XLSX.utils.encode_cell({ c: startCol, r: rows[0] })] && startCol < 99999) {
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
          if (
            !isNaN(Number(cell && cell.v)) &&
            String(cell && cell.v).length >= 12
          ) {
            cell.w = cell.v
          }
        }
      }
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
    xlsxArrToTableArr(xlsxArr) {
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
          if (
            typeof item[tableHeader[i]] === 'number' ||
            typeof item[tableHeader[i]] === 'string'
          ) {
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
      return {
        header: tableHeader,
        data: tableArr
      }
    },
    tableArrToXlsxArr({ data, header }) {
      let xlsxArr = []
      let tempObj = {}
      data = data || []
      data.forEach((rowItem) => {
        tempObj = {}
        rowItem.forEach((item, index) => {
          tempObj[header[index]] = item
        })
        xlsxArr.push(tempObj)
      })
      return xlsxArr
    },
    initTable({ data, header }) {
      this.tableData.header = header
      this.tableData.body = data.filter((item) => {
        const key = header.filter((item) => item.indexOf('EMPTY') === -1)[0]
        return item[key]
      })
      this.$emit('on-select-file', this.tableData)
      this.$emit('on-select-all-file', {
        header,
        body: data
      })
    },
    handleUploadBtnClick() {
      this.clearAllData()
      this.$refs[this.uploadInputId].click()
    },
    clearAllData() {
      this.$refs[this.uploadInputId].value = null
      this.tableData = {
        header: [],
        body: []
      }
      this.rawFile = null
      this.workbook = null
    },

    getSheetHeader(sheet, header) {
      let tempObj = {}
      let keys = []
      for (const key in sheet) {
        if (key.replace(/[A-Z]/, '') === '1') {
          keys.push(key)
          tempObj[key] = sheet[key].w
        }
      }
      keys.sort()
      let nHeader = keys.map(key => tempObj[key])
      let emptyLen = header.length - nHeader.length
      for (let i = 0; i < emptyLen; i++) {
        if (i === 0) {
          nHeader.push('__EMPTY')
        } else {
          nHeader.push(`__EMPTY_${i}`)
        }
      }
      return nHeader
    },
    update_sheet_range(ws) {
      var range = {s:{r:Infinity, c:Infinity},e:{r:0,c:0}};
      Object.keys(ws).filter(function(x) { return x.charAt(0) != "!"; }).map(XLSX.utils.decode_cell).forEach(function(x) {
        range.s.c = Math.min(range.s.c, x.c); range.s.r = Math.min(range.s.r, x.r);
        range.e.c = Math.max(range.e.c, x.c); range.e.r = Math.max(range.e.r, x.r);
      });
      ws['!ref'] = XLSX.utils.encode_range(range);
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
}
</style>

const CHECKBOX_INDEX = 0
const ORDER_CODE_INDEX = 1
const PRODUCT_INDEX = 2

const container = document.querySelector('.mui-container')
const btnWrapper = container.querySelector(
  '.ng-isolate-scope .pull-left.ng-scope'
)
const btn = document.createElement('button')
btn.innerText = '导出映射表格'
btn.className = 'btn btn-danger btn-sm'
btnWrapper.appendChild(btn)
window.container = container
const table = container.querySelector('table')
let trs = table.querySelectorAll('tbody tr')
trs = [...trs]
window.myTable = table

btn.addEventListener('click', () => {
  const table = container.querySelector('table')
  let trs = table.querySelectorAll('tbody tr')
  trs = [...trs]
  const filtersTds = trs.filter((item) => {
    const tds = item.querySelectorAll('td')
    const checkedTd = tds[CHECKBOX_INDEX]
    return checkedTd.querySelector('input[type="checkbox"]').checked
  })
  const results = []
  filtersTds.map((item) => {
    const tds = item.querySelectorAll('td')
    const orderCodeTd = tds[ORDER_CODE_INDEX]
    const prodctTd = tds[PRODUCT_INDEX]
    const product = getProductList(prodctTd)
    if (product.isMerged) {
      results.push(...product.data)
    } else {
      const orderCode = getOrderCode(orderCodeTd)
      results.push(
        {
          orderCode,
          ...product.data[0]
        }
      )
    }
  })
  console.log('filtersTds', filtersTds)
  console.log('results', results)
})

function getOrderCode(td) {
  return td.querySelector('dd .ng-binding').innerText
}

function getProductList(td) {
  const mergedDl = td.querySelector('.mg-merged')
  const hideMergedDl = td.querySelector('.mg-merged.ng-hide')
  const res = {
    isMerged: mergedDl && !hideMergedDl,
    data: []
  }
  if (res.isMerged) {
    let dts = mergedDl.querySelectorAll(':scope>dt')
    let dds = mergedDl.querySelectorAll(':scope>dd')
    dds = [...dds]
    dts = [...dts]
    res.data = dts.map((item, index) => {
      const dd = dds[index]
      const productData = getProductListByContainer(dd)
      return {
        orderCode: item.innerText,
        ...productData
      }
    })
  } else {
    const container = td.querySelector('.mg-prd.ng-scope')
    const itemRes = getProductListByContainer(container)
    res.data = [itemRes]
    // let items = td.querySelector('.mg-prd.ng-scope>ul').querySelectorAll(':scope>li')
    // items = [...items]
    // return items.map((item) => {
    //   const sku = item.querySelectorAll('li')[1].innerText
    //   const prodcutCount = item.querySelector('strong').innerText
    //   return {
    //     sku,
    //     prodcutCount
    //   }
    // })
  }
  return res
}

function getProductListByContainer(container) {
  let items = container.querySelector(':scope>ul').querySelectorAll(':scope>li')
  items = [...items]
  return items.map((item) => {
    const sku = item.querySelectorAll('li')[1].innerText
    const prodcutCount = item.querySelector('strong').innerText
    return {
      sku,
      prodcutCount
    }
  })
}

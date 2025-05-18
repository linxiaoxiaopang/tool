const CHECKBOX_INDEX = 0;
const ORDER_CODE_INDEX = 1;
const PRODUCT_INDEX = 2;

const container = document.querySelector(".mui-container");
const btnWrapper = container.querySelector(
  ".ng-isolate-scope .pull-left.ng-scope"
);
const btn = document.createElement("button");
btn.innerText = "导出映射表格";
btn.className = "btn btn-danger btn-sm";
btnWrapper.appendChild(btn);
window.container = container;
const table = container.querySelector("table");
let trs = table.querySelectorAll("tbody tr");
trs = [...trs];
window.myTable = table;

btn.addEventListener("click", () => {
  const table = container.querySelector("table");
  let trs = table.querySelectorAll("tbody tr");
  trs = [...trs];
  const filtersTds = trs.filter((item) => {
    const tds = item.querySelectorAll("td");
    const checkedTd = tds[CHECKBOX_INDEX];
    return checkedTd.querySelector('input[type="checkbox"]').checked;
  });
  filtersTds.map((item) => {
    const tds = item.querySelectorAll("td");
    const orderCodeTd = tds[ORDER_CODE_INDEX];
    const prodctTd = tds[PRODUCT_INDEX];
    const orderCode = getOrderCode(orderCodeTd);
    const productList = getProductList(prodctTd);
    console.log("orderCode", orderCode);
    console.log("product", productList);
    return  {
        orderCode,
        productList
    }
  });
  console.log("filtersTds", filtersTds);
});

function getOrderCode(td) {
  return td.querySelector("dd .ng-binding").innerText;
}

function getProductList(td) {
  let items = td.querySelector(".mg-prd.ng-scope>ul").querySelectorAll(":scope>li");
  items = [...items];
  return items.map((item) => {
    const sku = item.querySelectorAll('li')[1].innerText
    const prodcutCount = item.querySelector("strong").innerText;
    return {
      sku,
      prodcutCount,
    };
  });
}

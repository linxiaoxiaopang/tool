(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-85b4515c"],{"39db":function(e,t,r){"use strict";r("911c")},4667:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("XlsxTable",{attrs:{isMergeCell:!0},on:{"on-select-file":e.onSelectFile}},[e._t("xlsxBtn",(function(){return[r("el-button",[e._v("导入表格")])]}))],2)},a=[],i=r("1da1"),c=(r("96cf"),r("d9ae")),o=r("ed08"),l={components:{XlsxTable:c["a"]},data:function(){return{data:[],transformKeys:{deliveryShipping:"出货方式",countryCnName:"国家",cargoAttributes:"货物属性",expressShippingMethod:"渠道",weight:"重量",price:"价格",registrationFee:"挂号费"}}},methods:{onSelectFile:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function r(){var n,a;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:n=e.body,a=void 0===n?[]:n,t.data=Object(o["c"])(a,t.transformKeys),t.$emit("changeData",t.data);case 3:case"end":return r.stop()}}),r)})))()}}},s=l,u=r("2877"),h=Object(u["a"])(s,n,a,!1,null,"5b9e0fbd",null);t["default"]=h.exports},"911c":function(e,t,r){},d9ae:function(e,t,r){"use strict";var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"xlsxContainer",on:{drop:function(t){return t.preventDefault(),e.onDrop.apply(null,arguments)},dragover:function(e){e.preventDefault()},dragleave:function(e){e.preventDefault()}}},[r("div",{attrs:{uiid:"zd-xlsxTable"},on:{click:e.handleUploadBtnClick}},[e._t("default",(function(){return[r("el-button",{attrs:{type:"primary"}},[e._v("上传文件")])]}))],2),r("input",{ref:e.uploadInputId,staticClass:"c-hide",attrs:{type:"file",accept:e.accept},on:{change:e.handkeFileChange}})])},a=[],i=r("1da1"),c=(r("96cf"),r("a9e3"),r("b0c0"),r("ac1f"),r("1276"),r("caad"),r("d3b7"),r("159b"),r("5cc6"),r("907a"),r("9a8c"),r("a975"),r("735e"),r("c1ac"),r("d139"),r("3a7b"),r("d5d6"),r("82f8"),r("e91f"),r("60bd"),r("5f96"),r("3280"),r("3fcc"),r("ca91"),r("25a1"),r("cd26"),r("3c5d"),r("2954"),r("649e"),r("219c"),r("170b"),r("b39a"),r("72f7"),r("b64b"),r("25f0"),r("5319"),r("4de4"),r("4e82"),r("d81d"),r("25ca")),o=r("ed08"),l={name:"vue-xlsx-table",data:function(){return{rawFile:null,workbook:null,tableData:{header:[],body:[]},uploadInputId:(new Date).getUTCMilliseconds()}},props:{options:{type:Object,default:function(){return{}}},accept:{type:String,default:".xlsx, .xls"},className:{type:String,default:"xlsx-button"},limit:{type:Number,default:1/0},isMergeCell:Boolean,keepOrigin:Boolean},computed:{rABS:function(){var e={rABS:!1},t=Object.assign(e,this.options);return t.rABS}},methods:{handkeFileChange:function(e){var t=this;if(null===this.rawFile){var r=this.rawFile=e.target.files[0];if(this.checkFile(r)){var n=this.$loading({lock:!0,text:"上传中...",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"});this.$nextTick((function(){t.$emit("input-file",r),t.$emit("getFileName",r.name)}));var a=r.name.split(".").pop();["csv","tsv"].includes(a)?this.handleCsvFile(n):this.isMergeCell?this.handleXlsxMergeCellFile(n):this.handleXlsxFile(n)}}},onDrop:function(e){this.handkeFileChange({target:{files:e.dataTransfer.files}})},checkFile:function(e){return this.checkAccept(e)&&this.checkSize(e)},checkSize:function(e){return e.size<=this.limit||(this.$message.warning("请上传不超过".concat(this.limit/1024/1024,"M文件")),!1)},checkAccept:function(e){var t=e.name.split(".").pop();return this.accept.indexOf(t)>=0||(this.$message.warning("请上传".concat(this.accept,"文件")),!1)},handleCsvFile:function(e){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function r(){var n,a,i,l;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,Object(o["l"])(t.rawFile);case 3:n=r.sent,a=n.Sheets[n.SheetNames[0]],t.formatNumToString(a),t.update_sheet_range(n.Sheets[n.SheetNames[0]]),i=c["b"].sheet_to_json(n.Sheets[n.SheetNames[0]]),t.workbook=n,l=t.xlsxArrToTableArr(i),t.initTable(l),r.next=15;break;case 13:r.prev=13,r.t0=r["catch"](0);case 15:e.close();case 16:case"end":return r.stop()}}),r,null,[[0,13]])})))()},handleXlsxFile:function(e){var t=this;this.fileConvertToWorkbook(this.rawFile).then((function(r){var n=r.Sheets[r.SheetNames[0]];t.formatNumToString(n),t.update_sheet_range(r.Sheets[r.SheetNames[0]]);var a=c["b"].sheet_to_json(r.Sheets[r.SheetNames[0]]);t.workbook=r,e.close(),t.initTable(t.xlsxArrToTableArr(a))})).catch((function(r){t.$emit("on-select-file",!1),e.close()}))},handleXlsxMergeCellFile:function(e){var t=this;this.fileConvertToWorkbook(this.rawFile).then((function(r){var n=r.Sheets[r.SheetNames[0]];t.dealMergeCol(n),t.formatNumToString(n),t.update_sheet_range(n);var a=c["b"].sheet_to_json(n);t.workbook=r,e.close(),t.initTable(t.xlsxArrToTableArr(a))})).catch((function(r){t.$emit("on-select-file",!1),e.close()}))},dealMergeCol:function(e){var t=e["!merges"];t&&t.forEach((function(t){var r=t.s,n=t.e,a=r.r,i=r.c,o=n.r,l=n.c,s=e[c["b"].encode_cell(r)];if(s){s.v;for(var u=a;u<=o;u++)for(var h=i;h<=l;h++){var f=c["b"].encode_cell({r:u,c:h});e[f]=s}}}))},formatNumToString:function(e){var t=/([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/i.exec(e["!ref"]),r=[Math.max(t[2]-1,0),Math.max(t[4]-1,0)],n=0,a=0;while(!e[c["b"].encode_cell({c:n,r:r[0]})]&&n<99999)++n;a=n;while(e[c["b"].encode_cell({c:a,r:r[0]})])++a;for(var i={s:{c:+n,r:+r[0]},e:{c:+a,r:+r[1]}},o=i.s.c;o<=i.e.c;o++)for(var l=i.s.r;l<=i.e.r;l++){var s=e[c["b"].encode_cell({c:o,r:l})];!isNaN(Number(s&&s.v))&&String(s&&s.v).length>=12&&(s.w=s.v)}},fileConvertToWorkbook:function(e){var t=this,r=new FileReader;return new Promise((function(n,a){try{r.onload=function(e){var r=new Uint8Array(e.target.result),a=c["a"](r,{type:t.rABS?"binary":"array"});n(a)},r.onerror=function(e){a(e)},t.rABS?r.readAsBinaryString(e):r.readAsArrayBuffer(e)}catch(i){a(i)}}))},xlsxArrToTableArr:function(e){var t=this,r=[],n={};e.forEach((function(e){Object.assign(n,e)}));var a=Object.keys(n),i=a.length,c={};return e.forEach((function(e){c={};for(var n=0;n<i;n++)"number"===typeof e[a[n]]||"string"===typeof e[a[n]]?t.keepOrigin?c[a[n]]=e[a[n]].toString():c[a[n]]=e[a[n]].toString().replace(/^\s+/,"").replace(/\s+$/,"").replace(/^['‘’]/,"")||"":c[a[n]]=e[a[n]]||"";r.push(c)})),{header:a,data:r}},tableArrToXlsxArr:function(e){var t=e.data,r=e.header,n=[],a={};return t=t||[],t.forEach((function(e){a={},e.forEach((function(e,t){a[r[t]]=e})),n.push(a)})),n},initTable:function(e){var t=e.data,r=e.header;this.tableData.header=r,this.tableData.body=t.filter((function(e){var t=r.filter((function(e){return-1===e.indexOf("EMPTY")}))[0];return e[t]})),this.$emit("on-select-file",this.tableData),this.$emit("on-select-all-file",{header:r,body:t})},handleUploadBtnClick:function(){this.clearAllData(),this.$refs[this.uploadInputId].click()},clearAllData:function(){this.$refs[this.uploadInputId].value=null,this.tableData={header:[],body:[]},this.rawFile=null,this.workbook=null},getSheetHeader:function(e,t){var r={},n=[];for(var a in e)"1"===a.replace(/[A-Z]/,"")&&(n.push(a),r[a]=e[a].w);n.sort();for(var i=n.map((function(e){return r[e]})),c=t.length-i.length,o=0;o<c;o++)0===o?i.push("__EMPTY"):i.push("__EMPTY_".concat(o));return i},update_sheet_range:function(e){var t={s:{r:1/0,c:1/0},e:{r:0,c:0}};Object.keys(e).filter((function(e){return"!"!=e.charAt(0)})).map(c["b"].decode_cell).forEach((function(e){t.s.c=Math.min(t.s.c,e.c),t.s.r=Math.min(t.s.r,e.r),t.e.c=Math.max(t.e.c,e.c),t.e.r=Math.max(t.e.r,e.r)})),e["!ref"]=c["b"].encode_range(t)}}},s=l,u=(r("39db"),r("2877")),h=Object(u["a"])(s,n,a,!1,null,"6b2ddd72",null);t["a"]=h.exports}}]);
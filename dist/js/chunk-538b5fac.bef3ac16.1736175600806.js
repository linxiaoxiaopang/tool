(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-538b5fac"],{"0ee3":function(t,e,n){"use strict";n("4b99")},"4b99":function(t,e,n){},"844b":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"flex-middle"},[n("div",[n("span",[t._v(t._s(t.label))]),t.show?t._e():n("span",[t._v(t._s(t.text))])]),n("el-input",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],ref:"inputText",attrs:{size:"small"},on:{blur:function(e){return t.blur(t.text)}},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:e.target.blur()}},model:{value:t.text,callback:function(e){t.text=e},expression:"text"}}),t.show?t._e():n("baseButton",{staticClass:"ml10",attrs:{type:"text"},on:{click:t.editText}},["icon"==t.iconType?n("svg-icon",{staticClass:"connect-icon",attrs:{"icon-class":"edit"}}):n("span",[t._v(" 编辑 ")])],1)],1)},s=[],u={props:{field:{type:String,default:""},label:{type:String,default:"用户邮箱："},value:{type:String,default:""},iconType:{type:String,default:"icon"}},data:function(){return{text:"",show:!1}},computed:{},mounted:function(){this.text=this.value},watch:{value:function(t){this.text=this.value}},methods:{blur:function(t){this.$emit("inputBlur",t,this.field),this.show=!1},editText:function(){var t=this;this.show=!0,this.$nextTick((function(){t.$refs.inputText.focus()}))}}},a=u,o=(n("0ee3"),n("2877")),c=Object(o["a"])(a,i,s,!1,null,"a342bc6e",null);e["default"]=c.exports}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-21b4e707"],{"5f42":function(t,e,i){"use strict";i("6909b")},"6909b":function(t,e,i){},"71e4":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"am_payPwd",attrs:{id:"ids_"+t.id}},t._l(t.length,(function(e,s){return"checkbox"===t.iptType?i("input",{directives:[{name:"pwd-off",rawName:"v-pwd-off",value:"own",expression:"'own'"},{name:"model",rawName:"v-model",value:t.pwdList[s],expression:"pwdList[i]"}],key:s,ref:s,refInFor:!0,staticClass:"shortInput",attrs:{uiid:"zd-pwd-"+s,maxlength:"1",type:"checkbox"},domProps:{checked:Array.isArray(t.pwdList[s])?t._i(t.pwdList[s],null)>-1:t.pwdList[s]},on:{input:t.changeInput,click:t.changePwd,focus:t.changePwd,keyup:function(e){return t.keyUp(e)},keydown:function(e){t.oldPwdList=t.pwdList.length},change:function(e){var i=t.pwdList[s],n=e.target,d=!!n.checked;if(Array.isArray(i)){var p=null,o=t._i(i,p);n.checked?o<0&&t.$set(t.pwdList,s,i.concat([p])):o>-1&&t.$set(t.pwdList,s,i.slice(0,o).concat(i.slice(o+1)))}else t.$set(t.pwdList,s,d)}}}):"radio"===t.iptType?i("input",{directives:[{name:"pwd-off",rawName:"v-pwd-off",value:"own",expression:"'own'"},{name:"model",rawName:"v-model",value:t.pwdList[s],expression:"pwdList[i]"}],key:s,ref:s,staticClass:"shortInput",attrs:{uiid:"zd-pwd-"+s,maxlength:"1",type:"radio"},domProps:{checked:t._q(t.pwdList[s],null)},on:{input:t.changeInput,click:t.changePwd,focus:t.changePwd,keyup:function(e){return t.keyUp(e)},keydown:function(e){t.oldPwdList=t.pwdList.length},change:function(e){return t.$set(t.pwdList,s,null)}}}):i("input",{directives:[{name:"pwd-off",rawName:"v-pwd-off",value:"own",expression:"'own'"},{name:"model",rawName:"v-model",value:t.pwdList[s],expression:"pwdList[i]"}],key:s,ref:s,staticClass:"shortInput",attrs:{uiid:"zd-pwd-"+s,maxlength:"1",type:t.iptType},domProps:{value:t.pwdList[s]},on:{input:[function(e){e.target.composing||t.$set(t.pwdList,s,e.target.value)},t.changeInput],click:t.changePwd,focus:t.changePwd,keyup:function(e){return t.keyUp(e)},keydown:function(e){t.oldPwdList=t.pwdList.length}}})})),0)},n=[],d=(i("a9e3"),i("ac1f"),i("00b4"),i("a15b"),{data:function(){return{pwdList:[],oldPwdList:[],isDelete:!1,iptType:"password"}},props:{id:{type:String,default:"1"},dialogVisible:{type:Boolean},length:{type:Number,default:6}},watch:{dialogVisible:function(){!1===this.dialogVisible&&(this.pwdList=[])}},mounted:function(){this.$refs[0].focus()},beforeDestroy:function(){this.iptType="text"},methods:{keyUp:function(t){var e=this.pwdList.length;e&&(8===t.keyCode?(this.isDelete=!0,this.oldPwdList===this.pwdList.length?(e===this.pwdList.length&&this.pwdList.pop(),e--):e>0&&e--,this.$refs[e].focus()):this.isDelete&&e===this.pwdList.length&&/^\d$/.test(t.key)&&(this.isDelete=!1,this.pwdList.pop(),this.pwdList.push(t.key),this.$refs[this.pwdList.length]&&this.$refs[this.pwdList.length].focus()),this.$emit("getPwd",this.pwdList.join("")),this.$emit("input",this.pwdList.join("")))},changePwd:function(){var t=this.pwdList.length;t===this.length&&t--,this.$refs[t].focus()},changeInput:function(){var t=this.pwdList.length,e=this.pwdList[t-1];/[0-9]/.test(e)?e?t<this.length&&this.$refs[t].focus():(this.pwdList.pop(),t--,t>0&&this.$refs[t-1].focus()):this.pwdList.pop()},validate:function(){return this.pwdList.length===this.length}}}),p=d,o=(i("5f42"),i("2877")),a=Object(o["a"])(p,s,n,!1,null,"1e631e78",null);e["default"]=a.exports}}]);
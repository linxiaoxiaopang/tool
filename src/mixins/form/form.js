/* eslint-disable no-undef */
import Vue from 'vue'
import { componentMethodsMixin } from '@/mixins'
import propsMixin from '@/mixins/dialog/props'
import loadingMixin from './loading'
import { deepClone, getDiffData, keyClone, keyAssign, validateDiffData } from '@/components/avue/utils/util'
import { correctExecute, firstToUpperCase } from '@/utils/functional'
import { validatenull } from '@/components/avue/utils/validate'
import { mapActions } from 'vuex'

export default {
  mixins: [
    componentMethodsMixin('form'),
    propsMixin({
      type: 'edit'
    }),
    loadingMixin()
  ],
  props: {
    value: {
      default: () => ({})
    }
  },
  data() {
    return {
      form: {},
      oForm: {}
    }
  },
  computed: {
    option({ curType }) {
      let option = this[`${curType}Option`]
      return option || {}
    },
    formOption({ option }) {
      this.$store.dispatch('HandleOption', option.option)
      return Vue.observable(option.option)
    },
    flatColumn({ formOption }) {
      let { group, column } = formOption || {}
      column = column || []
      if (Array.isArray(group)) {
        group.forEach(item => {
          column = column.concat(item.column || [])
        })
      }
      return column
    },
    formKeys({ flatColumn }) {
      let tempArr = []
      flatColumn.forEach(item => {
        tempArr.push(item.prop)
      })
      return tempArr
    },
    nForm({ form, oForm, formKeys }) {
      let nForm = getDiffData(form, oForm)
      for (const nFormKey in nForm) {
        if (validatenull(nForm[nFormKey])) delete nForm[nFormKey]
      }
      
      if (validatenull(nForm)) {
        nForm = undefined
      } else {
        nForm.id = oForm.id
      }
      
      if (formKeys.length) {
        nForm = nForm || { id: oForm.id }
        formKeys.forEach(formKey => nForm[formKey] = form[formKey])
      }
      
      return nForm
    }
  },
  watch: {
    option: {
      handler(n) {
        this.onsubmitCreate(n)
      }
    }
  },
  created() {
    if (!this.onsubmit) {
      this.onsubmitCreate(this.option)
    }
  },
  methods: {
    ...mapActions(['HandleOption']),
    runFn,
    keyAssign,
    keyClone,
    deepClone,
    getPackList,
    correctExecute,
    getDiffData,
    validateDiffData,
    validatenull,
    onsubmitCreate(option, isReset = true) {
      let {
        validate = this.validate,
        doFn = this.doFn,
        success = this.success
      } = option || {}
      let onsubmit = async () => {
        this.loading = true
        let res = await correctExecute(validate, doFn, success)
        this.loading = false
        return res
      }
      isReset && (this.onsubmit = onsubmit)
      return onsubmit
    },
    async validate() {
      return this.$refs.form ? this.$refs.form.validate() : true
    },
    doFn() {
      let { curType = 'edit' } = this
      let fn = this[`do${firstToUpperCase(curType)}`]
      return typeof fn === 'function' && fn()
    },
    async doEdit() {},
    async doAdd() {},
    success(isInit = true) {
      this.successFn(isInit)
    },
    successFn(isInit = true) {
      this.$message.success('操作成功')
      if (isInit) {
        let init = this.sup_this?.init
        if (typeof init === 'function') init()
      }
      this.$emit('success')
    },
  
    /**
    * @description: 将init分解成多个步骤函数，便于后续扩展init
    */
    initValidate() { return true },
    beforeInit() {},
    async init(...args) {
      let {
        init,
        beforeInit = this.beforeInit,
        initFn = this.initFn,
        afterInit = this.afterInit
      } = this.option
      
      this.loading = true
      if (typeof init === 'function') {
        await init(...args)
      } else {
        this.beforeInitRes = await beforeInit(...args)
        this.initFnRes = await initFn(...args)
        await afterInit(...args)
      }
      this.loading = false
    },
    initFn() {},
    afterInit() {},
  
    destroy(...args) {
      let {
        destroy,
        dialogClose
      } = this.option
      this.runFn(destroy, ...args)
      this.runFn(dialogClose, ...args)
      
      return this.initForm()
    },
    initForm() {
      this.form = {}
      this.oForm = {}
      this.formMethods('resetFields')
    },
    
    handleOption(option) {
      this.HandleOption(option)
      return option
    },
    observable(option) {
      return Vue.observable(option)
    },
    setFormCopy(value = this.value, keys) {
      this.form = keys ? keyClone(value, keys) : deepClone(value)
      this.oForm = value
    }
  }
}

function getPackList(list) {
  if (validatenull(list)) return []
  return Array.isArray(list) ? list : [list]
}

function runFn(fn, ...args) {
  return typeof fn === 'function' && fn(...args)
}
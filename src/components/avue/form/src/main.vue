<template>
  <div
    class="avue-form form-container pull-auto"
    :class="{ 'is-group': option.group, 'is-validate': hasRules, 'label-width-auto': option.labelWidth === 'auto' }"
  >
    <el-form
      ref="form"
      :model="form"
      :size="option.size || DEFAULT_FORM_SIZE"
      :label-width="setPx(option.labelWidth, 80)"
      :label-suffix="labelSuffix"
      :label-position="option.labelPosition"
      :style="{ width: setPx(option.width) }"
      :rules="formRules"
      :validate-on-rule-change="validData(option.validateOnRuleChange, false)"
      :hide-required-asterisk="option.hideRequiredAsterisk"
      @submit.native.prevent
    >
      <el-row class="no-empty" :span="24">
        <el-col
          v-for="(item, index) in columnOption"
          :key="index"
          :span="validData(option.columnSpan, 24)"
          class="avue-group"
          :class="`${item.customClass || ''}${item.prop ? ` avue-group__${item.prop}` : ''}`"
          :id="item.prop && `group-${item.prop}`"
        >
          <div class="avue-group__item">
            <div class="avue-group__header" v-if="item.label">
              <slot :name="`${item.prop}Header`" v-bind="item">
                <div class="avue-group__title">{{ item.label }}</div>
              </slot>
            </div>
            <div class="avue-group__header" v-else-if="$slots.header">
              <slot name="header"></slot>
            </div>
            <el-row class="avue-form__group clearfix" :type="option.layoutType" :gutter="validData(item.gutter, option.gutter, 20)">
              <template v-for="(column, index) in getDisplayColumn(item.column)">
                <formItem
                  :key="column.prop"
                  :form="form"
                  :column="column"
                  :group="item"
                  :option="option"
                  :DIC="DIC"
                  :errorMsg="errorMsg"
                  :disabled="disabled"
                  :readonly="readonly"
                  @search-change="searchChange"
                >
                  <template v-for="(key) in getFormItemSlots(column)" v-slot:[key]="scope">
                    <slot :name="key" v-bind="scope"></slot>
                  </template>
                </formItem>
              </template>
            </el-row>
          </div>
        </el-col>

        <el-col v-if="menuBtn" :span="validData(option.menuSpan, 24)" class="form-menu-wrapper">
          <el-form-item :label-width="setPx(validData(option.menuLabelWidth, option.labelWidth, 80))">
            <div class="form-menu" :class="menuPosition">
              <el-button uiid="zd-cancel" plain :size="DEFAULT_FORM_SIZE" @click="resetForm" v-if="validData(option.emptyBtn, true)">{{
                  option.emptyText ? option.emptyText : '取消'
                }}</el-button>
              <el-button
                v-if="validData(menuSubmitBtn, option.submitBtn, true)"
                uiid="zd-submit"
                type="primary"
                :size="DEFAULT_FORM_SIZE"
                :loading="loading"
                @click="submit"
              >{{ option.submitText ? option.submitText : '提交' }}</el-button>
              <slot name="menuForm"></slot>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  DEFAULT_FORM_SIZE
} from '../../utils/const/config'
import crud from '../../mixins/crud'
import { validatenull } from '../../utils/validate.js'
import { validData } from '@/components/avue/utils/util'
import { getDic } from '@/components/avue/core/dic'
import formItem from './formItem'

export default {
  name: 'AvueForm',
  mixins: [crud()],
  components: { formItem },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    disabled: Boolean,
    readonly: Boolean,
    menuSubmitBtn: {
      type: Boolean,
      default: undefined
    },
    option: {
      type: Object,
      required: true,
      default: () => ({})
    },
    dic: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      DEFAULT_FORM_SIZE,
      formCreate: false,
      form: {},
      formRules: {},
      DIC: {},

      loading: false,

      errorMsg: {},
      cloneOption: {}
    }
  },
  computed: {
    parentOption({ cloneOption: option }) {
      let group = option.group || []
      option.column && group.push({
        ...option,
        group: undefined
      })
      return {
        ...option,
        group
      }
    },
    columnOption({ parentOption: { group } }) {
      return group
    },
    propOption() {
      let tempArr = []
      this.columnOption.forEach(item => {
        tempArr = tempArr.concat(item.column)
      })
      return tempArr
    },
    objectOption() {
      let tempObj = {}
      this.propOption.forEach(column => {
        tempObj[column.prop] = column
      })
      return tempObj
    },
    controlOption() {
      return this.propOption.filter(column => column.control)
    },
    cascaderOption() {
      return this.propOption.filter(column => column.cascader)
    },

    hasRules() {
      return !!Object.keys(this.formRules).length
    },

    labelSuffix({ parentOption: { labelSuffix } }) {
      if (typeof labelSuffix === 'boolean') return labelSuffix ? '：' : ''
      return validData(labelSuffix, '：')
    },

    menuBtn() {
      return (
        this.validData(this.option.menuBtn, true) &&
        (this.validData(this.option.submitBtn, true) ||
          this.validData(this.option.emptyBtn, true) ||
          this.$slots.menuForm)
      )
    },
    menuPosition: function () {
      if (this.option.submitPostion) {
        return 'is-' + this.option.submitPostion
      } else {
        return 'is-center'
      }
    }
  },
  watch: {
    option: {
      handler(n, o) {
        this.formCreate = false
        // this.$nextTick 导致 formVal 在 value 赋值之后执行
        this.formVal()
        // this.rulesInit()
        this.cloneOption = this.deepClone(n)
      },
      deep: true
    },
    value: {
      handler(n, o) {
        // console.log(this.option.column[0].prop, JSON.parse(JSON.stringify(this.value)));
        if (this.formCreate) this.formVal()
      },
      deep: true
    },
    columnOption: {
      handler(n, o) {
        this.formRules = {}
        n.forEach((ele, index) => {
          // ele.column = (ele.column || []).filter(column => !column.hide)
          // 循环列的全部属性
          if (!validatenull(ele.column)) {
            //规则初始化
            this.rulesInit(ele.column)
            //初始化form表单
            this.formInit(ele)
          }
        })
        //初始化dic字典
        this.dicInit()
        //初始化值
        // this.formVal();
      },
      immediate: true,
      deep: true
    },
    form: {
      handler() {
        const { DIC } = this
        this.controlOption.forEach(ele => {
          let control = ele.control(
            this.form[ele.prop],
            this.form,
            { ...ele, dicData: this.setDic(ele, DIC) },
            DIC
          ) || {}
          Object.keys(control).forEach(item => {
            this.assignReactive(this.objectOption[item], control[item])
            if (control[item].dicData) {
              DIC[item] = control[item].dicData
            }
          })
        })
      },
      immediate: true,
      deep: true
    },
    cascaderOption: {
      handler(n, o) {
        if (this.cascaderWatch) {
          o.forEach((ele) => this.cascaderWatch[ele.prop]())
        } else {
          this.cascaderWatch = {}
          this.formList = []
        }

        const { objectOption } = this
        n?.forEach((column) => {
          this.cascaderWatch[column.prop] = this.$watch(
            `form.${column.prop}`,
            function () {
              this.$nextTick(() => {
                const cascader = column.cascader;
                const str = cascader.join(",");
                cascader.forEach(item => {
                  const columnNextProp = item;
                  const value = this.form[column.prop];
                  // 下一个节点
                  const columnNext = objectOption[columnNextProp]
                  if (validatenull(columnNext)) return
                  // 如果不是首次加载则清空全部关联节点的属性值和字典值
                  if (this.formList.includes(str)) {
                    //清空子类字典列表和值
                    cascader.forEach(ele => {
                      this.form[ele] = "";
                      this.$set(this.DIC, ele, []);
                    });
                  }
                  /**
                   * 1.判断当前节点是否有下级节点
                   * 2.判断当前节点是否有值
                   */
                  if (
                    validatenull(cascader) ||
                    validatenull(value) ||
                    validatenull(columnNext)
                  ) {
                    return;
                  }
                  // 根据当前节点值获取下一个节点的字典
                  getDic({
                    cascaderColumn: column,
                    column: columnNext,
                    value: value,
                    form: this.form,
                    DIC: this.DIC
                  }).then(res => {
                    //首次加载的放入队列记录
                    if (!this.formList.includes(str)) this.formList.push(str);
                    // 修改字典
                    const dic = res || [];
                    this.$set(this.DIC, columnNextProp, dic);
                    if (!validatenull(dic) && !validatenull(columnNext.cascaderIndex) && validatenull(this.form[columnNextProp])) {
                      this.form[columnNextProp] = dic[columnNext.cascaderIndex][(columnNext.props || {}).value || 'value']
                    }
                  });
                })
              })
            },
            { immediate: true }
          )
        })
      },
      immediate: true,
      deep: true
    },
    dic: {
      handler(dic) {
        Object.keys(dic).forEach((key) => {
          this.$set(this.DIC, key, dic[key])
        })
      },
      immediate: true
    }
  },
  created() {
    this.$nextTick(function () {
      //规则初始化
      // this.rulesInit()
      //初始化dic字典
      // this.dicInit()
      //初始化form表单
      // this.formInit()
      //初始化值
      this.formVal()
      this.cloneOption = this.deepClone(this.option)
    })
  },
  mounted() {},
  methods: {
    validData,
    rulesInit(column) {
      this.errorMsg = {}
      column.forEach((ele) => {
        // this.getDicData(ele)
        // this.setCascaderItem('form', ele)

        if (ele.rules && !ele.customValidate) {
          let rules = Array.isArray(ele.rules) ? ele.rules : [ele.rules]
          this.formRules[ele.prop] = rules.map((rule) => {
            if (rule.required === true) {
              return {
                message: `${ele.label || '该项'}必填`,
                ...rule
              }
            } else if (rule.validatorForm) {
              const that = this
              rule.validator = function () {
                arguments[3] = that.form || arguments[3]
                rule.validatorForm(...arguments, that)
              }
            }
            return rule
          })
        }
      })
    },
    dicInit() {
      this.GetDic(this.option.dic).then((data) => {
        Object.keys(data).forEach((key) => {
          this.$set(this.DIC, key, data[key])
        })
      })
    },
    formInit(group) {
      let { option, form } = this
      let disabled = this.validData(group.disabled, option.disabled)
      let readonly = this.validData(group.readonly, option.readonly)
      const list = group.column
      let nForm = {}
      list.forEach((ele) => {
        if (['checkbox', 'cascader', 'daterange', 'array'].includes(ele.type)) {
          nForm[ele.prop] = []
        } else if (ele.type === 'number') {
          nForm[ele.prop] = undefined
        } else {
          nForm[ele.prop] = ''
        }
        // console.log(ele)
        ele.disabled = this.validData(ele.disabled, disabled)
        ele.readonly = this.validData(ele.readonly, readonly)
        if (!validatenull(ele.value) || Array.isArray(ele.value)) nForm[ele.prop] = ele.value
      })
      for (const key in nForm) {
        let value = form[key]
        this.$set(form, key, [undefined].includes(value) ? nForm[key] : form[key])
      }
    },
    formVal() {
      if (this.formCreate) {
        this.form = this.value
        this.$emit('input', this.form)
      } else {
        this.formCreate = true
        Object.keys(this.form).forEach((ele) => {
          this.value[ele] === undefined && this.$set(this.value, ele, this.form[ele])
        })
        this.form = this.value
        // Object.assign(this.form, this.value);
        this.$emit('input', this.form)
      }
      // console.log(this.option.column[0].prop, JSON.parse(JSON.stringify(this.form)), JSON.parse(JSON.stringify(this.value)));
    },
    searchChange(prop, args) {
      this.$emit('form-change', prop, ...args)
      this.$emit('search-change', ...args)
      if (this.option.isSearch) {
        this.submit()
      }
    },
    submit() {
      this.option.submitLoading && (this.loading = true)
      this.$refs['form'].validate((valid, errObj) => {
        if (valid) {
          this.$emit('submit', this.form, () => this.loading = false)
        } else {
          this.loading = false
          this.$emit('err', errObj)
        }
      })
    },
    resetForm() {
      this.resetFields()
      this.$emit('reset-change', this.form, () => {})
    },
    resetFields() {
      this.$refs.form.resetFields()
      this.$emit('input', this.form)
    },
    async validate(callback) {
      let { errorMsg } = this
      if (Object.values(errorMsg).some(Boolean)) return false

      return this.$refs.form.validate(callback)
    },
    validateField(field, callback) {
      let { errorMsg } = this
      field = Array.isArray(field) ? field : [field]
      let errors = {}
      field.forEach(prop => errors[prop] = errorMsg[prop])
      if (Object.values(errors).some(Boolean)) {
        if (typeof callback === 'function') {
          field.forEach(prop => callback(errors[prop] || ''))
        }
        return false
      }

      return this.$refs.form.validateField(field, callback)
    },
    clearValidate(list) {
      this.$nextTick(() => {
        this.errorMsg = {}
        this.$refs.form.clearValidate(list)
      })
    },
    detail(form, column) {
      let { formatter, prop, placeholder } = column
      let value = form[prop]
      if (validatenull(value)) return placeholder
      if (typeof formatter === 'function') return formatter(value, form, column)
      return value
    },

    assignReactive(target, source) {
      if (!target || !source) return
      for (const key in source) {
        this.$set(target, key, source[key])
      }
    },

    getDisplayColumn(column) {
      return (column || []).filter(col => !col.hide)
    },
    getFormItemSlots(column) {
      const { $scopedSlots } = this
      let slots = [
        column.slotName,
        column.prop
      ]
      if (column.appendSlot) {
        slots = slots.concat([
          `${column.prop}Append`,
          'columnAppend'
        ])
      }
      return slots.filter(name => $scopedSlots[name])
    }
  }
}
</script>

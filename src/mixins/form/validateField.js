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
  methods: {
    validateField(param, callback) {
      if (typeof param === 'string') return this.$refs.form.validateField(param, callback)
      
      const formItem = this.getComponentByName('ElFormItem', param)
      formItem.onFieldChange()
    },
    getComponentByName(componentName, child = this) {
      var parent = child.$parent || child.$root
      var name = parent.$options.componentName
  
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
    
        if (parent) {
          name = parent.$options.componentName
        }
      }
      
      return parent
    }
  },
  provide() {
    return {
      validateField: this.validateField
    }
  }
}
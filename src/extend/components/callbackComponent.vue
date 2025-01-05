<template>
  <div ref="component" v-if="dangerouslyUseHTMLString" v-html="component"></div>
  <component
    v-else
    ref="component"
    :is="component"
    :option="option"
    v-bind="$attrs"
    v-on="$listeners"
    v-model="model"
  >
    <template v-for="col in slotColumns" v-slot:[col.prop]="scope">
      <slot :name="col.prop" v-bind="scope" :$column="col">
        <callbackComponent
          v-if="col.slots"
          v-for="(childSlot, index) in col.slots"
          :key="index"
          v-bind="{
            ...$attrs,
            ...scope,
            ...childSlot,
            ...childSlot.componentAttrs
          }"
          v-on="$listeners"
        ></callbackComponent>
      </slot>
    </template>

    <template v-for="name in otherSlots" v-slot:[name]="scope">
      <slot :name="name" v-bind="scope"></slot>
    </template>
  </component>
</template>

<script>
import customTable from '@/views/components/base/customTable'
import defaultImg from '@/views/components/base/defaultImg'

export default {
  inheritAttrs: false,
  name: 'CallbackComponent',
  components: {
    customTable,
    defaultImg
  },
  props: {
    component: String|Object,
    value: {
      default: () => ({})
    },
    valueKey: String,
    slots: {
      type: Array,
      default: () => []
    },
    option: {
      type: Object,
      default: () => {
        return {
          slots: [],
          column: []
        }
      }
    },
    dangerouslyUseHTMLString: Boolean
  },
  data() {
    return {
      text: ''
    }
  },
  computed: {
    model: {
      get({ text, valueKey }) {
        return valueKey ? text[valueKey] : text
      },
      set(val) {
        let { text, valueKey } = this
        if (valueKey) {
          text[valueKey] = val
        } else {
          text = val
        }
        this.$emit('input', text)
      }
    },

    slotColumns({ slots, option }) {
      let tempArr = (slots || []).concat(option.slots || [])
      option?.column?.forEach(col => {
        if (col.slot || col.formslot) {
          tempArr.push(col)
        }
      })
      return tempArr.map(slot => {
        let tempObj = slot?.slots ? slot : {
          prop: slot,
          slots: [
            {
              component: slot
            }
          ]
        }
        tempObj.slots = tempObj.slots.map(cSlot => {
          return cSlot?.component ? cSlot : {
            component: cSlot
          }
        })
        return tempObj
      })
    },
    slotColumnsProps({ slotColumns }) {
      return slotColumns.map(({ prop }) => prop)
    },
    otherSlots({ $scopedSlots, slotColumnsProps }) {
      let slots = Object.keys($scopedSlots)
      return slots.filter(slot => !slotColumnsProps.includes(slot))
    }
  },
  watch: {
    value: {
      handler(n) {
        this.text = n
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    validate() {
      let validate = this.$refs.component.validate
      return validate ? validate() : true
    },
    isNativeDom() {
      return !this.$refs.component.$el
    }
  }
}
</script>
<template>
  <baseForm
    class="base-form-container"
    :option="option"
    v-model="form"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-for="item in option.column" #[`${item.prop}`]="{form: row}">
      <div v-if="item.slot === 'form'">
        <avue-crud-input class="mb15" v-model="form[item.prop].arrayCount"
                         v-if="item.databaseType === 'array'"></avue-crud-input>
        <deepForm
          :form="form[item.prop]"
          :option="item"
          v-bind="$attrs"
          v-on="$listeners"/>
      </div>

      <div v-else-if="item.slot === 'notObjectArray'">
        <avue-crud-input class="mb15" v-model="form[item.prop].mValue"></avue-crud-input>
      </div>
      <component
        v-else
        v-model="form[item.prop].mValue"
        :dic="item.dicData"
        :is="contentComponent(item)"
        v-bind="item"
      />
    </template>
  </baseForm>
</template>

<script>
import { getComponent } from '@/components/avue/utils/util';
import { upperFirst } from 'lodash'

export default {
  name: 'deepForm',
  props: {
    form: {
      type: Object,
      required: true
    },
    option: {
      type: Object,
      required: true
    }
  },

  computed: {
    contentComponent() {
      return (column) => {
        return this.getComponent(column.type)
      }
    }
  },

  methods: {
    getComponent(type) {
      return upperFirst(getComponent(type)).replace(/^(avue)?/i, 'avue')
    }
  }
}
</script>

<style scoped lang="scss">
.base-form-container {
  padding: 15px;
  border: 1px solid $color-border;
  border-radius: 4px;
}


</style>

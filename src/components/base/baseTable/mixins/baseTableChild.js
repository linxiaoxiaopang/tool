/* eslint-disable */
import baseTableMixin from '@/components/base/baseTable/mixins/baseTable'
import child from '@/components/base/baseTable/mixins/child'

export default function ({ name, fns } = {}) {
  return {
    mixins: [
      baseTableMixin,
      child({
        name,
        fns: ['getSelectionData', 'init', 'emptyInit', 'searchChange'].concat(fns)
      })
    ],
    computed: {
      list() {
        return this.getParentProp('list')
      },
      option() {
        return this.getParentProp('option')
      },
      permission() {
        return this.getParentProp('permission', this.curTabItem.childPermission)
      },
      getListApi() {
        return this.getParentProp('getListApi', null)
      }
    },
    methods: {
      getAttrs(name) {
        return this.curTabItem[name] || this.attrs[name]
      }
    }
  }
}
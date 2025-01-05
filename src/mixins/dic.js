import { getLabel } from '@/components/avue/utils/util'

export default {
  methods: {
    getLabel(scoped, dicType, prop) {
      prop = prop || scoped.prop
      let detailProp = `$${prop}`
      return scoped[detailProp] = getLabel(dicType, scoped[prop])
    },
    detail(scoped, dicType, prop) {
      prop = prop || scoped.prop
      let detailProp = `$${prop}`
      if (scoped[detailProp]) return scoped[detailProp]
      return scoped[detailProp] = getLabel(dicType, scoped[prop])
    }
  }
}

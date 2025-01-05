<script>
import { get } from 'lodash'
import { parsePrice } from '@/utils'
import { getLabel } from '@/components/avue/utils/util'

const formatters = {
  price(value) {
    return parsePrice(value)
  },
  dic(value, { dicType }) {
    return getLabel(dicType, value)
  }
}
export default {
  functional: true,
  render(h, { props: { row, dic } }) {
    return (dic || []).map((item) => {
      let value = item.formatter?.(row) || get(row, item.prop)
      if (item.valueFormat) {
        const formatter = formatters[item.valueFormat]
        value = formatter ? formatter(value, item) : value
      }
      value = value || item.placeholder
      if (!item.label && !value) return
      return (
        <div class="info-item">
          { item.label && <span class={ ['info-item__label', item.labelClass] }>{ item.label }：</span> }
          { value && <span class="info-item__content">{ value }</span> }
        </div>
      )
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
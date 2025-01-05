<script>
import { getResult } from '@/utils/functional'

export default {
  functional: true,
  render(h, { props, data, parent }) {
    parent = props.sup_this || parent
    return props.componentList
      ?.filter((component) => getResult.call(parent, component.show || true, data))
      .map((component) => {
        const privateData = { ...data, attrs: {}, props }
        for (const key in component) {
          if (['component', 'show', 'children'].includes(key)) continue

          const privateVal = getResult.call(parent, component[key], data)
          privateData[key] = {
            ...privateData[key],
            ...privateVal
          }
        }
        return h(
          component.component,
          privateData,
          component.children
        )
      })
  }
}
</script>
<!--
<script>
import { getResult } from '@/utils/functional'

export default {
  props: {
    componentList: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    parent() {
      return this.sup_this || this.$parent
    }
  },
  render(h) {
    const { componentList, parent } = this
    return componentList?.map((component) => {
      const show = getResult.call(parent, component.show)
      if (!show) return

      const props = getResult.call(parent, component.props)
      console.log({
        ...this.$attrs,
        ...props
      })
      return h(component.component, {
        props: {
          ...this.$attrs,
          ...props
        }
      })
    }).filter(Boolean)
  }
}
</script>-->

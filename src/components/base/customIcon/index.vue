<script>
import { getCustomIconAttrs } from './utils'

export default {
  functional: true,
  render(h, { props, data }) {
    let option = getCustomIconAttrs(props.option || props)
    if (option.iconClass) {
      return (
        <svg-icon
          iconClass={ option.iconClass }
          class-name={ `${option.iconClass} ${data.staticClass || ''} custom-icon` }
          { ...data }
        ></svg-icon>
      )
    } else {
      return <i { ...{ ...data, ...option } }></i>
    }
  }
}
</script>
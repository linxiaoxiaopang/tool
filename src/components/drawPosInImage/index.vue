<script>
import { setPx } from '@/components/avue/utils/util'

export default {
  functional: true,

  props: {
    width: {
      type: [Number, String],
      default: 'auto'
    },

    height: {
      type: [Number, String],
      default: 'auto'
    },

    disabled: Boolean,

    renderPos: Object
  },

  render(h, context) {
    const { props, scopedSlots, listeners } = context
    const { width, height } = props
    const containerStyle = {
      width: setPx(width),
      height: setPx(height)
    }
    return h('div', {
      class: ['pos-relative', 'inline-block'],
      style: containerStyle,
      directives: [
        {
          name: 'draw',
          arg: 'callback',
          modifiers: {
            disabled: !!props.disabled
          },
          value(drawInstance) {
            console.log('drawInstance', drawInstance)
            listeners.getDrawInstance && listeners.getDrawInstance(drawInstance)
            if (!drawInstance || !props.renderPos) return
            //开启宏任务 并且要在dom渲染玩之后重新触发 所以设置40s延迟
            drawInstance.waitUpdateDrawBoxPos(props.renderPos)
          }
        }
      ]
    }, scopedSlots.default && scopedSlots.default())
  }
}

</script>

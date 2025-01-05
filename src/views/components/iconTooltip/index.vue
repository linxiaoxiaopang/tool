<script>
import { isNumber } from 'lodash'

function getContentVNode(h, context) {
  const createContentVNode = getSplitScopedSlotsContentVNode.after(getSplitWordContentVNode).after(normalContentVNode)
  return createContentVNode(h, context)
}

/**
 * 获取\n分行的vnode
 * @param h
 * @param props
 * @returns {boolean|*[]}
 */
function getSplitWordContentVNode(h, { props }) {
  const needSplitWord = (props.content || '').indexOf('\n') >= 0
  if (props.content && needSplitWord) {
    const list = props.content.split('\n')
    const childList = list.map(text => {
      return h('div', text)
    })
    return [h('div', childList)]
  }
  return false
}

/**
 * 获取插槽的vnode
 * @param h
 * @param scopedSlots
 * @returns {boolean|*}
 */
function getSplitScopedSlotsContentVNode(h, { scopedSlots }) {
  if (scopedSlots.content) return scopedSlots.content()
  return false
}

/**
 * 普通创建
 * @param h
 * @param scopedSlots
 * @returns {*[]}
 */
function normalContentVNode(h, { props }) {
  const content = props.content || ''
  return [h('div', content)]
}

const DEFAULT_ATTRS = {
  effect: 'dark',
  placement: 'top-start',
  content: '提示'
}

export default {
  functional: true,

  props: {
    customClass: String,

    content: String,

    iconClassName: {
      type: String,
      default: 'icon-a-bianzu6'
    },

    size: {
      type: [String, Number],
      default: 'mini'
    },

    //default | grey | danger | warning | success | primary
    type: {
      type: String,
      default: 'default'
    }
  },

  render(h, context) {
    const { props, data, scopedSlots } = context
    let styleAttr = isNumber(props.size) ? { fontSize: `${props.size}px` } : {}
    const renderDom1 = scopedSlots.default ? scopedSlots.default() : h('i', {
      class: ['iconfont', 'icon', props.iconClassName, props.customClass, `icon--${props.size}`, `icon--${props.type}`],
      style: styleAttr
    }, '')
    let contentDom = getContentVNode(h, context)
    const renderDom2 = h('template', {
      slot: 'content'
    }, contentDom)
    const attrs = Object.assign({}, DEFAULT_ATTRS, data.attrs)
    return h('el-tooltip', {
      ...data,
      attrs
    }, [renderDom1, renderDom2])
  }
}
</script>

<style lang="scss" scoped>
.icon--default {
}

.icon--grey {
  color: $color-sub;
}

.icon--danger {
  color: $color-danger;
}

.icon--warning {
  color: $color-warning;
}

.icon--primary {
  color: $color-primary;
}

.icon--success {
  color: $color-success;
}

.icon--mini {
  font-size: $text-mini;
}

.icon--small {
  font-size: $text-small;
}

.icon--medium {
  font-size: $text-medium;
}

.icon {
  cursor: pointer;
}
</style>

<script>
import Breadcrumb from '@/components/Breadcrumb'

export default {
  functional: true,
  render(h, { data, scopedSlots, parent, props }) {
    let that = parent
    while (that && that.$options.name !== 'App') {
      that = that.$parent
    }
    const { breadcrumbOption, showTitle, title } = that.layoutOptions || {}
    const template = (
      <section
        class={ ['app-container', data.staticClass, data.class] }
        style={ [data.staticStyle, data.style] }
        >
        { breadcrumbOption && h(Breadcrumb, { props: { breadcrumbOption } }) }
        { showTitle && <div class="app-title">{ title || that.$route.meta?.title }</div> }
        { scopedSlots.default && scopedSlots.default() }
      </section>
    )

    if (props.onlyContent) {
      const contentTemplate = <div class="app-only-content"></div>
      contentTemplate.children = template.children
      template.children = [contentTemplate]
    }

    return template
  }
}
</script>

<style lang="scss">
.app-title {
  margin-bottom: 14px;
  font-size: 16px;
}
.app-only-content {
  width: $app-min-width;
  margin: auto;
}
</style>

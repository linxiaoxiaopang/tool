<script>
import { validData } from '@/components/avue/utils/util'
import { eventInvoker } from '@/utils/functional'

export default {
  functional: true,
  render(h, { props: { value, dic, row, expandProp = '$expanded', isExtension = true }, scopedSlots, parent, listeners, data }) {
    dic = dic || []
    const len = dic.length
    const expanded = validData(value, row?.[expandProp])
    const showList = (!isExtension || expanded) ? dic : dic.slice(0, 1)

    function oninput() {
      if (row) {
        parent.$set(row, expandProp, !expanded)
      }
      eventInvoker(listeners.input, !expanded)
    }

    isExtension = isExtension && len > 1
    return (
      <div class={ ['table-cell-expand', { 'is-expand': isExtension }, data.staticClass, data.class] }>
        {
          showList.map((item) => (
            <div class="table-cell-expand__item">
              { scopedSlots.default && scopedSlots.default(item) }
            </div>
          ))
        }
        {
          isExtension &&
            <div class="table-cell-expand__btn" onclick={ oninput }>
              {expanded ?  '收起以上' : '展开剩余'}{ len - 1 }项产品信息
            </div>
        }
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
$fontSize: 14px;
$marginTop: 12px;
$paddingTop: 8px;
$top: #{ $marginTop + $paddingTop };
$wrapperBottom: 8px;
.table-cell-expand.is-expand {
  padding-bottom: #{ $fontSize + $marginTop + $paddingTop };
}
.table-cell-expand__item + .table-cell-expand__item,
.table-cell-expand__btn {
  margin-top: $top;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    margin-top: -$paddingTop;
    background-color: $color-background--extensive;
  }
}
.table-cell-expand__btn {
  position: absolute;
  bottom: $wrapperBottom;
  left: 0;
  right: 0;
  line-height: 1;
  text-align: center;
  color: $color-sub;
  cursor: pointer;
}
</style>
<script>
import dialog from '@/components/base/appDialog'
import baseTable from '@/components/base/baseTable/index'

export default {
  extends: dialog,
  computed: {
    componentName() {
      return baseTable
    },
    dialogAttrs() {
      return {

      }
    },
    btnAttrs() {
      return {

      }
    },
    bodyAttrs() {
      return {
        class: 'extend-dialog-table',
        sup_this: this.sup_this || this.$parent
      }
    }
  },
  watch: {
    showDialog: {
      handler(n) {
        n || (this.sup_this.baseTable = null)
      },
      immediate: true
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
</style>

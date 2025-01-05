<script>
import { Tooltip } from 'element-ui'
import Vue from 'vue'
import router from '@/router'
import store from '@/store'


export default {
  extends: Tooltip,

  beforeCreate() {
    this.popperVM = new Vue({
      router,
      store,
      data: { node: '' },
      render(h) {
        return this.node;
      }
    }).$mount()
  }
}

</script>


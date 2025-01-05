/* eslint-disable */
import { mapState } from 'vuex'

export default function (name) {
  return {
    computed: {
      ...mapState({
        [name]: state => state.bus.BUS[name]
      })
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (vm.validateRouteQuery(vm, to, from)) {
          vm.$router.back()
        }
      })
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('SET_BUS', { [name]: null })
      next()
    },
    methods: {
      validateRouteQuery(vm) {
        return !vm.hasRouteQuery()
      },
      hasRouteQuery(vm) {
        return !!vm.$store.state.bus.BUS[name]
      }
    }
  }
}

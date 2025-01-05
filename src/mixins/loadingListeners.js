export default function (eventName = 'click') {
  return {
    data() {
      return {
        loading: {}
      }
    },
    watch: {
      $listeners: {
        handler(n) {
          // console.log(n)
          if (!n[eventName]) return
          const func = n[eventName].fns
          n[eventName].fns = async () => {
            if (this.loading[eventName]) return
            this.$set(this.loading, eventName, true)
            try {
              await func()
            } catch (err) {
              console.log(err)
            }
            this.loading[eventName] = false
          }
        },
        immediate: true,
        deep: true
      }
    }
  }
}

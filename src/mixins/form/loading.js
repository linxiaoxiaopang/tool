import upperFirst from 'lodash/upperFirst'
export default function (loadingName = 'loading') {
  const Loading = upperFirst(loadingName)
  const LoadingName = `cur${Loading}`
  const isLoadingName = `is${Loading}`
  return {
    data() {
      return {
        [loadingName]: false,
        [isLoadingName]: true
      }
    },
    watch: {
      [loadingName](n) {
        if (this[isLoadingName]) {
          if (n) {
            this.$nextTick(function () {
              this[LoadingName]?.close()
              this[LoadingName] = this.$loading({
                lock: true,
                text: '请稍候'
              })
              let close = () => this[LoadingName].close()
              this.$off('hook:destroyed', close)
              this.$once('hook:destroyed', close)
            })
          } else {
            this[LoadingName].close()
          }
        }
      }
    }
  }
}

import { upperFirst } from 'lodash'

export default function ({ name = 'type', propOption, setProps = true } = {}) {
  const Name = upperFirst(name)
  const curName = `cur${Name}`
  const historyName = `${name}History`
  const initFnName = `${name}Init`
  const historyPushFnName = `${name}HistoryPush`
  const historyBackFnName = `${name}HistoryBack`
  
  const props = setProps ? { [name]: propOption || String } : undefined
  return {
    props,
    data() {
      return {
        [curName]: '',
        [historyName]: []
      }
    },
    watch: {
      [name]: {
        handler() {
          this[initFnName]()
        },
        immediate: true
      },
      [curName]: {
        handler(n) {
          this[historyPushFnName](n)
        },
        immediate: true
      }
    },
    methods: {
      [initFnName]() {
        this[historyName] = [this[name]]
        this[curName] = this[name]
      },
      [historyPushFnName](value) {
        const { [historyName]: history } = this
        
        const last = history[history.length - 1]
        last !== value && history.push(value)
      },
      [historyBackFnName](delta = -1) {
        if (this.isPointerEvent(delta)) delta = -1
        const { [historyName]: history } = this
        
        if (history.length < 2) return
        history.splice(delta)
        this[curName] = history[history.length - 1]
      },
      
      isPointerEvent(data) {
        try {
          return data.target instanceof HTMLElement
        } catch (e) {}
      }
    }
  }
}

import { parseCharacterTime } from '@/utils'
const TIME_PROPS_OBJ = {
  create_time: {
    start: 'createStartTime',
    end: 'createEndTime'
  },
  createTime: {
    start: 'startCreateTime',
    end: 'endCreateTime'
  },
  put_on_time: {
    start: 'startOnTime',
    end: 'endOnTime'
  },
  off_time: {
    start: '',
    end: ''
  },
  importTime: {
    start: 'importStartTime',
    end: 'importEndTime'
  },
  orderTime: {
    start: 'orderStartTime',
    end: 'orderEndTime'
  },
  time: {
    start: '',
    end: ''
  },
  supplier_create_time: {
    start: 'createStartTime',
    end: 'createEndTime'
  },
  myAssets: {
    start: 'applyStartTime',
    end: 'applyEndTime'
  },
  approveTime: {
    start: 'approveStartTime',
    end: 'approveEndTime'
  },
  applyTime: {
    start: 'applyStartTime',
    end: 'applyEndTime'
  },
  paymentTime:{
    start: 'paymentStartTime',
    end: 'paymentEndTime'
  },
  tradeTime: {
    start: 'tradeStartTime',
    end: 'tradeEndTime'
  },
  default: {
    start: 'startCreateTime',
    end: 'endCreateTime'
  }
}
const TIME_PROPS = Object.keys(TIME_PROPS_OBJ)

export default {
  props: {
    query: {
      type: Object,
      default: () => ({})
    },
    sup_this: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    timeProp() {
      try {
        const timeData = this.formField.filter(({ prop }) => TIME_PROPS.includes(prop))
        return timeData[0].prop
      } catch (err) {
        return ''
      }
    },
    timeProps({ timeProp }) {
      return TIME_PROPS_OBJ[timeProp] || TIME_PROPS_OBJ.default
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    toQuery() {
      if (this.timeProp) {
        const time = this.time
        let { start, end } = this.timeProps
        if (time && time.length) {
          this.query[start] = parseCharacterTime(new Date(`${time[0]} 00:00:00`).toString().replace(' GMT', ''))
          this.query[end] = parseCharacterTime(new Date(`${time[1]} 23:59:59`).toString().replace(' GMT', ''))
        } else {
          delete this.query[start]
          delete this.query[end]
        }
      }
      // console.log(JSON.stringify(this.query))
      this.sup_this.page = 1
      this.sup_this.init()
      this.$emit('searchChange', this.query)
    }
  }
}

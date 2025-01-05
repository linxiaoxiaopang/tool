import moment from 'moment'

export function getTimeDiff(time, referTime, format = 'DD天HH小时mm分钟') {
  time = moment(time)
  // 现在的时间
  referTime = moment(referTime)
  let timeDiff = referTime.diff(time)
  if (!format) return timeDiff

  // 计算时间差
  timeDiff = Math.abs(timeDiff)
  var duration = moment.duration(timeDiff)
  const formatTime = momentDurationFormat(duration, format)
  return formatTime
}

export function momentDurationFormat(duration, format, isClear = true) {
  let formatKeys = [
    { key: 'DD', dFn: 'asDays', fn: 'days' },
    { key: 'HH', dFn: 'asHours', fn: 'hours' },
    { key: 'mm', dFn: 'asMinutes', fn: 'minutes' },
    { key: 'ss', dFn: 'asSeconds', fn: 'seconds' }
  ].filter((item) => new RegExp('^[^DD]*DD[^DD]*$'.replace(/DD/g, item.key)).test(format))

  let formatTime = formatKeys.reduce((prev, next, index) => {
    const val = index === 0 ? Math.floor(duration[next.dFn]()) : duration[next.fn]()
    return prev.replace(next.key, val)
  }, format)

  if (!isClear) return formatTime

  // 匹配时间和单位，例如 "0天"、"0小时"、"32分钟"、"4秒" 等
  var pattern = /\d+[^\d]*/g
  // 将匹配到的时间和单位进行处理
  return formatTime.replace(pattern, function(match) {
    if (match[0] === '0') {
      return ''
    } else {
      return match
    }
  })
}

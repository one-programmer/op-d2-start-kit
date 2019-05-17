
import dayjs from 'dayjs'
export default {
  'time_hm_filter': function (value) {
    if (typeof value === 'number') {
      return dayjs(value * 1000).format('YYYY-MM-DD HH:mm')
    } else {
      return dayjs(value).format('YYYY-MM-DD HH:mm')
    }
  },
  'time_hms_filter': function (value) {
    if (typeof value === 'number') {
      return dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')
    } else {
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  'toDecimal2': function (value) {
    var f = parseFloat(value)
    if (isNaN(f) || f === 0) {
      return 0
    }
    var fn = Math.round(value * 100) / 10000
    var s = fn.toString()
    var rs = s.indexOf('.')
    if (rs < 0) {
      rs = s.length
      s += '.'
    }
    while (s.length <= rs + 2) {
      s += '0'
    }
    return s
  },
  'game_status_filter': function (value) {
    let status = ''
    switch (value) {
      case 1:
        status = '正在进行中'
        break
      case 2:
        status = '已结束'
        break
    }
    return status
  },
}

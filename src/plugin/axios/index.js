import axios from 'axios'
import router from '../../router'
import { Message, MessageBox } from 'element-ui'

axios.interceptors.response.use(res => {
  let data = res.data
  if (data.errno && data.errno !== 'OK') {
    Message.error(data.message)
    return Promise.reject(res)
  }
  return data
}, err => {
  if (err && err.response) {
    if (err.response.status === 403) {
      MessageBox.alert('您暂时没有访问权限，请重新登录', '', {
        confirmButtonText: '确定',
        showClose: false,
        callback: action => {
          router.push('/login')
        }
      })
    }
  }
  return Promise.reject(err)
})

export default {
  install (Vue, options) {
    Vue.prototype.$axios = axios
  }
}

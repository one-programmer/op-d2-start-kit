import axios from 'axios'
import router from '../../router'
import { Message, MessageBox } from 'element-ui'
import db from '../db'

axios.interceptors.request.use(async (config) => {
  const Authorization = db.get('token').value()
  if (Authorization) {
    config.headers.Authorization = `Bearer ${Authorization}`
  }
  return config
}, function (error) {
  console.error(error)
  return Promise.reject(error)
})

axios.interceptors.response.use(res => {
  let data = res.data
  if (data.errno && data.errno !== 'OK') {
    Message.error(data.description)
    return Promise.reject(res)
  }
  return data.results
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

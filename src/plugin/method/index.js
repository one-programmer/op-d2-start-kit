import moment from 'moment'
import { Message } from 'element-ui'
function install (Vue) {
  Vue.prototype.$op = {
    /**
     * @description: 图片大小及分辨率的校验
     * @param file: 上传的图片对象
     * @param option: {size: 最大大小限制, width: 最大宽度限制, height: 最大高度限制}
     * @return: Promise对象(resolved -> 通过校验 rejected -> 未通过校验)
     */
    'checkImg': (file, option) => {
      let isLtKB = true
      let isSize = true
      if (option.size) {
        isLtKB = new Promise(function (resolve, reject) {
          let valid = file.size / 1024 < option.size
          valid ? resolve() : reject(new Error())
        }).then(() => {
          return file
        }, () => {
          Message.error(`上传图片大小不能超过 ${option.size} k!`)
          return Promise.reject(new Error('图片大小不符'))
        })
      }
      if (option.width && option.height) {
        isSize = new Promise(function (resolve, reject) {
          let width = option.width
          let height = option.height
          let _URL = window.URL || window.webkitURL
          let img = new Image()
          img.onload = function () {
            let valid = img.width <= width && img.height <= height
            valid ? resolve() : reject(new Error())
          }
          img.src = _URL.createObjectURL(file)
        }).then(() => {
          return file
        }, () => {
          Message.error(`上传的图片必须是等于或小于${option.width}*${option.height}!`)
          return Promise.reject(new Error('图片分辨率不符'))
        })
      }
      return isLtKB && isSize
    },
    /**
     * @description: 设置列表页 table 高度，实现滚动效果
     * @private ele: 当前页面 Vue 实例
     * @return: table 高度
     */
    'setTableHeight': (ele) => {
      let totalHeight = ele.$refs.container.$el.clientHeight
      let searchHeight = (ele.$refs.searchBox && ele.$refs.searchBox.$el.clientHeight) || 0
      let paginationHeight = (ele.$refs.pagination && ele.$refs.pagination.$el.clientHeight) || 0
      let otherHeight = 20 * 5 + 2 // padding + border
      return totalHeight - searchHeight - paginationHeight - otherHeight
    },
    /**
     * @description: 格式化搜索功能的传参(删除无效字段值, 时间格式化)
     * @param: 需要格式化的数据对象
     * @return: 服务端可正常接收的参数对象
     */
    'changeSearch': (search) => {
      for (const key in search) {
        if (search[key] === '' || search[key] === null) {
          delete search[key]
        }
        if (search[key] instanceof Date) {
          search[key] = moment(search[key]).format('YYYY-MM-DD HH:mm:ss')
        }
      }
      return search
    },
    /**
     * @description: 关闭当前页面
     * @param vm: 当前页面 Vue 实例
     * @return: 无
     */
    'closeCurrentPage': (vm) => {
      let routeName = vm.$route.name
      vm.$store.commit('d2admin/page/close', {
        tagName: routeName,
        vm: vm
      })
    }
  }
}
export default install

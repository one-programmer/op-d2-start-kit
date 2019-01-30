import Mock from 'mockjs'
import _ from 'lodash'

const todoDB = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|90-100': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'id|+1': 1,
    'title': '@cparagraph(1)',
    'description': '@cparagraph(1)',
    created_at: '@DATE @TIME'
  }]
}).list

Mock.mock(/^\/api\/todos/, 'post', ({url, type, body}) => {
  const bodyObj = JSON.parse(body)
  bodyObj.id = _.last(todoDB).id + 1
  todoDB.push(bodyObj)
  return {
    code: 0,
    msg: 'ok',
    data: bodyObj
  }
})

const detailReg = /\/api\/todos\/(\d+)+/

const getDetail = (url, detailReg, todoDB) => {
  const id = Number(detailReg.exec(url)[1])
  return todoDB.find(item => item.id === id)
}

Mock.mock(detailReg, 'get', ({url, type, body}) => {
  const item = getDetail(url, detailReg, todoDB)
  return {
    code: 0,
    msg: 'ok',
    data: item
  }
})

Mock.mock(detailReg, 'put', ({url, type, body}) => {
  const item = getDetail(url, detailReg, todoDB)
  return {
    code: 0,
    msg: 'ok',
    data: item
  }
})

Mock.mock(detailReg, 'delete', ({url, type, body}) => {
  const index = Number(detailReg.exec(url)[1]) - 1
  todoDB.splice(index, 1)
  return {
    code: 0,
    msg: 'ok',
    data: {}
  }
})

const pageReg = /^\/api\/todos?(.[\s\S]*)/
Mock.mock(pageReg, 'get', ({url, type, body}) => {
  const params = new URLSearchParams(pageReg.exec(url)[1])
  const page = Number(params.get('page') || 0)
  const pageSize = Number(params.get('page_size') || 20)
  console.log('分页', url, page, pageSize)
  return {
    count: todoDB.length,
    has_next: true,
    page: page,
    page_size: pageSize,
    results: todoDB.slice((page - 1) * pageSize, page * pageSize)
  }
})

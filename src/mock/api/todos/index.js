import Mock from 'mockjs'

const todoDB = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|90-100': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'id|+1': 1,
    'price': '@integer(1, 10000)',
    'title': '@cparagraph(1)',
    'description': '@cparagraph(1)',
    created_at: '@DATE @TIME'
  }]
}).list

Mock.mock(/^\/api\/todos/, 'post', ({url, type, body}) => {
  const bodyObj = JSON.parse(body)
  todoDB.push(body)
  return {
    code: 0,
    msg: 'ok',
    data: bodyObj
  }
})

Mock.mock(/\/api\/todos\/[0-9]+/, 'get', ({url, type, body}) => {
  return {
    code: 0,
    msg: 'ok',
    data: todoDB[0]
  }
})

Mock.mock(/\/api\/todos\/[0-9]+/, 'put', ({url, type, body}) => {
  return {
    code: 0,
    msg: 'ok',
    data: todoDB[0]
  }
})

Mock.mock(/\/api\/todos\/[0-9]+/, 'delete', ({url, type, body}) => {
  return {
    code: 0,
    msg: 'ok',
    data: {}
  }
})

Mock.mock(/^\/api\/todos?.[\s\S]*/, 'get', ({url, type, body}) => {
  console.log('分页', url)
  return {
    code: 0,
    msg: 'ok',
    data: {
      results: todoDB.filter((item, index) => index < 20),
      total: todoDB.length,
      page: 1,
      size: 20
    }
  }
})

import Mock from 'mockjs'

const userDB = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    uuid: 'admin-uuid',
    name: '管理员'
  },
  {
    id: 2,
    username: 'editor',
    password: 'editor',
    uuid: 'editor-uuid',
    name: '编辑'
  },
  {
    id: 3,
    username: 'user1',
    password: 'user1',
    uuid: 'user1-uuid',
    name: '用户1'
  }
]

Mock.mock(/^\/api\/admin\/login/, 'post', ({url, type, body}) => {
  const bodyObj = JSON.parse(body)
  const user = userDB.find(e => e.username === bodyObj.username && e.password === bodyObj.password)
  if (user) {
    return {
      errorno: 'OK',
      results: {
        ...user,
        token: 'd787syv8dys8cas80d9s0a0d8f79ads56f7s4d56f879a8as89fd980s7dg'
      }
    }
  } else {
    return {
      code: 401,
      msg: '用户名或密码错误'
    }
  }
})

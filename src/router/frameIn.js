// layout
import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

export default [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      {
        path: 'index',
        name: 'index',
        meta,
        component: () => import('@/pages/index')
      },
      {
        path: '/banner',
        name: 'banner-list',
        component: () => import('@/pages/banner/list'),
        meta: { meta, title: 'banner管理 列表' }
      },
      {
        path: '/banner/:id/edit',
        name: 'banner-edit',
        component: () => import('@/pages/banner/edit'),
        meta: { meta, title: 'banner管理 编辑' }
      },
      {
        path: '/banner-add',
        name: 'banner-add',
        component: () => import('@/pages/banner/add'),
        meta: { meta, title: 'banner管理 新增' }
      },
      {
        path: '/matchManage',
        name: 'matchManage-list',
        component: () => import('@/pages/matchManage/list'),
        meta: { meta, title: '赛事管理 列表' }
      },
      {
        path: '/matchManage/:id/edit',
        name: 'matchManage-edit',
        component: () => import('@/pages/matchManage/edit'),
        meta: { meta, title: '赛事管理 编辑' }
      },
      {
        path: '/matchManage-add',
        name: 'matchManage-add',
        component: () => import('@/pages/matchManage/add'),
        meta: { meta, title: '赛事管理 新增' }
      },
    ]
  },
  {
    path: '/game_details',
    name: 'game_details',
    meta,
    component: () => import('@/pages/game_details')
  }
]

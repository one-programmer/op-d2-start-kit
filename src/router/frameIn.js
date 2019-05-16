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
        meta: { meta, title: 'banner管理' }
      },
      {
        path: '/banner/:id/edit',
        name: 'banner-edit',
        component: () => import('@/pages/banner/edit'),
        meta: { meta, title: '编辑banner' }
      },
      {
        path: '/banner-add',
        name: 'banner-add',
        component: () => import('@/pages/banner/add'),
        meta: { meta, title: '新增banner' }
      },
      {
        path: '/matchManage',
        name: 'matchManage-list',
        component: () => import('@/pages/matchManage/list'),
        meta: { meta, title: '赛事管理' }
      },
      {
        path: '/matchManage/:id/edit',
        name: 'matchManage-edit',
        component: () => import('@/pages/matchManage/edit'),
        meta: { meta, title: '配置直播' }
      },
      {
        path: '/matchManage/:id/details',
        name: 'matchManage-details',
        component: () => import('@/pages/matchManage/details'),
        meta: { meta, title: '赛事详情' }
      },
      {
        path: '/certification',
        name: 'certification-list',
        component: () => import('@/pages/certification/list'),
        meta: { meta, title: '认证后台' }
      },
      {
        path: '/certification/:id/edit',
        name: 'certification-edit',
        component: () => import('@/pages/certification/edit'),
        meta: { meta, title: '编辑白名单用户' }
      },
      {
        path: '/certification/:id/edit-gal',
        name: 'certification-edit-gal',
        component: () => import('@/pages/certification/edit-gal'),
        meta: { meta, title: '编辑认证用户' }
      },
      {
        path: '/certification-add/:id',
        name: 'certification-add',
        component: () => import('@/pages/certification/add'),
        meta: { meta, title: '新增白名单用户' }
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

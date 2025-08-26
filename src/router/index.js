import { createRouter, createWebHistory } from 'vue-router'
import { authorized } from '@/common/auth/authorized.js'
import { loggedIn } from '@/common/auth/logged.js'
import { PERMISSION_NAME } from '@/constants/index.js'
import authRoutes from './auth.js'

const routes = [
  ...authRoutes,
  {
    path: '/',
    component: () => import('@/common/views/AppLayout.vue'),
    children: [
      {
        path: '/home',
        name: 'HomeView',
        meta: { permission: PERMISSION_NAME.DASHBOARD },
        component: () => import('@/views/admin/HomeView.vue'),
      },
      {
        path: '/manage_account',
        name: 'ManageAccountView',
        component: () => import('@/views/ManageAccountView.vue'),
      },
      {
        path: '/change_password',
        name: 'ChangePasswordView',
        component: () => import('@/views/ChangePasswordView.vue'),
      },
      {
        path: '/store',
        name: 'StoreView',
        component: () => import('@/views/StoreView.vue'),
      },
      {
        path: '/category',
        name: 'CategoryView',
        meta: { permission: PERMISSION_NAME.CATEGORY },
        component: () => import('@/views/admin/CategoryView.vue'),
      },
      {
        path: '/product',
        name: 'ProductView',
        meta: { permission: PERMISSION_NAME.PRODUCT },
        component: () => import('@/views/admin/ProductView.vue'),
      },
      {
        path: '/table',
        name: 'TableView',
        meta: { permission: PERMISSION_NAME.TABLE },
        component: () => import('@/views/admin/TableView.vue'),
      },
      {
        path: '/staff',
        name: 'StaffView',
        meta: { permission: PERMISSION_NAME.USER },
        component: () => import('@/views/admin/StaffView.vue'),
      },
      {
        path: '/money',
        name: 'MoneyView',
        meta: { permission: PERMISSION_NAME.MONEY },
        component: () => import('@/views/admin/MoneyView.vue'),
      },
      {
        path: '/sale',
        name: '/ProductReportView',
        meta: { permission: PERMISSION_NAME.SALE },
        component: () => import('@/views/admin/ProductReportView.vue'),
      },
      {
        path: '/waiter',
        name: 'WaiterView',
        meta: { permission: PERMISSION_NAME.ORDER },
        component: () => import('@/views/waiter/WaiterView.vue'),
      },
      {
        path: '/order-details',
        name: 'OrderDetailsView',
        meta: { permission: PERMISSION_NAME.ORDER },
        component: () => import('@/views/waiter/OrderDetailsView.vue'),
      },
      {
        path: '/chef',
        name: 'ChefView',
        meta: { permission: PERMISSION_NAME.COOK },
        component: () => import('@/views/chef/ChefView.vue'),
      },
      {
        path: '/cashier',
        name: 'OrdersView',
        meta: { permission: PERMISSION_NAME.RECIPT },
        component: () => import('@/views/cashier/OrdersView.vue'),
      },
    ],
    meta: { isSecure: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/common/views/PageNotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { redirectLogin } = await loggedIn(to, next)

  if (!redirectLogin) {
    authorized(to, next, router)
  }
})

export default router

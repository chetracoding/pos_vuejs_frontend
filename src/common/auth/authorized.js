import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import { getAllRoutes } from '@/helpers/route.js'

export const authorized = (to, next, router) => {
  const { user } = storeToRefs(useUserStore())
  const routePermissionName = to.meta.permission
  const permissions = user.value.permissions.map(
    ({ permission }) => permission.name
  )
  const routes = getAllRoutes(router.options.routes)

  if (!!routePermissionName && !permissions.includes(routePermissionName)) {
    const firstRoute = routes.find(
      (r) =>
        r.meta && r.meta.permission && permissions.includes(r.meta.permission)
    )

    router.push({ name: !firstRoute ? '404' : firstRoute.name })
  }

  next()
}

<template>
  <base-side-bar :menus="menus" />
</template>

<script setup>
  import { computed } from 'vue'
  import { t } from '@/plugins/i18n'
  import { useUserStore } from '@/stores/user'
  import { storeToRefs } from 'pinia'
  import { PERMISSION_NAME } from '@/constants/index.js'

  // Variables
  const { user } = storeToRefs(useUserStore())

  const menus = computed(() => {
    const defaultMenus = [
      {
        link: '/home',
        title: t('app.nav.home'),
        icon: 'mdi-home-analytics',
        permission: PERMISSION_NAME.DASHBOARD,
      },
      {
        link: '/cashier',
        title: 'Recipt',
        icon: 'mdi-storefront-plus',
        permission: PERMISSION_NAME.RECIPT,
      },
      {
        link: '/chef',
        title: 'Cook',
        icon: 'mdi-storefront-plus',
        permission: PERMISSION_NAME.COOK,
      },
      {
        link: '/product',
        title: t('app.nav.product'),
        icon: 'mdi-cube-outline',
        permission: PERMISSION_NAME.PRODUCT,
      },
      {
        link: '/category',
        title: t('app.nav.category'),
        icon: 'mdi-shape-plus-outline',
        permission: PERMISSION_NAME.CATEGORY,
      },
      {
        link: '/table',
        title: t('app.nav.table'),
        icon: 'mdi-table-chair',
        permission: PERMISSION_NAME.TABLE,
      },
      {
        link: '/staff',
        title: t('app.nav.staff'),
        icon: 'mdi-account-group-outline',
        permission: PERMISSION_NAME.USER,
      },
      {
        link: '/sale',
        title: t('app.nav.sale'),
        icon: 'mdi-chart-bar',
        permission: PERMISSION_NAME.SALE,
      },
      {
        link: '/money',
        title: t('app.nav.money'),
        icon: 'mdi-finance',
        permission: PERMISSION_NAME.MONEY,
      },
    ]

    return defaultMenus.filter(
      ({ permission }) =>
        !!user.value.permissions.find(
          (per) => per.permission.name == permission && per.read
        )
    )
  })
</script>

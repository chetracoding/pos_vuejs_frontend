<template>
  <Notif ref="notif" />
  <AppConfirm ref="confirm" />
  <AppDelay />
  <RouterView />
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router'
  import { useOrderStore } from '@/stores/order'
  import { useUserStore } from '@/stores/user'
  import socket from '@/utils/websocket.js'
  import AppConfirm from './lib/components/AppConfirm.vue'
  import AppDelay from './lib/components/AppDelay.vue'
  import Notif from './lib/components/AppNotification.vue'
  import i18n from './plugins/i18n'

  const { getOrder, getOrdersNotCompleted } = useOrderStore()
  const { userData } = storeToRefs(useUserStore())

  // Variables
  const notif = ref('')
  const confirm = ref('')
  const rootInstance = getCurrentInstance()

  onMounted(() => {
    socket.on('msg_to_client', data => {
      if (
        userData.value.store._id !== data.store._id
        || !['chef', 'cashier'].includes(userData.value.role.name)
      ) {
        return
      }

      notif.value.pushNotif(data.msg, { type: 'success', timeout: null })

      if (userData.value.role.name === 'chef') {
        return getOrdersNotCompleted()
      }

      // cashier
      getOrder()
    })

    document.addEventListener('keydown', e => {
      if (e.shiftKey && e.ctrlKey && e.key === 'L') {
        i18n.global.locale = i18n.global.locale === 'en' ? 'kh' : 'en'
      }
    })

    rootInstance.root.$notif = notif.value.pushNotif
    rootInstance.root.$confirm = confirm.value.open
  })
</script>

<style lang="scss" src="./sass/app.scss"></style>

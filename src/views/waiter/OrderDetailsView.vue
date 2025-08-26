<template>
  <v-card class="bg-grey-darken-2 py-3 d-flex align-center" width="100%">
    <v-icon
      class="text-h4 ml-5"
      color="white"
      icon="mdi-arrow-left"
      @click="$router.push('/waiter')"
    />
    <header
      class="font-inter w-50 ml-7 text-white text-h6 text-right font-weight-bold"
    >
      {{ $t("waiter.conformOrder") }}
    </header>
  </v-card>

  <div class="d-flex py-4">
    <div class="rounded-lg overflow-hidden d-flex align-center ml-5">
      <div class="p-1 px-2 bg-red-accent-2">{{ $t("waiter.table") }}</div>
      <div
        v-if="table"
        class="bg-white p-1 px-2 text-red-accent-2 font-weight-bold"
      >
        {{ table.table_number }}
      </div>
    </div>
  </div>

  <div class="bg-grey-darken-2 pb-5 mb-10">
    <h5 class="ml-5 pt-5 pb-4 font-weight-bold">{{ $t("waiter.summary") }}</h5>
    <div
      v-for="customize in myCart"
      :key="customize.product_customize_id"
      class="mx-4 mb-3 d-flex justify-space-between align-end"
      style="border-bottom: 1px solid grey"
    >
      <div>
        <h5>{{ customize.product.name }}</h5>
        <span>{{ $t("waiter.size") }} / {{ customize.size }}</span>
        <h5>x {{ customize.quantity }}</h5>
      </div>
      <h5 class="font-weight-bold">
        ${{ (customize.quantity * customize.price).toFixed(2) }}
      </h5>
    </div>
  </div>

  <!-- Confim order -->
  <v-layout class="overflow-visible">
    <v-bottom-navigation class="bg-grey-darken-2 rounded-t-lg">
      <div class="d-flex align-center px-3">
        <h5 class="mt-2">
          {{ $t("waiter.btn.total") }}:
          <span class="font-weight-bold">${{ totalPrice }}</span>
        </h5>
      </div>

      <v-spacer />

      <primary-button class="px-3" :disabled="success" @click="confirm">
        <h6 class="font-weight-bold mt-2">{{ $t("app.btn.confirm") }}</h6>
      </primary-button>
    </v-bottom-navigation>
  </v-layout>
</template>

<script setup>
  import { computed, getCurrentInstance, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { t } from '@/plugins/i18n.js'
  import { useOrderStore } from '@/stores/order'

  // Variables
  const instance = getCurrentInstance()
  const router = useRouter()
  const myCart = localStorage.getItem('customizes_selectd')
    ? ref(JSON.parse(localStorage.getItem('customizes_selectd')))
    : ref([])
  const table = localStorage.getItem('table_selectd')
    ? ref(JSON.parse(localStorage.getItem('table_selectd')))
    : ref(null)
  const { storeOrder } = useOrderStore()

  const totalPrice = computed(() => {
    let total = 0
    for (const customize of myCart.value) {
      total += Number(customize.price) * customize.quantity
    }
    return total.toFixed(2)
  })

  // Method
  const confirm = async () => {
    const customizes = JSON.parse(localStorage.getItem('customizes_selectd'))
    const table = JSON.parse(localStorage.getItem('table_selectd'))
    const today = new Date()
    const date
      = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    const time
      = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    const dateTime = date + ' ' + time
    const newOrder = {
      table_id: table._id,
      table_number: table.table_number,
      datetime: dateTime,
      product_customizes: customizes.map(
        ({ product_customize_id, quantity }) => ({
          product_customize_id,
          quantity,
        }),
      ),
    }
    await storeOrder(newOrder)
    localStorage.removeItem('customizes_selectd')
    localStorage.removeItem('table_selectd')
    instance.root.$notif(t('waiter.alert.orderSuccess'), { type: 'success' })
    router.push('/waiter')
  }
</script>

<style scoped>
.font-inter {
  font-family: "Inter", "Noto Serif Khmer", sans-serif, serif !important;
}
</style>

<template>
  <!-- Order view -->
  <v-layout>
    <ResOwnerSideBar />

    <!-- Header -->
    <header-component title="Manage order">
      <v-text-field
        v-model="keyword"
        append-inner-icon="mdi-magnify"
        class="text-white rounded-lg search"
        density="compact"
        hide-details
        label="Search for order..."
        single-line
        variant="solo"
      />
    </header-component>
    <!------>

    <v-main style="height: auto">
      <!-- If no order -->
      <div v-if="orders.length === 0" class="h-screen">
        <h4 class="text-center mt-5 text-white">No order available.</h4>
      </div>
      <!-- If have some orders -->
      <order-list-table v-else :orders="orders" />
      <!-- Product Summary -->
      <summary-component class="mt-2" title="Order Summary">
        <template #content>
          <div class="bg-grey-darken-2 mt-4 py-3 rounded-lg d-flex justify-space-between align-center">
            <span class="ml-2">Total</span>
            <span class="mr-2">{{ orders.length }} items</span>
          </div>
        </template>
      </summary-component>
    </v-main>
  </v-layout>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref } from 'vue'
  import ResOwnerSideBar from '@/components/aside/ResOwnerSideBar'
  import { useOrderStore } from '@/stores/order'

  // Variable
  defineProps(['title'])
  const { getOrder } = useOrderStore()
  const { notPaidOrders } = storeToRefs(useOrderStore())
  const keyword = ref('')
  // const menus = ref([
  //   {
  //     link: "/cashier",
  //     title: "Order",
  //     icon: "mdi-storefront-plus",
  //   },
  // ]);

  const orders = computed(() => {
    if (notPaidOrders.value.length === 0 === 0) return []
    return notPaidOrders.value.filter(r => {
      const regex = /\\/
      if (regex.test(keyword.value)) return
      if (
        r.table_id.table_number
          .toLowerCase()
          .search(keyword.value.toLowerCase()) >= 0 || r._id.toLowerCase().search(keyword.value.toLowerCase()) >= 0 || new Date(r.datetime).toLocaleDateString() == keyword.value) {
        return true
      }
      return false
    })
  })

  // Lifecycle hook
  onMounted(() => {
    getOrder()
  })
</script>

<style>
.search .v-input__control .v-theme--light {
  color: white;
  background-color: #2c2c2c !important;
}

#onesignal-bell-launcher {
  display: block;
}
</style>

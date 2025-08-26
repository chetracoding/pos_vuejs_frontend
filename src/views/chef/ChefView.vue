<template>
  <v-layout>
    <!-- Sidebar -->
    <ResOwnerSideBar />

    <v-main class="ml-2">
      <header-component title="Manage order" />

      <!-- Main container -->
      <main class="d-flex mt-2">
        <div class="d-flex flex-column" style="width: 100%">
          <div class="d-flex mr-4 justify-end align-center">
            <h6 v-if="orders.length > 1" class="text-white">
              Total {{ orders.length }} items
            </h6>
            <h6 v-else class="text-white mr-3">
              Total {{ orders.length }} item
            </h6>
          </div>

          <!-- List orders card -->
          <div v-if="orders.length > 0" class="grid-container gap-2 mr-4">
            <chef-order-card
              v-for="order in orders"
              :key="order._id"
              :order="order"
            />
          </div>
          <!-- No order -->
          <div v-else class="h-screen">
            <h4 class="text-center mt-5 text-white">No order available.</h4>
          </div>
        </div>
      </main>
    </v-main>
  </v-layout>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { onMounted } from 'vue'
  import ResOwnerSideBar from '@/components/aside/ResOwnerSideBar'
  import { useOrderStore } from '@/stores/order'

  // Variables
  const { getOrdersNotCompleted } = useOrderStore()
  const { orders } = storeToRefs(useOrderStore())

  // Lifecycle hook
  onMounted(() => {
    getOrdersNotCompleted()
  })
</script>

<style>
#onesignal-bell-launcher {
  display: block;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
</style>

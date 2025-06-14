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
            <h6 class="text-white" v-if="orders.length > 1">
              Total {{ orders.length }} items
            </h6>
            <h6 class="text-white mr-3" v-else>
              Total {{ orders.length }} item
            </h6>
          </div>

          <!-- List orders card -->
          <div class="grid-container gap-2 mr-4" v-if="orders.length > 0">
            <chef-order-card
              v-for="order in orders"
              :key="order._id"
              :order="order"
            >
            </chef-order-card>
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
import ResOwnerSideBar from "@/components/aside/ResOwnerSideBar";
import { onMounted } from "vue";
import { useOrderStore } from "@/stores/order";
import { storeToRefs } from "pinia";

// Variables
const { getOrdersNotCompleted } = useOrderStore();
const { orders } = storeToRefs(useOrderStore());

// Lifecycle hook
onMounted(() => {
  getOrdersNotCompleted();
});
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

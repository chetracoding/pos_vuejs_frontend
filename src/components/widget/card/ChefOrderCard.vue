<template>
  <v-card class="card rounded-lg bg-transparent">
    <div v-if="order" class="bg-grey-darken-2 rounded-lg">
      <v-card-title class="d-flex justify-content-center p-2">
        <v-card-subtitle class="card-subtitle"><v-icon class="mdi mdi-table" style="font-size: 18px" />
          :
          {{ order.table_id.table_number }}
        </v-card-subtitle>
        <v-card-subtitle><v-icon
                           class="mdi mdi-clock-outline"
                           style="font-size: 18px"
                         />
          <!-- To access only time -->
          :
          {{ new Date(order.datetime).toLocaleTimeString() }}</v-card-subtitle>
      </v-card-title>
      <div class="p-2 text-warning">
        <div class="d-flex flex-column gap-2">
          <!-- list foods in order -->
          <div
            v-for="order_detail in order.order_details"
            :key="order_detail._id"
            class="d-flex justify-content-between bg-grey-darken-3 rounded p-2"
          >
            <div v-if="order_detail.product_customize_id">
              <span style="font-size: 18px">Name :
                {{ order_detail.product_customize_id.product_id?.name }}</span><br>
              <span style="font-size: 18px">Size: {{ order_detail.product_customize_id.size }}</span>
            </div>
            <span
              class="align-self-end"
              style="font-size: 18px"
            >x {{ order_detail.quantity }}</span>
          </div>
        </div>
      </div>
      <v-card-actions class="d-flex justify-content-center">
        <primary-button class="px-2 py-2" @click="makeAsComplete(order)">
          <v-icon
            color="white"
            icon="mdi-check-circle-outline"
            size="large"
          />
          Complete
        </primary-button>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script setup>
  import { useOrderStore } from '@/stores/order'
  defineProps(['order'])

  // Variables
  const instance = getCurrentInstance()
  const { updateOrdersToCompleted } = useOrderStore()

  // Methods
  const makeAsComplete = async ({ _id }) => {
    await updateOrdersToCompleted(_id, { is_completed: true })
    instance.root.$notif('Successful completed', { type: 'success' })
  }
</script>

<style scoped>
.card {
  height: 487px;
  overflow: auto;
  width: auto;
}
.card::-webkit-scrollbar {
  display: none;
  background-color: black;
}
.card-subtitle {
  font-size: 18px;
  display: flex;
  align-items: center;
}
</style>

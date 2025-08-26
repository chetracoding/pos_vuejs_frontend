<template>
  <!-- Dialog remove customize -->
  <base-dialog
    v-model="isComplete"
    ms="Are you sure you want to check out?"
    title="Tips"
  >
    <danger-button @click="isComplete = false">
      <v-icon color="white" icon="mdi-close-box-multiple" size="large" />
      Cancel
    </danger-button>
    <primary-button @click="complete()">
      <v-icon
        color="white"
        icon="mdi-checkbox-multiple-marked"
        size="large"
      />
      Confirm
    </primary-button>
  </base-dialog>

  <!-- Create table of list orders -->
  <v-card
    v-for="order in props.orders"
    :key="order._id"
    class="d-flex pa-2 ma-2 bg-grey-darken-2 rounded-lg"
  >
    <v-card-text class="d-flex justify-space-between">
      <span class="w-50">ID : {{ order._id }}</span>
      <span class="w-25">Table : {{ order.table_id.table_number }}</span>
      <span class="w-25">{{
        new Date(order.datetime).toLocaleDateString()
      }}</span>
      <span class="w-25">{{
        new Date(order.datetime).toLocaleTimeString()
      }}</span>
    </v-card-text>
    <v-card-actions>
      <dark-button @click="(orderInfo = order), (dialog = true)">
        <v-icon color="red-accent-2" icon="mdi-eye" />
        View
      </dark-button>

      <dark-button @click="printClicked(order)">
        <v-icon color="red-accent-2" icon="mdi-printer" />
        Print
      </dark-button>

      <dark-button
        @click="
          isComplete = true;
          orderClicked = order;
        "
      ><v-icon color="red-accent-2" icon="mdi-checkbox-marked-circle" />
        Check out
      </dark-button>
    </v-card-actions>
  </v-card>

  <!-- Dialog of confirm order -->
  <v-dialog v-model="dialog" persistent width="600">
    <v-card class="rounded-lg">
      <v-card-title class="bg-red-accent-2 text-center">Order Details</v-card-title>
      <v-card-text>
        <div class="d-flex text-darken-4">
          <h6>ID:</h6>
          <h6 class="ml-2 font-weight-bold">{{ orderInfo._id }}</h6>
        </div>
        <div class="d-flex text-darken-4">
          <h6>Table:</h6>
          <h6 class="ml-2 font-weight-bold">
            {{ orderInfo.table_id.table_number }}
          </h6>
        </div>
        <div class="d-flex text-darken-4">
          <h6>Date Time:</h6>
          <h6 class="ml-2 font-weight-bold">
            {{ new Date(orderInfo.datetime).toLocaleString() }}
          </h6>
        </div>

        <!-- Card of list -->
        <h6 class="text-darken-4 font-weight-bold mt-3">Summary Orders</h6>
        <v-list>
          <div
            v-for="order_detail in orderInfo.order_details"
            :key="order_detail._id"
          >
            <div>
              <span>{{
                order_detail.product_customize_id.product_id.name
              }}</span><br>
              <span>size / {{ order_detail.product_customize_id.size }}</span>
            </div>
            <div class="d-flex">
              <span>X{{ order_detail.quantity }}</span>
              <v-spacer />
              <span>${{
                (
                  order_detail.quantity *
                  order_detail.product_customize_id.price
                ).toFixed(2)
              }}</span>
            </div>
            <hr>
          </div>
        </v-list>

        <div class="d-flex">
          <h6 class="text-darken-4 font-weight-bold">Total:</h6>
          <v-spacer />
          <h6 v-if="orderInfo" class="font-weight-bold text-darken-4">
            ${{ totalPriceOrderInfo }}
          </h6>
        </div>
      </v-card-text>
      <v-card-actions class="bg-grey-lighten-2">
        <v-spacer />
        <danger-button @click="dialog = false">
          <v-icon icon="mdi-close-box-multiple" />
          Close
        </danger-button>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Print bill---------- -->
  <div class="d-none">
    <div v-if="orderPrint" id="printOrder">
      <div width="100%">
        <h6 class="text-center text-h4">
          Welcome to:
          <span class="font-weight-bold">{{ orderPrint.store_id.name }}</span>
        </h6>
        <div class="p-2">
          <div class="p-1">
            <h6 class="text-subtitle-1">
              លេខ / ID :
              <span class="font-weight-bold">{{ orderPrint._id }}</span>
            </h6>
            <h6 class="text-subtitle-1">
              លេខតុ / Table :
              <span class="font-weight-bold">{{
                orderPrint.table_id.table_number
              }}</span>
            </h6>
            <h6 class="text-subtitle-1">
              កាលបរិច្ឆេទ / Date Time :
              <span class="font-weight-bold">{{
                new Date(orderPrint.datetime).toLocaleString()
              }}</span>
            </h6>
          </div>
          <!-- list of food -->
          <hr>
          <v-table>
            <thead>
              <tr>
                <th class="bg-white text-center text-black font-weight-bold">
                  បរិយាយ <br>
                  Description
                </th>
                <th class="bg-white text-center text-black font-weight-bold">
                  ទំហំ <br>
                  Size
                </th>
                <th class="bg-white text-center text-black font-weight-bold">
                  ចំនួន <br>
                  Quantity
                </th>
                <th class="bg-white text-center text-black font-weight-bold">
                  តម្លៃ <br>
                  Price
                </th>
                <th class="bg-white text-center text-black font-weight-bold">
                  សរុប <br>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order_detail in orderPrint.order_details"
                :key="order_detail._id"
              >
                <td class="text-center">
                  {{ order_detail.product_customize_id.product_id.name }}
                </td>
                <td class="text-center">
                  {{ order_detail.product_customize_id.size }}
                </td>
                <td class="text-center">{{ order_detail.quantity }}</td>
                <td class="text-center">
                  ${{ order_detail.product_customize_id.price.toFixed(2) }}
                </td>
                <td class="text-center">
                  ${{
                    (
                      order_detail.quantity *
                      order_detail.product_customize_id.price
                    ).toFixed(2)
                  }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <hr>
          <div class="p-1">
            <h6 class="text-subtitle-1">
              សរុប / Sub Total :
              <span class="font-weight-bold"> ${{ totalPriceOrderPrint }}</span>
            </h6>
            <br>
            <i class="font-weight-bold"> Thanks, Please come again. </i><br>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import printJS from 'print-js'
  import { useOrderStore } from '@/stores/order'

  // Variables
  const instance = getCurrentInstance()
  const props = defineProps(['orders'])
  const dialog = ref(false)
  const orderInfo = ref(null)
  const orderPrint = ref(null)
  const isComplete = ref(false)
  const orderClicked = ref(null)
  const { updateOrdersToPaid } = useOrderStore()

  // Computed
  // Total price for print
  const totalPriceOrderPrint = computed(() => {
    return getTotalPrice(orderPrint.value).toFixed(2)
  })
  // Total price to view
  const totalPriceOrderInfo = computed(() => {
    return getTotalPrice(orderInfo.value).toFixed(2)
  })

  // Method
  const getTotalPrice = order => {
    const sum = ref(0)
    for (const order_detail of order.order_details) {
      sum.value
        += order_detail.product_customize_id.price * order_detail.quantity
    }
    return sum.value
  }
  const complete = async () => {
    const updatePaidOrde = {
      is_completed: orderClicked.value.is_completed,
      is_paid: true,
    }
    isComplete.value = false
    await updateOrdersToPaid(orderClicked.value._id, updatePaidOrde)
    orderClicked.value = null
    instance.root.$notif('Successful checked out', { type: 'success' })
  }

  const printClicked = async order => {
    orderPrint.value = order
    // Referrent from :https://fontawesomeicons.com/tryit/code/vue-js-print-current-page/1
    // Purpose: to print a bill

    setTimeout(() => {
      printJS({
        printable: 'printOrder',
        type: 'html',
        targetStyles: ['*'],
      })
    }, 1)
  }
</script>

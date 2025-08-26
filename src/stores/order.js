import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import http from '@/utils/http.js'
import socket from '@/utils/websocket.js'

export const useOrderStore = defineStore('order', {
  state: () => {
    return {
      error: null,
      storeSuccess: false,
      paidSuccess: false,
      success: false,
      orders: [],
      notPaidOrders: [],
    }
  },
  actions: {
    // Store Order
    async storeOrder ({ table_number, ...payload }) {
      try {
        const { userData } = storeToRefs(useUserStore())
        const res = await http.post('orders', payload)
        if (res.data.success) {
          socket.emit('msg_to_server', {
            ...userData.value,
            msg: `Hello, you have a new order from table ${table_number}.`,
          })
          this.storeSuccess = true
          return res.data.data
        }
      } catch (error) {
        return error
      }
    },
    // Get orders not complete
    async getOrdersNotCompleted () {
      try {
        const res = await http.get('orders?is_completed=false')
        if (res.data.success) {
          this.orders = res.data.data
        }
      } catch (error) {
        return error
      }
    },
    // Search orders
    async searchOrders (keyword) {
      try {
        const res = await http.get(`orders/search/${keyword}`)
        if (res.data.success) {
          this.notPaidOrders = res.data.data
        }
      } catch (error) {
        if (!error.response.data.success) {
          this.notPaidOrders = []
        }
      }
    },
    // Update order to complete
    async updateOrdersToCompleted (orderId, order) {
      try {
        this.orders = this.orders.filter(r => r._id !== orderId)
        // this.success = true;
        await http.put(`orders/${orderId}`, order)
        // if (res.data.success) {
        // }
      } catch (error) {
        return error
      }
    },
    // Get order for cashier
    async getOrder () {
      try {
        const res = await http.get('orders?is_paid=false')
        if (res.data.success) {
          this.notPaidOrders = res.data.data
        }
      } catch (error) {
        return error
      }
    },
    // Update order to paid
    async updateOrdersToPaid (orderId, order) {
      try {
        this.notPaidOrders = this.notPaidOrders.filter(
          r => r._id !== orderId,
        )
        this.paidSuccess = true
        await http.put(`orders/${orderId}`, order)
        // if (res.data.success) {
        // }
      } catch (error) {
        return error
      }
    },
  },
})

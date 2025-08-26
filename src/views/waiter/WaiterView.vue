<template>
  <v-layout>
    <!-- Nav -->
    <header-component :class="'m-auto'">
      <v-text-field
        v-model="keyword"
        append-inner-icon="mdi-magnify"
        class="search text-white rounded-lg"
        density="compact"
        hide-details
        :label="$t('waiter.search')"
        single-line
        variant="solo"
      />
    </header-component>

    <v-main class="mt-2 mb-15">
      <v-tabs v-model="filterValue" align-tabs="center" class="text-white mb-3" color="red-accent-2">
        <v-tab :value="'all'">{{ $t("waiter.all") }}</v-tab>
        <v-tab v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</v-tab>
      </v-tabs>

      <v-select
        v-model="table"
        class="select-table ml-2 mb-2 rounded-lg text-white bg-grey-darken-2"
        hide-details="auto"
        :item-title="'table_number'"
        :item-value="'table'"
        :items="tables"
        :label="$t('waiter.selectTable')"
        return-object
        @update:model-value="tableSelected"
      />

      <header
        class="text-center text-white text-h5 font-weight-bold font-inter"
      >
        {{ $t("waiter.product") }}
      </header>

      <!-- List products -->
      <div v-if="producties.length > 0" class="grid-container gap-2 mx-2 mt-2">
        <product-card
          v-for="product in producties"
          :key="product._id"
          :product="product"
          @on-customize="onCustomize"
        />
      </div>

      <v-container v-else>
        <h4 class="mt-5 text-center text-white">{{ $t("app.noData") }}</h4>
      </v-container>
    </v-main>
  </v-layout>

  <!-- A product customize -->
  <v-card v-if="productCustomize" class="overflow-visible d-zoom">
    <v-layout class="d-zoom">
      <v-navigation-drawer
        v-model="isCustomize"
        class="customize-drawer bg-grey-darken-2 h-auto rounded-t-lg"
        location="bottom"
        permanent
        rail
      >
        <v-card class="mx-auto rounded-t-lg bg-grey-darken-2 d-zoom">
          <v-card-item class="bg-red-accent-2">
            <v-card-title>
              <span class="text-h5">{{ productCustomize.name }}</span>
            </v-card-title>

            <template #append>
              <v-defaults-provider
                :defaults="{
                  VBtn: {
                    variant: 'text',
                    density: 'comfortable',
                  },
                }"
              >
                <v-btn class="text-h5" icon="mdi-close-circle" @click="isCustomize = !isCustomize" />
              </v-defaults-provider>
            </template>
          </v-card-item>

          <v-list>
            <v-list-item append-icon="mdi-plus-none">
              <div class="d-flex">
                <h5>{{ $t("waiter.size") }}:</h5>
                <v-spacer />
                <h5>{{ $t("waiter.price") }}:</h5>
              </div>
            </v-list-item>

            <v-list-item v-for="customize in productCustomize.product_customizes" :key="customize.id">
              <div class="d-flex align-center">
                <h5 class="font-weight-bold">{{ customize.size }}</h5>
                <v-spacer />
                <h5 class="mr-6 font-weight-bold">
                  ${{ customize.price.toFixed(2) }}
                </h5>
                <v-icon
                  class="text-h4"
                  color="red-accent-2"
                  icon="mdi-plus-circle"
                  @click="addCustomize(productCustomize, customize)"
                />
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-navigation-drawer>
    </v-layout>
  </v-card>

  <!-- Order summary -->
  <v-layout class="overflow-visible">
    <v-bottom-navigation class="rounded-t-lg bg-grey-darken-2">
      <div
        class="d-flex align-center bg-red-accent-2 rounded-lg px-2"
        style="cursor: pointer"
        @click="(isCart = !isCart), (isCustomize = false)"
      >
        <div>
          <v-icon class="text-h4 mt-3" icon="mdi-cart" />
          <v-avatar class="mb-2 text-h6 text-white font-weight-bold" color="grey-darken-4">
            {{ totalFoods }}
          </v-avatar>
        </div>
        <h5 class="ml-2 mt-2">
          {{ $t("waiter.btn.total") }}:
          <span class="font-weight-bold">${{ totalPrice }}</span>
        </h5>
      </div>

      <v-spacer />

      <primary-button class="px-2" @click="order">
        <h6 class="font-weight-bold mt-2">{{ $t("waiter.btn.order") }}</h6>
      </primary-button>
    </v-bottom-navigation>
  </v-layout>

  <!-- My cart -->
  <v-card v-if="myCart.length > 0" class="d-zoom">
    <v-layout class="overflow-visible d-zoom">
      <v-navigation-drawer
        v-model="isCart"
        class="cart-drawer bg-grey-darken-2 rounded-t-lg"
        location="bottom"
        permanent
        rail
      >
        <v-card class="mx-auto bg-grey-darken-2 rounded-t-lg">
          <v-card-item class="bg-red-accent-2">
            <v-card-title>
              <span class="text-h5 font-inter">{{ $t("waiter.cart") }} ({{ totalFoods }})</span>
            </v-card-title>

            <template #append>
              <v-defaults-provider
                :defaults="{
                  VBtn: {
                    variant: 'text',
                    density: 'comfortable',
                  },
                }"
              >
                <v-btn class="text-h5" icon="mdi-close-circle" @click="isCart = !isCart" />
              </v-defaults-provider>
            </template>
          </v-card-item>

          <v-list>
            <v-list-item v-for="customize in myCart" :key="customize.product_customize_id" class="text-orange-darken-4">
              <div class="d-flex align-center">
                <div class="d-flex align-center">
                  <div>
                    <v-img
                      class="bg-white rounded-lg"
                      cover
                      :height="100"
                      :src="customize.product.image"
                      :width="130"
                    />
                  </div>
                  <div class="ml-3 text-white">
                    <h6 class="font-weight-bold">
                      {{ customize.product.name }}
                    </h6>
                    <span>{{ $t("waiter.size") }} / {{ customize.size }}</span>
                    <h5 class="font-weight-bold">
                      ${{ (customize.quantity * customize.price).toFixed(2) }}
                    </h5>
                  </div>
                </div>
                <v-spacer />
                <div class="d-flex align-center">
                  <v-icon
                    class="text-h4"
                    color="white"
                    icon="mdi-minus-circle-outline"
                    @click="minusCustomize(customize.product_customize_id)"
                  />
                  <h4 class="text-white mx-3 mt-2 font-weight-bold">
                    {{ customize.quantity }}
                  </h4>
                  <v-icon
                    class="text-h4"
                    color="red-accent-2"
                    icon="mdi-plus-circle"
                    @click="addCustomize(customize.product, customize)"
                  />
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-navigation-drawer>
    </v-layout>
  </v-card>

  <!-- Dialog remove customize -->
  <base-dialog v-model="isRemoveCustom" :ms="$t('waiter.dialog.deleteCustom')" :title="$t('app.dialog.tips')">
    <danger-button @click="isRemoveCustom = false">
      <v-icon color="white" icon="mdi-close-box-multiple" size="large" />
      {{ $t("app.btn.cancel") }}
    </danger-button>
    <primary-button @click="removeCustomize(deleteCustomId)">
      <v-icon color="white" icon="mdi-checkbox-multiple-marked" size="large" />
      {{ $t("app.btn.confirm") }}
    </primary-button>
  </base-dialog>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { computed, getCurrentInstance, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { t } from '@/plugins/i18n.js'
  import { useCategoryStore } from '@/stores/category'
  import { useProductStore } from '@/stores/product'
  import { useTableStore } from '@/stores/table'

  // Variables
  const instance = getCurrentInstance()
  const { getProducts } = useProductStore()
  const { getTables } = useTableStore()
  const { getCategory } = useCategoryStore()
  const { tables } = storeToRefs(useTableStore())
  const { products } = storeToRefs(useProductStore())
  const { categories } = storeToRefs(useCategoryStore())
  const router = useRouter()
  const keyword = ref('')
  const filterValue = ref(null)

  const isCustomize = ref(false)
  const isRemoveCustom = ref(false)
  const deleteCustomId = ref(null)
  const productCustomize = ref(null)
  const isCart = ref(false)
  const myCart = localStorage.getItem('customizes_selectd')
    ? ref(JSON.parse(localStorage.getItem('customizes_selectd')))
    : ref([])

  const table = localStorage.getItem('table_selectd')
    ? ref(JSON.parse(localStorage.getItem('table_selectd')))
    : ref(null)

  const producties = computed(() => {
    if (products.value.length === 0 === 0) return []
    return products.value.filter(r => {
      const keys = ['name', 'product_code', 'description']
      if (filterValue.value == 'all') {
        const regex = /\\/
        if (regex.test(keyword.value)) return
        for (const key of keys) {
          if (r[key].toLowerCase().search(keyword.value.toLowerCase()) >= 0)
            return true
        }
      } else {
        for (const key of keys) {
          if (
            r[key].toLowerCase().search(keyword.value.toLowerCase()) >= 0
            && r.category._id == filterValue.value
          )
            return true
        }
      }
      return false
    })
  })

  // On click product customize
  const onCustomize = product => {
    isCustomize.value = true
    isCart.value = false
    productCustomize.value = product
  }
  // Total order price
  const totalPrice = computed(() => {
    let total = 0
    for (const customize of myCart.value) {
      total += Number(customize.price) * customize.quantity
    }
    return total.toFixed(2)
  })
  // Total order food
  const totalFoods = computed(() => {
    let count = 0
    for (const customize of myCart.value) {
      count += customize.quantity
    }
    return count
  })
  // Add product customize
  const addCustomize = (product, customize) => {
    if (customize._id) {
      customize.product_customize_id = customize._id
    }
    const customizes = localStorage.getItem('customizes_selectd')
      ? JSON.parse(localStorage.getItem('customizes_selectd'))
      : []
    const findCustomIndex = customizes.findIndex(
      custom => custom.product_customize_id === customize.product_customize_id,
    )
    if (customizes[findCustomIndex]) {
      customizes[findCustomIndex].quantity += 1
    } else {
      customizes.push({
        product_customize_id: customize.product_customize_id,
        size: customize.size,
        quantity: 1,
        price: customize.price,
        product: {
          product_id: product.product_id,
          name: product.name,
          image: product.image,
        },
      })
    }
    myCart.value = customizes
    localStorage.setItem('customizes_selectd', JSON.stringify(customizes))
  }
  // Minus product customize
  const minusCustomize = custom_id => {
    const customizes = localStorage.getItem('customizes_selectd')
      ? JSON.parse(localStorage.getItem('customizes_selectd'))
      : []
    const findCustomIndex = customizes.findIndex(
      custom => custom.product_customize_id === custom_id,
    )
    if (customizes[findCustomIndex]) {
      customizes[findCustomIndex].quantity -= 1
      if (customizes[findCustomIndex].quantity < 1) {
        customizes[findCustomIndex].quantity = 1
        isRemoveCustom.value = true
        deleteCustomId.value = findCustomIndex
      }
    }
    myCart.value = customizes
    localStorage.setItem('customizes_selectd', JSON.stringify(customizes))
  }
  // Remove product customize
  const removeCustomize = custom_id => {
    const customizes = localStorage.getItem('customizes_selectd')
      ? JSON.parse(localStorage.getItem('customizes_selectd'))
      : []
    customizes.splice(custom_id, 1)
    isRemoveCustom.value = false
    myCart.value = customizes
    localStorage.setItem('customizes_selectd', JSON.stringify(customizes))
  }
  // Get table seleted from localStorage
  const tableSelected = () => {
    localStorage.setItem('table_selectd', JSON.stringify(table.value))
  }
  // Order food
  const order = () => {
    if (myCart.value.length === 0) {
      return instance.root.$notif(t('waiter.alert.selectFood'), {
        type: 'error',
      })
    }

    if (!table.value) {
      return instance.root.$notif(t('waiter.alert.selectTable'), {
        type: 'error',
      })
    }

    router.push('/order-details')
  }

  // Lifecycle hook
  onMounted(() => {
    getProducts()
    getCategory()
    getTables()
  })
</script>

<style scoped>
.font-inter {
  font-family: "Inter", "Noto Serif Khmer", sans-serif, serif !important;
}

::v-deep .search .v-input__control .v-theme--light {
  color: white;
  background-color: #2c2c2c !important;
}

.cart-drawer,
.customize-drawer {
  margin-bottom: 56px;
}

.cart-drawer {
  height: 70vh !important;
}

.select-table {
  width: 200px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

@media screen and (max-width: 900px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 430px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

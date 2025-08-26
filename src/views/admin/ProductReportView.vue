<template>
  <v-layout>
    <!-- Left side bar -->
    <ResOwnerSideBar />

    <v-main class="ml-2">
      <!-- Header top -->
      <header-component :title="$t('app.crud.sale.title')" />

      <!-- Main container -->
      <main class="d-flex mt-3">
        <div class="w-100 d-flex flex-column">
          <!-- Select date -->
          <div class="w-25 mb-3">
            <vue-date-picker
              dark
              :model-value="dateValue"
              month-picker
              @update:model-value="dateSelected"
            />
          </div>

          <!-- Chart : column bar-->
          <apexchart
            :class="[
              productReports.length === 0 ? 'd-none' : '',
              'bg-grey-darken-2 rounded-lg mr-2 text-black',
            ]"
            height="485"
            :options="options"
            :series="series"
            type="bar"
          />

          <!-- No product report -->
          <div v-if="productReports.length === 0" class="w-100">
            <h4 class="text-center mt-5 text-white">No report available.</h4>
          </div>
        </div>

        <!--Products summary -->
        <summary-component class="mt-2" title="Sale Summary">
          <template #content>
            <div
              v-for="productReport in productReports"
              :key="productReport.product_name"
              class="bg-grey-darken-2 mt-2 rounded-lg d-flex justify-space-between align-center"
            >
              <div class="w-50 card-summary py-2 m-2 rounded-lg text-center">
                {{ productReport.product_name }}
              </div>
              <span
                v-if="Number(productReport.total_orders) > 1"
                class="mr-2"
              >{{ productReport.total_orders }} Items</span>
              <span
                v-else
                class="mr-2"
              >{{ productReport.total_orders }} Item</span>
            </div>
            <div
              class="bg-grey-darken-2 mt-4 py-3 rounded-lg d-flex justify-space-between align-center"
            >
              <span class="ml-2">Total</span>
              <span
                v-if="totalProducts > 1"
                class="mr-2"
              >{{ totalProducts }} items</span>
              <span v-else class="mr-2">{{ totalProducts }} item</span>
            </div>
          </template>
        </summary-component>
      </main>
    </v-main>
  </v-layout>
</template>

<script setup>
  import VueDatePicker from '@vuepic/vue-datepicker'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref } from 'vue'
  import ResOwnerSideBar from '@/components/aside/ResOwnerSideBar'
  import { useReportsStore } from '@/stores/reports'
  import '@vuepic/vue-datepicker/dist/main.css'

  // Variable
  const { getProductReports } = useReportsStore()
  const { productReports } = storeToRefs(useReportsStore())
  // Get current month and year
  const currentDate = new Date()
  const getMonth = currentDate.getMonth().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
  const getYear = currentDate.getFullYear()
  const dateValue = ref({ month: getMonth, year: getYear })

  // Computed
  // Sum total product orders
  const totalProducts = computed(() => {
    let sum = 0
    productReports.value.filter(function (value) {
      sum += Number(value.total_orders)
    })
    return sum
  })

  // Get values from object in array
  const filter = (array, key) => {
    const items = []
    array.filter(function (value) {
      items.push(value[key])
    })
    return items
  }

  // Reference of chart : https://codesandbox.io/s/o7339qql3z -->
  // Chart values
  const options = ref({
    plotOptions: {
      bar: {
        columnWidth: '50px',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        borderRadius: 10,
        margin: 70,
      },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          fontSize: '0.8rem',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          cssClass: 'apexcharts-yaxis-label',
          colors: 'white',
        },
      },
    },
    xaxis: {
      categories: filter(productReports.value, 'product_name'),
      labels: {
        style: {
          fontSize: '0.8rem',
          fontFamily: 'Inter, sans-serif',
          cssClass: 'apexcharts-xaxis-label',
          colors: 'white',
        },
      },
    },
  })

  const series = ref([
    {
      data: filter(productReports.value, 'total_orders'),
      color: '#F25657',
    },
  ])

  // Medthods
  // Render date to chart view
  const renderChart = () => {
    options.value = {
      xaxis: {
        categories: filter(productReports.value, 'product_name'),
      },
    }
    series.value[0].data = filter(productReports.value, 'total_orders')
  }

  // Seleted on date
  const dateSelected = async modelData => {
    if (modelData) {
      dateValue.value = modelData
      console.log(modelData)
      await getProductReports(modelData.month + 1, modelData.year)
      renderChart()
    }
  }

  // Lifecycle hook
  onMounted(async () => {
    await getProductReports(Number(getMonth) + 1, getYear)
    renderChart()
  })
</script>

<style scoped>
.card-summary {
  background: #2c2c2c;
}
</style>

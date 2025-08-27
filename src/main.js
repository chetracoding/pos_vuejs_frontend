import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

import CategoryForm from '@/components/form/CategoryForm'

import ProductForm from '@/components/form/ProductForm'
import StaffForm from '@/components/form/StaffForm'
import TableForm from '@/components/form/TableForm'
import UpdateProfileForm from '@/components/form/UpdateProfileForm'

import UploadingProgress from '@/components/progress/UploadingProgress'
import SummaryComponent from '@/components/summary/SummaryComponent'
import OrderListTable from '@/components/table/OrderListTable'
import ProductListTable from '@/components/table/ProductListTable'
import DangerButton from '@/components/widget/button/DangerButton'
import DarkButton from '@/components/widget/button/DarkButton'
// Import components
import PrimaryButton from '@/components/widget/button/PrimaryButton'
import SecondaryButton from '@/components/widget/button/SecondaryButton'
import CategoryCard from '@/components/widget/card/CategoryCard'
import ChefOrderCard from '@/components/widget/card/ChefOrderCard'
import ProductCard from '@/components/widget/card/ProductCard'
import ProductResOwnerCard from '@/components/widget/card/ProductResOwnerCard'
import StaffCard from '@/components/widget/card/StaffCard'
import TableCard from '@/components/widget/card/TableCard'
import BaseDialog from '@/components/widget/dialog/BaseDialog'
import HeaderComponent from '@/components/widget/header/HeaderComponent'
import BaseHeader from '@/lib/components/BaseHeader.vue'
import App from './App.vue'
import { initFirebase } from './plugins/firebase.js'
import i18n from './plugins/i18n'
import { rulesPlugin, vuetify } from './plugins/vuetify'
import router from './router'
// App
const app = createApp(App)
const pinia = createPinia()

app.component('BaseHeader', BaseHeader)

// Cards
app.component('product-res-owner-card', ProductResOwnerCard)
app.component('product-card', ProductCard)
app.component('category-card', CategoryCard)
app.component('table-card', TableCard)
app.component('staff-card', StaffCard)
app.component('chef-order-card', ChefOrderCard)

// Sidebars
app.component('header-component', HeaderComponent)
app.component('summary-component', SummaryComponent)

// Forms
app.component('category-form', CategoryForm)
app.component('product-form', ProductForm)
app.component('staff-form', StaffForm)
app.component('table-form', TableForm)
app.component('update-profile-form', UpdateProfileForm)

// Tables
app.component('product-list-table', ProductListTable)
app.component('order-list-table', OrderListTable)

// Buttons
app.component('primary-button', PrimaryButton)
app.component('secondary-button', SecondaryButton)
app.component('danger-button', DangerButton)
app.component('dark-button', DarkButton)

// Dialog
app.component('base-dialog', BaseDialog)

// Uplaoding progress
app.component('uploading-progress', UploadingProgress)

// Initialize firebase app
initFirebase()
app.config.productionTip = false

// App uses
app
  .use(VueApexCharts)
  .use(pinia)
  .use(i18n)
  .use(vuetify)
  .use(rulesPlugin)
  .use(router)
  .mount('#app')

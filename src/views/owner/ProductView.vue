<template>
  <v-layout>
    <v-main class="ml-2">
      <!-- Left side bar -->
        <ResOwnerSideBar />

      <!-- Header top -->
      <header-component :title="$t('app.crud.product.title')">
        <v-text-field
          v-model="keyword"
          class="text-white rounded-lg search"
          density="compact"
          variant="solo"
          :label="$t('owner.search')"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
        ></v-text-field>
      </header-component>

      <!-- Main container -->
      <main class="d-flex mt-1 mr-2">
        <div class="d-flex flex-column mr-2 w-100">
          <v-tabs
            v-model="filterValue"
            class="text-white mb-3"
            color="red-accent-2"
            align-tabs="center"
          >
            <v-tab :value="'all'">{{ $t("app.crud.product.all") }}</v-tab>
            <v-tab
              v-for="category in categories"
              :key="category._id"
              :value="category._id"
              >{{ category.name }}</v-tab
            >
          </v-tabs>
          <!-- List products card -->
          <div v-if="producties.length > 0" class="grid-container mt-2 gap-2">
            <product-res-owner-card
              v-for="product in producties"
              :key="product._id"
              :product="product"
            >
              <div class="d-flex justify-space-between align-center mt-2">
                <dark-button @click="onEdit(product)">
                  <v-icon
                    icon="mdi-square-edit-outline"
                    color="white"
                    size="large"
                  ></v-icon>
                  {{ $t("app.btn.edit") }}
                </dark-button>
                <danger-button
                  @click="
                    isDelete = true;
                    deleteId = product._id;
                  "
                >
                  <v-icon
                    icon="mdi-delete-forever"
                    color="white"
                    size="large"
                  ></v-icon>
                  {{ $t("app.btn.delete") }}
                </danger-button>
              </div>
            </product-res-owner-card>
          </div>

          <div class="w-100 text-center" v-else>
            <h4 class="text-center mt-5 text-white">{{ $t("app.noData") }}</h4>
          </div>
        </div>

        <!-- Product Summary -->
        <summary-component class="mt-2" :title="$t('app.crud.product.summary')">
          <template v-slot:btn>
            <secondary-button @click="dialog = true">
              <v-icon
                icon="mdi-plus-box-multiple"
                color="white"
                size="large"
              ></v-icon>
              {{ $t("app.btn.add") }}
            </secondary-button>
          </template>
          <template v-slot:content>
            <div
              class="bg-grey-darken-2 mt-3 py-3 rounded-lg d-flex justify-space-between align-center"
            >
              <span class="ml-2">{{ $t("app.total") }}</span>
              <span v-if="products.length > 1" class="mr-2"
                >{{ products.length }} {{ $t("app.items") }}</span
              >
              <span v-else class="mr-2"
                >{{ products.length }} {{ $t("app.item") }}</span
              >
            </div>
          </template>
        </summary-component>
      </main>
    </v-main>
  </v-layout>

  <!-- Form create product -->
  <product-form></product-form>

  <!-- Delete product customize -->
  <base-dialog
    v-model="isDelete"
    title="Tips"
    ms="Are you sure you want to delete?"
  >
    <danger-button @click="isDelete = false">
      <v-icon icon="mdi-close-box-multiple" color="white" size="large"></v-icon>
      Cancel
    </danger-button>
    <primary-button @click="deleted">
      <v-icon
        icon="mdi-checkbox-multiple-marked"
        color="white"
        size="large"
      ></v-icon>
      Confirm
    </primary-button>
  </base-dialog>
</template>

<script setup>
import ResOwnerSideBar from "@/components/aside/ResOwnerSideBar";
import { computed, onMounted, getCurrentInstance } from "vue";
import { useProductStore } from "@/stores/product";
import { useCategoryStore } from "@/stores/category";
import { storeToRefs } from "pinia";
import { ref } from "vue";

// Variables
const instance = getCurrentInstance();
const { getCategory } = useCategoryStore();
const { getProducts, deleteProduct } = useProductStore();
const { products, dialog, productInForm } = storeToRefs(useProductStore());
const { categories } = storeToRefs(useCategoryStore());
const isDelete = ref(false);
const deleteId = ref(null);
const keyword = ref("");
const filterValue = ref(null);

const producties = computed(() => {
  if (!products.value.length === 0) return [];
  return products.value.filter((r) => {
    const keys = ["name", "product_code", "description"];
    if (filterValue.value != "all") {
      for (const key of keys) {
        if (
          r[key].toLowerCase().search(keyword.value.toLowerCase()) >= 0 &&
          r.category_id._id == filterValue.value
        )
          return true;
      }
    } else {
      const regex = /\\/;
      if (regex.test(keyword.value)) return;
      for (const key of keys) {
        if (r[key].toLowerCase().search(keyword.value.toLowerCase()) >= 0)
          return true;
      }
    }
    return false;
  });
});

// Methods

// Delete the product
let deleted = async () => {
  await deleteProduct(deleteId.value);
  isDelete.value = false;
  instance.root.$notif("Successful deleted", { type: "success" });
};
// On click edit the product
const onEdit = (product) => {
  const productEdit = { ...product };
  productEdit.category_id = product.category_id._id;
  productEdit.product_id = product._id;
  productInForm.value = productEdit;
  dialog.value = true;
};

// Lifecycle hook
onMounted(() => {
  getProducts();
  getCategory();
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.card-summary {
  background: #2c2c2c;
}

::v-deep .search .v-input__control .v-theme--light {
  color: white;
  background-color: #2c2c2c !important;
}
</style>

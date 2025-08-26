<template>
  <v-form>
    <v-dialog v-model="dialog" persistent width="900">
      <v-card class="rounded-lg">
        <v-card-title
          v-if="productInForm.product_id"
          class="bg-red-accent-2 text-center"
        >Update product</v-card-title>
        <v-card-title
          v-else
          class="bg-red-accent-2 text-center"
        >Create new product</v-card-title>

        <div class="w-100 px-2 pt-2 d-flex">
          <div class="w-30 mr-3">
            <v-text-field
              v-model="productInForm.name"
              class="mt-2 text-black"
              density="compact"
              :error-messages="vp$.name.$errors.map((e) => e.$message)"
              label="Name"
              required
              variant="outlined"
              @blur="vp$.name.$touch"
              @input="vp$.name.$touch"
            />

            <v-text-field
              v-model="productInForm.product_code"
              class="mt-2 text-black"
              density="compact"
              :error-messages="`${vp$.product_code.$errors.map(
                (e) => e.$message
              )}${errProductCode}`"
              label="Code"
              required
              variant="outlined"
              @blur="vp$.product_code.$touch"
              @input="
                vp$.product_code.$touch;
                errProductCode = '';
              "
            />

            <v-select
              v-model="productInForm.category_id"
              class="mt-2 text-black"
              density="compact"
              :error-messages="vp$.category_id.$errors.map((e) => e.$message)"
              :item-title="'name'"
              :item-value="'_id'"
              :items="categories"
              label="Category"
              required
              variant="outlined"
              @blur="vp$.category_id.$touch"
              @change="vp$.category_id.$touch"
            />

            <v-textarea
              v-model="productInForm.description"
              class="mt-2 text-black"
              cols="2"
              density="compact"
              :error-messages="vp$.description.$errors.map((e) => e.$message)"
              label="Description"
              required
              rows="1"
              variant="outlined"
              @blur="vp$.description.$touch"
              @input="vp$.description.$touch"
            />

            <v-switch
              v-model="productInForm.is_active"
              class="text-black"
              color="orange-darken-4"
              :error-messages="vp$.is_active.$errors.map((e) => e.$message)"
              inset
              label="Active"
              required
              variant="outlined"
              @blur="vp$.is_active.$touch"
              @change="vp$.is_active.$touch"
            />
          </div>

          <div class="w-30">
            <v-file-input
              ref="inputFile"
              accept="image/png, image/jpeg"
              class="d-none"
              :clearable="false"
              density="compact"
              label="File input"
              prepend-icon="mdi-file-image"
              required
              variant="outlined"
              @change="imageUpload($event)"
            />

            <v-tooltip v-model="showToolTip" location="center">
              <template #activator="{ props }">
                <v-img
                  v-bind="props"
                  aspect-ratio="16/9"
                  class="cursor mt-2 rounded-lg"
                  cover
                  :height="193"
                  :src="
                    productInForm.image
                      ? productInForm.image
                      : imgPreview
                        ? imgPreview
                        : require('../../assets/select_product.png')
                  "
                  :width="238"
                  @click="uploadClicked"
                />
              </template>
              <div class="d-flex flex-column py-2 align-center">
                <v-icon
                  class="text-h4"
                  color="white"
                  icon="mdi-image-plus"
                />
                <span>Upload image</span>
              </div>
            </v-tooltip>
          </div>

          <div class="ml-3 mb-2 w-50">
            <div class="d-flex align-center gap-2">
              <v-text-field
                v-model="customize.size"
                class="mt-2 text-black w-50"
                density="compact"
                :error-messages="vc$.size.$errors.map((e) => e.$message)"
                label="Size"
                variant="outlined"
                @blur="vc$.size.$touch"
                @input="vc$.size.$touch"
              />

              <v-text-field
                v-model="customize.price"
                class="mt-2 text-black w-50"
                density="compact"
                :error-messages="vc$.price.$errors.map((e) => e.$message)"
                label="Price ($)"
                type="number"
                variant="outlined"
                @blur="vc$.price.$touch"
                @input="vc$.price.$touch"
              />

              <primary-button
                class="mb-3"
                @click="
                  vc$.$validate();
                  storeCustom(findCustIndex);
                "
              >
                <v-icon
                  color="white"
                  icon="mdi-content-save-all"
                  size="large"
                />
                Save
              </primary-button>
            </div>

            <div
              v-for="(customizeItem, index) in productInForm.product_customizes"
              :key="index"
              class="d-flex mt-2 p-2 rounded-lg justify-space-between align-center bg-grey-darken-1 mb-2"
              width="300px"
            >
              <div class="w-25">
                <span>{{ customizeItem.size }}</span>
              </div>
              <div class="w-40">
                <span>${{ Number(customizeItem.price).toFixed(2) }}</span>
              </div>
              <div class="w-40 d-flex justify-end">
                <dark-button @click="editCustom(index)">
                  <v-icon
                    color="white"
                    icon="mdi-square-edit-outline"
                    size="large"
                  />
                  Edit
                </dark-button>
                <danger-button
                  class="ml-2"
                  @click="
                    isDelete = true;
                    deleteCustIndex = index;
                  "
                >
                  <v-icon
                    color="white"
                    icon="mdi-delete-forever"
                    size="large"
                  />
                  Delete
                </danger-button>
              </div>
            </div>
          </div>
        </div>

        <v-card-actions class="bg-grey-lighten-2">
          <v-spacer />
          <danger-button @click="clearPruduct()">
            <v-icon
              color="white"
              icon="mdi-close-box-multiple"
              size="large"
            />
            Close
          </danger-button>
          <primary-button
            @click="
              vp$.$validate();
              save();
            "
          >
            <v-icon
              color="white"
              icon="mdi-content-save-all"
              size="large"
            />
            Save
          </primary-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>

  <base-dialog
    v-model="isDelete"
    ms="Are you sure you want to delete?"
    title="Tips"
  >
    <danger-button @click="isDelete = false">
      <v-icon color="white" icon="mdi-close-box-multiple" size="large" />
      Cancel
    </danger-button>
    <primary-button @click="deleteCustom">
      <v-icon
        color="white"
        icon="mdi-checkbox-multiple-marked"
        size="large"
      />
      Confirm
    </primary-button>
  </base-dialog>

  <!-- Uploading progress -->
  <uploading-progress
    v-model="showProgress"
    :upload-value="uploadValue"
  />
</template>

<script setup>
  import { useVuelidate } from '@vuelidate/core'
  import { required } from '@vuelidate/validators'
  import firebase from 'firebase'
  import { storeToRefs } from 'pinia'
  import { getCurrentInstance, ref } from 'vue'
  import { useCategoryStore } from '@/stores/category'
  import { useProductStore } from '@/stores/product'
  import http from '@/utils/http.js'

  // Variables
  const { storeProduct, updateProduct, resetProductForm } = useProductStore()
  const { dialog, productInForm, errProductCode } = storeToRefs(
    useProductStore(),
  )
  const instance = getCurrentInstance()
  const { categories } = storeToRefs(useCategoryStore())
  const showToolTip = ref(false)
  const imgPreview = ref(null)
  const showProgress = ref(false)
  const uploadValue = ref(0)
  const inputFile = ref(null)
  const isDelete = ref(false)
  const deleteCustIndex = ref(null)

  // Validation product
  const vp$ = useVuelidate(
    {
      name: { required },
      product_code: { required },
      category_id: { required },
      description: { required },
      is_active: { required },
    },
    productInForm,
  )
  // Clear product form
  const clearPruduct = () => {
    productInForm.value.product_customizes = []
    clearCustomize()
    errProductCode.value = ''
    imgPreview.value = null
    resetProductForm()
    vp$.value.$reset()
    dialog.value = false
  }

  // Validation product customize
  const findCustIndex = ref(null)
  const initialCustomize = {
    size: null,
    price: null,
  }
  const customize = ref({
    ...initialCustomize,
  })
  const vc$ = useVuelidate(
    {
      size: { required },
      price: { required },
    },
    customize,
  )

  // Clear product customize form
  const clearCustomize = () => {
    vc$.value.$reset()
    for (const [key, value] of Object.entries(initialCustomize)) {
      customize.value[key] = value
    }
  }

  // Method
  // Clicked upload image
  const uploadClicked = () => {
    inputFile.value.click()
  }

  // When upload image
  const imageUpload = e => {
    uploadValue.value = 0
    showProgress.value = true
    const file = e.target.files[0]
    if (file) {
      // Upload image to firebase storage
      const storageRef = firebase.storage().ref(`${file.name}`).put(file)
      storageRef.on(
        `state_changed`,
        snapshot => {
          uploadValue.value = Number.parseInt(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          )
        },
        error => {
          console.log(error.message)
        },
        () => {
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            showProgress.value = false
            uploadValue.value = 100
            productInForm.value.image = url
            imgPreview.value = url
          })
        },
      )
    }
  }

  // Add product customize
  const storeCustom = custIndex => {
    if (vc$.value.$errors.length === 0) {
      // Update customize
      if (custIndex === null) {
        // Create customize
        productInForm.value.product_customizes.push({ ...customize.value })
        clearCustomize()
        instance.root.$notif('Successful created', { type: 'success' })
      } else {
        productInForm.value.product_customizes[custIndex].size
          = customize.value.size
        productInForm.value.product_customizes[custIndex].price = Number(
          customize.value.price,
        )
        clearCustomize()
        instance.root.$notif('Successful updated', { type: 'success' })
      }
      findCustIndex.value = null
    }
  }
  // Delete product customize
  const deleteCustom = () => {
    const productCustomizeId
      = productInForm.value.product_customizes[deleteCustIndex.value]
        .product_customize_id
    if (productCustomizeId) {
      try {
        http.delete(`product_customizes/${productCustomizeId}`)
      } catch (error) {
        console.log(error)
      }
    }
    productInForm.value.product_customizes.splice(deleteCustIndex.value, 1)
    isDelete.value = false
    instance.root.$notif('Successful deleted', { type: 'success' })
  }
  // Edit product customize
  const editCustom = index => {
    findCustIndex.value = index
    customize.value.size = productInForm.value.product_customizes[index].size
    customize.value.price = Number(
      productInForm.value.product_customizes[index].price,
    )
  }

  // Save the product
  const save = async () => {
    // Check customize
    if (productInForm.value.product_customizes.length === 0) {
      vc$.value.$touch()
      instance.root.$notif('Please add a size', {
        type: 'error',
      })
    }
    if (
      vp$.value.$errors.length === 0
      && productInForm.value.product_customizes.length > 0
    ) {
      if (productInForm.value.image) {
        // Check the product id
        if (productInForm.value.product_id) {
          // Update the product
          await updateProduct(productInForm.value)
          instance.root.$notif('Successful updated', { type: 'success' })
        } else {
          // Create a new product
          await storeProduct(productInForm.value)
          instance.root.$notif('Successful created', { type: 'success' })
        }
        // Check the product code message
        if (!errProductCode.value) {
          dialog.value = false
          clearCustomize()
          clearPruduct()
        }
      } else {
        instance.root.$notif('Please upload image to continue', {
          type: 'error',
        })
      }
    }
  }
</script>

<style scoped>
.w-30 {
  width: 30%;
}

.cursor {
  cursor: pointer;
}

.w-40 {
  width: 30%;
}
</style>

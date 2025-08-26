<!-- Referemce: https://play.vuetifyjs.com/
<!- Dialog for update profile -->
<template>
  <!-- Form update profile -->
  <v-form>
    <!-- Dialog -->
    <v-dialog v-model="dialog" no-padding persistent width="550">
      <v-card class="h-auto rounded-lg d-flex flex-column bg-white">
        <!--Card title-->
        <v-card-title class="text-center mb-1 bg-red-accent-2">
          <span class="font-inter text-h6">Update Store</span>
        </v-card-title>
        <!--Card container-->
        <v-container class="mt-2">
          <v-row class="d-flex px-2 flex-column justify-center gap-2">
            <div class="gap-2 mt-2">
              <v-text-field
                v-model="storeInForm.name"
                class="text-black"
                density="compact"
                :error-messages="v$.name.$errors.map((e) => e.$message)"
                label="Name"
                variant="outlined"
                @blur="v$.name.$touch"
              />
              <v-text-field
                v-model="storeInForm.city"
                class="text-black mt-1"
                density="compact"
                :error-messages="v$.city.$errors.map((e) => e.$message)"
                label="City / Town"
                variant="outlined"
                @blur="v$.city.$touch"
              />
              <v-text-field
                v-model="storeInForm.street"
                class="text-black mt-1"
                density="compact"
                :error-messages="v$.street.$errors.map((e) => e.$message)"
                label="Street / Address"
                variant="outlined"
                @blur="v$.street.$touch"
              />
            </div>
          </v-row>
        </v-container>
        <v-card-actions class="bg-grey-lighten-2">
          <v-spacer />
          <!--Close button-->
          <danger-button @click="$emit('close-form')">
            <v-icon color="white" icon="mdi-close-box-multiple" size="large" />
            Close
          </danger-button>
          <!--Save button-->
          <primary-button
            class="mr-1"
            type="submit"
            @click="
              () => {
                v$.$validate();
                save();
              }
            "
          >
            <v-icon color="white" icon="mdi-content-save-all" size="large" />
            Save
          </primary-button>
        </v-card-actions>
        <!--Action-->
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script setup>
  import { useVuelidate } from '@vuelidate/core'
  import { required } from '@vuelidate/validators'
  import { storeToRefs } from 'pinia'
  import { useStoreStore } from '@/stores/store'

  // Variables
  const instance = getCurrentInstance()
  const { updateStore } = useStoreStore()
  const { storeInForm } = storeToRefs(useStoreStore())
  const emit = defineEmits(['close-form'])
  const props = defineProps(['isShowForm'])

  const rules = {
    name: { required },
    city: { required },
    street: { required },
  }

  const v$ = useVuelidate(rules, storeInForm)

  const save = async () => {
    if (v$.value.$errors.length === 0) {
      const { store_id, name, city, street } = storeInForm.value
      await updateStore({ store_id, name, city, street })
      instance.root.$notif('Successful updated', { type: 'success' })
      emit('close-form')
    }
  }

  // Computed
  const dialog = computed(() => {
    return props.isShowForm
  })
</script>

<style scoped>
.font-inter {
  font-family: "Inter", sans-serif !important;
}

.profile {
  background: #2c2c2c;
}

.input-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.input-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>

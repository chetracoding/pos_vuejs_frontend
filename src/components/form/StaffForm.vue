<!-- Referemce: https://play.vuetifyjs.com/
<!- Dialog for form create staff -->
<template>
  <!-- Form create staff -->
  <v-form>
    <!-- Dialog -->
    <v-dialog v-model="dialog" no-padding persistent width="800">
      <v-card
        class="rounded-lg bg-white"
        style="max-width: 100%; max-height: 100vh; overflow-y: auto"
      >
        <!--Card title-->
        <v-card-title class="text-center bg-red-accent-2">
          <span
            v-if="staffInForm.user_id"
            class="font-inter text-h6"
          >Update staff</span>
          <span v-else class="font-inter text-h6">Create new staff</span>
        </v-card-title>
        <div class="p-60">
          <!--Card container-->
          <v-container>
            <v-row class="d-flex px-2 mt-1 flex-column justify-center">
              <div class="input-group gap-2">
                <v-text-field
                  v-model="staffInForm.first_name"
                  class="text-black"
                  density="compact"
                  :error-messages="v$.first_name.$errors.map((e) => e.$message)"
                  label="First name"
                  variant="outlined"
                  @blur="v$.first_name.$touch"
                  @input="v$.first_name.$touch"
                />
                <!--Input last name field-->
                <v-text-field
                  v-model="staffInForm.last_name"
                  class="text-black"
                  density="compact"
                  :error-messages="v$.last_name.$errors.map((e) => e.$message)"
                  label="Last name"
                  variant="outlined"
                  @blur="v$.last_name.$touch"
                  @input="v$.last_name.$touch"
                />
                <!--Select gender field-->
                <v-select
                  v-model="staffInForm.gender"
                  class="text-black"
                  density="compact"
                  :error-messages="v$.gender.$errors.map((e) => e.$message)"
                  :items="['Male', 'Female', 'Other']"
                  label="Gender"
                  variant="outlined"
                  @blur="v$.gender.$touch"
                  @input="v$.gender.$touch"
                />
              </div>
              <!--Input email field-->
              <v-text-field
                v-model="staffInForm.email"
                class="mt-2 text-black"
                density="compact"
                :error-messages="`${v$.email.$errors.map(
                  (e) => e.$message
                )}${errMessage}`"
                label="Email"
                variant="outlined"
                @blur="v$.email.$touch"
                @input="
                  v$.email.$touch;
                  errMessage = '';
                "
              />
              <!--Input field password-->
              <v-text-field
                v-model="staffInForm.password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="mt-2 text-black"
                density="compact"
                :error-messages="v$.password.$errors.map((e) => e.$message)"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                @blur="v$.password.$touch"
                @click:append-inner="showPassword = !showPassword"
                @input="v$.password.$touch"
              />
              <!--Select role field-->
              <v-select
                v-model="staffInForm.role_id"
                class="mt-2 text-black text-capitalize"
                density="compact"
                :error-messages="v$.role_id.$errors.map((e) => e.$message)"
                :item-title="'name'"
                item-value="_id"
                :items="roles"
                label="Role"
                variant="outlined"
                @blur="v$.role_id.$touch"
                @input="v$.role_id.$touch"
              />
            </v-row>
          </v-container>
          <v-card-actions class="bg-grey-lighten-2">
            <v-spacer />
            <!--Close button-->
            <danger-button
              @click="
                clear();
                $emit('close-form');
              "
            >
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
        </div>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script setup>
// import { onMounted } from "vue";
  import { useVuelidate } from '@vuelidate/core'
  import { email, minLength, required } from '@vuelidate/validators'
  import { useRoleStore } from '@/stores/role'
  import { useUserStore } from '@/stores/user'
  // import { storeToRefs } from "pinia";

  // Variables
  const instance = getCurrentInstance()
  const { addStaff, updateStaff, clearForm } = useUserStore()
  const { getRoles } = useRoleStore()
  const { staffInForm, errMessage } = storeToRefs(useUserStore())
  const { roles } = storeToRefs(useRoleStore())
  const emit = defineEmits(['close-form'])
  const props = defineProps(['isShowForm'])
  const showPassword = ref(false)

  const rules = {
    first_name: { required },
    last_name: { required },
    gender: { required },
    email: { required, email },
    password: { required, minLength: minLength(8) },
    role_id: { required },
  }

  const v$ = useVuelidate(rules, staffInForm)

  // Methods
  // Clear staff form
  const clear = () => {
    clearForm()
    v$.value.$reset()
    errMessage.value = ''
    emit('close-form')
  }

  // Create or Update staff
  const save = async () => {
    // Update staff
    if (staffInForm.value.user_id) {
      if (v$.value.$errors.length === 1) {
        // Not required password field value for update staff
        if (v$.value.$errors[0].$uid === 'password-required') {
          v$.value.$errors[0].$message = ''
          updated()
        }
      // Check all input field if the user change password
      } else if (v$.value.$errors.length === 0) {
        updated()
      }
    } else {
      // Create staff
      if (v$.value.$errors.length === 0) {
        await addStaff(staffInForm.value)
        instance.root.$notif('Successful created', { type: 'success' })
        if (!errMessage.value) {
          clear()
        }
      }
    }
  }
  // Call updated staff
  const updated = async () => {
    await updateStaff(staffInForm.value)
    instance.root.$notif('Successful updated', { type: 'success' })
    if (!errMessage.value) {
      clear()
    }
  }

  // Computed
  const dialog = computed(() => {
    return props.isShowForm
  })

  // Lifecycle hook
  onMounted(() => {
    getRoles()
  })
</script>

<style scoped>
.font-inter {
  font-family: "Inter", sans-serif !important;
}

.input-group {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>

<template>
  <!-- Form update profile -->
  <v-form>
    <!-- Dialog -->
    <v-dialog v-model="dialog" no-padding persistent width="550">
      <v-card class="h-auto rounded-lg d-flex flex-column bg-white">
        <!--Card title-->
        <v-card-title class="text-center mb-1 bg-red-accent-2">
          <span class="font-inter text-h6">Update Profile</span>
        </v-card-title>
        <!--Card container-->
        <v-container class="mt-2">
          <v-row class="d-flex px-2 flex-column justify-center gap-2">
            <v-tooltip v-model="showToolTip" location="center">
              <template #activator="{ props: tootipProps }">
                <v-avatar
                  v-bind="tootipProps"
                  class="profile align-self-center"
                  elevation="24"
                  size="150"
                >
                  <v-img
                    v-if="userProfileInForm.image"
                    alt="user profile"
                    cover
                    :src="userProfileInForm.image"
                  />
                  <span v-else class="text-h2 text-white">{{ initials }}</span>

                  <input
                    accept="image/png, image/jpeg"
                    class="input-image"
                    type="file"
                    @change="imageUpload($event)"
                  >
                </v-avatar>
              </template>
              <div class="py-2 d-flex flex-column align-center">
                <v-icon
                  class="text-h4"
                  color="white"
                  icon="mdi-camera-image"
                />
                <span>Upload image</span>
              </div>
            </v-tooltip>
            <div class="gap-2 mt-2">
              <div class="input-group gap-2">
                <!--Input first name field-->
                <v-text-field
                  v-model="userProfileInForm.first_name"
                  class="text-black"
                  density="compact"
                  :error-messages="v$.first_name.$errors.map((e) => e.$message)"
                  label="First name"
                  variant="outlined"
                  @blur="v$.first_name.$touch"
                />
                <!--Input last name field-->
                <v-text-field
                  v-model="userProfileInForm.last_name"
                  class="text-black"
                  density="compact"
                  :error-messages="v$.last_name.$errors.map((e) => e.$message)"
                  label="Last name"
                  variant="outlined"
                  @blur="v$.last_name.$touch"
                />
              </div>
              <!--Select gender field-->
              <v-select
                v-model="userProfileInForm.gender"
                class="text-black mt-2"
                density="compact"
                :error-messages="v$.gender.$errors.map((e) => e.$message)"
                :items="['Male', 'Female', 'Other']"
                label="Gender"
                variant="outlined"
                @blur="v$.gender.$touch"
              />
              <!--Input email field-->
              <v-text-field
                v-model="userProfileInForm.email"
                class="mt-1 text-black"
                density="compact"
                :error-messages="`${v$.email.$errors.map(
                  (e) => e.$message
                )}${errMessage}`"
                label="Email"
                variant="outlined"
                @blur="v$.email.$touch"
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

  <!-- Uploading progress -->
  <uploading-progress
    v-model="showProgress"
    :upload-value="uploadValue"
  />
</template>

<script setup>
  import { useVuelidate } from '@vuelidate/core'
  import { email, required } from '@vuelidate/validators'
  import firebase from 'firebase'
  import { storeToRefs } from 'pinia'
  // Import
  import { getCurrentInstance, onMounted, ref } from 'vue'
  import { useRoleStore } from '@/stores/role'
  import { useUserStore } from '@/stores/user'

  // Variables
  const instance = getCurrentInstance()
  const { updateProfile } = useUserStore()
  const { getRoles } = useRoleStore()
  const { userProfileInForm, errMessage } = storeToRefs(useUserStore())
  const emit = defineEmits(['close-form'])
  const props = defineProps(['isShowForm', 'initials'])
  const showToolTip = ref(false)
  const showProgress = ref(false)
  const uploadValue = ref(0)

  const rules = {
    first_name: { required },
    last_name: { required },
    gender: { required },
    email: { required, email },
  }

  const v$ = useVuelidate(rules, userProfileInForm)

  const save = async () => {
    if (v$.value.$errors.length === 0) {
      const { user_id, first_name, last_name, gender, email, image }
        = userProfileInForm.value
      await updateProfile({
        user_id,
        first_name,
        last_name,
        gender,
        email,
        image,
      })
      instance.root.$notif('Successful updated', { type: 'success' })
      if (!errMessage.value) {
        emit('close-form')
      }
    }
  }

  // Computed
  const dialog = computed(() => {
    return props.isShowForm
  })

  // Method
  // When upload image
  const imageUpload = e => {
    uploadValue.value = 0
    showProgress.value = true
    const file = e.target.files[0]
    if (file) {
      // Reference: https://medium.com/@choolakejay/upload-images-to-firebase-storage-with-vue-js-afb914566d9
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
            userProfileInForm.value.image = url
          })
        },
      )
    }
  }

  // Lifecycle hook
  onMounted(async () => {
    getRoles()
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

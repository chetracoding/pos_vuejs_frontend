<template>
  <div class="h-screen bg-grey-lighten-1 d-flex flex-column align-center">
    <div class="w-100 bg-grey-lighten-1">
      <v-icon
        class="text-h4 text-black ml-5 mt-3"
        icon="mdi-keyboard-backspace"
        @click="comeback"
      />
    </div>
    <v-form
      class="form d-flex flex-column align-center rounded-lg m-auto w-40 px-8 py-10"
      @submit.prevent="change"
    >
      <div class="d-flex text-center flex-column align-center justify-center">
        <v-icon
          class="logo mb-2 text-red-accent-2"
          icon="mdi-shield-lock"
        />
        <h2>Change new password</h2>
      </div>
      <div class="w-100">
        <v-text-field
          v-model="passwords.currentPassword"
          :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
          class="text-black"
          density="compact"
          :error-messages="v$.currentPassword.$errors.map((e) => e.$message)"
          placeholder="Current password"
          prepend-inner-icon="mdi-lock-outline"
          :type="showCurrentPassword ? 'text' : 'password'"
          variant="outlined"
          @blur="v$.currentPassword.$touch"
          @click:append-inner="showCurrentPassword = !showCurrentPassword"
          @input="v$.currentPassword.$touch"
        />
        <v-text-field
          v-model="passwords.newPassword"
          :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
          class="text-black mt-2"
          density="compact"
          :error-messages="v$.newPassword.$errors.map((e) => e.$message)"
          placeholder="New password"
          prepend-inner-icon="mdi-lock-outline"
          :type="showNewPassword ? 'text' : 'password'"
          variant="outlined"
          @blur="v$.newPassword.$touch"
          @click:append-inner="showNewPassword = !showNewPassword"
          @input="v$.newPassword.$touch"
        />
        <v-text-field
          v-model="passwords.confirmPassword"
          :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
          class="text-black mt-2"
          density="compact"
          :error-messages="v$.confirmPassword.$errors.map((e) => e.$message)"
          placeholder="Confirm password"
          prepend-inner-icon="mdi-lock-check-outline"
          :rules="[passwordConfirmationRule]"
          :type="showConfirm ? 'text' : 'password'"
          variant="outlined"
          @blur="v$.confirmPassword.$touch"
          @click:append-inner="showConfirm = !showConfirm"
          @input="v$.confirmPassword.$touch"
        />
      </div>
      <primary-button
        block
        class="mt-2"
        :disabled="success"
        size="large"
        type="medium"
        @click="v$.$touch()"
      >
        <v-icon class="mr-2" icon="mdi-lock-reset" />
        CHANGE
      </primary-button>
    </v-form>
  </div>
</template>

<script setup>
  import useVuelidate from '@vuelidate/core'
  import { minLength, required } from '@vuelidate/validators'
  import { storeToRefs } from 'pinia'
  import { getCurrentInstance, reactive, ref } from 'vue'
  import router from '@/router'
  import { useUserStore } from '@/stores/user'
  import http from '@/utils/http.js'

  // Variables
  const instance = getCurrentInstance()
  const { userData } = storeToRefs(useUserStore())
  const success = ref(false)
  const showCurrentPassword = ref(false)
  const showNewPassword = ref(false)
  const showConfirm = ref(false)
  const initialsPassword = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  const passwords = reactive({
    ...initialsPassword,
  })
  const rules = {
    currentPassword: { required },
    newPassword: { required, minLength: minLength(8) },
    confirmPassword: { required },
  }
  const v$ = useVuelidate(rules, passwords)
  // Validation confirm password
  const passwordConfirmationRule = () => {
    return passwords.newPassword === passwords.confirmPassword ? true : 'Confirm password must be match.'
  }

  // Method
  const change = async () => {
    if (v$.value.$errors.length === 0 && passwordConfirmationRule() === true) {
      const changePassword = {
        old_pwd: passwords.currentPassword,
        new_pwd: passwords.newPassword,
      }
      try {
        const res = await http.post('auth/change-pwd', changePassword)
        instance.root.$notif('Successful updated', { type: 'success' })
        if (res.data.success) {
          success.value = true
          router.push(
            router.options.routes.find(
              r =>
                r.meta
                && r.meta.role === userData.value.role.name
                && r.meta.defaultPage,
            ).path,
          )
        }
      } catch (error) {
        if (error.response.status === 400) {
          instance.root.$notif('Your current password is incorrect', {
            type: 'error',
          })
        }
      }
    }
  }
  const comeback = () => {
    router.go(-1)
  }
</script>

<style scoped>
.w-40 {
  width: 40%;
}

.logo {
  font-size: 10rem;
}

.cursor {
  cursor: pointer;
}

@media screen and (max-width: 900px) {
  .form {
    width: 60%;
  }
}

@media screen and (max-width: 430px) {
  .form {
    width: 100%;
  }
}
</style>

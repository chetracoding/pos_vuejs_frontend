<template>
  <div class="h-screen text-white w-100 d-flex">
    <div class="bg-img" />

    <div class="login-form d-flex justify-center align-center bg-white">
      <v-form ref="form" class="form w-100 px-16 py-10">
        <div class="d-flex justify-center mb-12">
          <v-img :height="140" src="@/assets/images/logo.png" />
        </div>
        <div class="mt-4">
          <v-text-field
            v-model="credentials.email"
            name="username"
            class="text-black placeholer-capitalize"
            density="compact"
            :placeholder="$t('app.auth.email')"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            autocomplete="username"
            :rules="rules.email"
          />
        </div>

        <div>
          <div class="text-medium-emphasis d-flex align-center justify-end">
            <span
              class="cursor text-primary"
              @click="$router.push({ name: 'ForgotPasswordView' })"
            >
              {{ $t('app.auth.forgot.forgot') }}</span
            >
          </div>
          <v-text-field
            v-model="credentials.password"
            name="password"
            class="text-black"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            density="compact"
            :placeholder="$t('app.auth.password')"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            autocomplete="current-password"
            @click:append-inner="showPassword = !showPassword"
            :rules="rules.password"
          />
        </div>

        <v-btn
          class="mt-2"
          color="primary text-none"
          size="large"
          block
          rounded="3"
          :loading="loading"
          @click="connect"
        >
          <v-icon icon="mdi-login-variant" class="mr-2" />
          Login
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, getCurrentInstance, reactive, computed } from 'vue'
  import http from '@/utils/http.js'
  import { FORM_RULES } from '@/validators/form-rules.js'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { t } from '../../plugins/i18n'
  import { ROLE_NAME } from '@/constants/index.js'
  import { useCookieStore } from '@/stores/cookie'
  import { useUserStore } from '@/stores/user'

  const instance = getCurrentInstance()
  const { user } = storeToRefs(useUserStore())
  const cookieStore = useCookieStore()
  const router = useRouter()
  const form = ref(null)
  const showPassword = ref(false)
  const loading = ref(false)
  const credentials = reactive({
    email: '',
    password: '',
  })
  const defaultRoute = reactive({
    [ROLE_NAME.SUPER_ADMIN]: 'HomeView',
    [ROLE_NAME.ADMIN]: 'HomeView',
    [ROLE_NAME.CASHIER]: 'OrdersView',
    [ROLE_NAME.CHEF]: 'ChefView',
    [ROLE_NAME.WAITER]: 'WaiterView',
  })
  const rules = computed(() => {
    return {
      email: [(v) => !!v || 'Please enter your email', FORM_RULES.email],
      password: [(v) => !!v || 'Please enter your password'],
    }
  })

  const connect = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    try {
      loading.value = true
      const res = await http.post('auth/login', credentials)
      const { token, data } = res.data
      const { user: userData, role, permissions } = data

      cookieStore.setCookie('token', token, 30)
      cookieStore.setCookie('user', userData, 30)
      cookieStore.setCookie('role', role, 30)
      cookieStore.setCookie('permissions', permissions, 30)
      user.value.data = userData
      user.value.token = token
      user.value.role = role
      user.value.permissions = permissions

      router.push({ name: defaultRoute[role.name] })
    } catch (err) {
      if (err.response.data.message) {
        instance.root.$notif(t('app.rules.loginFail'), { type: 'error' })
      }
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .login-form {
    width: 35%;
  }

  .bg-img {
    width: 65%;
    background-image: url('@/assets/images/login_bg.jpg');
    background-size: cover;
    filter: brightness(80%);
    background-position: center;
  }

  .cursor {
    cursor: pointer;
  }

  @media screen and (max-width: 900px) {
    .bg-img {
      display: none;
    }

    .login-form {
      width: 100%;
    }

    .form {
      width: 60% !important;
    }
  }

  @media screen and (max-width: 430px) {
    .form {
      width: 100% !important;
    }
  }
</style>

<template>
  <v-card class="bg-white mb-2" height="8vh" rounded="4">
    <div
      :class="`h-100 w-100 pa-3 d-flex align-center justify-space-between ${props.class}`"
    >
      <span>{{ props.title }}</span>
      <div class="w-50">
        <slot />
      </div>
      <div>
        <v-menu rounded>
          <template #activator="{ props: menuProps }">
            <v-btn v-bind="menuProps" color="primary" icon size="small">
              <v-avatar class="profile" color="primary">
                <v-img
                  v-if="userData.image"
                  :alt="userData.first_name"
                  cover
                  :src="userData.image"
                />
                <span v-else class="text-white">{{ initials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card class="bg-grey-darken-2 rounded-lg mt-3 px-5 py-2">
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar class="profile" size="72">
                  <v-img
                    v-if="userData.image"
                    :alt="userData.first_name"
                    cover
                    :src="userData.image"
                  />
                  <span v-else class="text-h4 text-white">{{ initials }}</span>
                </v-avatar>
                <h3>{{ userData.first_name }} {{ userData.last_name }}</h3>
                <p class="font-inter text-subtitle-1 mt-1">
                  {{ userData.email }}
                </p>
                <p
                  class="text-left ml-5 font-inter cursor text-subtitle-1 mt-1"
                  @click="$router.push('/manage_account')"
                >
                  <v-icon color="white" icon="mdi-cog" size="small" />
                  {{ $t('app.header.sitting.manageAcc') }}
                </p>
                <p
                  class="text-left ml-5 font-inter cursor text-subtitle-1"
                  @click="$router.push('/store')"
                >
                  <v-icon
                    color="white"
                    icon="mdi-store-cog"
                    size="small"
                  />
                  {{ $t('app.header.sitting.manageStore') }}
                </p>
                <p
                  class="text-left ml-5 font-inter cursor text-subtitle-1"
                  @click="$router.push('/change_password')"
                >
                  <v-icon
                    color="white"
                    icon="mdi-shield-lock-outline"
                    size="small"
                  />
                  {{ $t('app.header.sitting.password') }}
                </p>
                <v-divider class="my-3" />
                <div class="d-flex justify-center">
                  <danger-button @click="isLogout = true">
                    <v-icon
                      color="white"
                      icon="mdi-logout"
                      size="large"
                    />
                    {{ $t('app.auth.logout') }}
                  </danger-button>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </div>
  </v-card>

  <base-dialog
    v-model="isLogout"
    ms="Are you sure you want to log out?"
    title="Log out"
  >
    <danger-button @click="isLogout = false">
      <v-icon color="white" icon="mdi-close-box-multiple" size="large" />
      Cancel
    </danger-button>
    <primary-button @click="logout">
      <v-icon
        color="white"
        icon="mdi-checkbox-multiple-marked"
        size="large"
      />
      Confirm
    </primary-button>
  </base-dialog>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { useCookieStore } from '@/stores/cookie'
  import { useUserStore } from '@/stores/user'

  // Variables
  const props = defineProps(['title', 'class'])
  const isLogout = ref(false)
  const router = useRouter()
  const { removeCookie } = useCookieStore()
  const { userData } = storeToRefs(useUserStore())
  const initials = computed(() => {
    const { first_name, last_name } = userData.value
    return (
      first_name.slice(0, 1).toUpperCase() + last_name.slice(0, 1).toUpperCase()
    )
  })

  // Method
  const logout = async () => {
    try {
      // await http.post("logout");
      isLogout.value = false
      removeCookie('token')
      removeCookie('user_role')
      removeCookie('user')
      router.push('/login')
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style scoped>
  .font-inter {
    font-family: 'Inter', 'Noto Serif Khmer', sans-serif, serif !important;
  }
  .profile {
    background: #2c2c2c;
  }
  .cursor {
    cursor: pointer;
  }
</style>

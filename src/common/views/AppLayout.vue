<template>
  <v-layout>
    <ResOwnerSideBar />

    <v-main class="mx-2">
      <!-- <header-component :title="$t('app.crud.category.title')">
      </header-component> -->

      <main class="d-flex flex-column mt-2">
        <RouterView />
      </main>
    </v-main>
  </v-layout>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import ResOwnerSideBar from '@/components/aside/ResOwnerSideBar.vue'
</script>

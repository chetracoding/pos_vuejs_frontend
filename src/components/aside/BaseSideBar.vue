<template>
  <v-navigation-drawer
    class="bg-white"
    width="100"
    mobile-breakpoint="xs"
    permanent
    rounded="4"
    elevation="1"
  >
    <div class="d-flex flex-column align-center ma-1">
      <v-list-item
        v-for="item in menus"
        :key="item"
        :to="item.link"
        active-class="bg-primary"
        width="84px"
        height="70px"
        class="text-decoration-none mb-1"
        rounded="4"
      >
        <div class="d-flex flex-column align-center" width="10px">
          <v-icon :icon="item.icon" size="small" />
          <span class="label">{{ item.title }}</span>
        </div>
      </v-list-item>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
  import { defineProps } from 'vue'
  defineProps(['menus'])
</script>

<style scoped>
  .label {
    font-size: 12px;
  }
</style>

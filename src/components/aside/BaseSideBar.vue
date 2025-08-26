<template>
  <v-navigation-drawer
    class="bg-white"
    elevation="1"
    mobile-breakpoint="xs"
    permanent
    rounded="4"
    width="100"
  >
    <div class="d-flex flex-column align-center ma-1">
      <v-list-item
        v-for="item in menus"
        :key="item"
        active-class="bg-primary"
        class="text-decoration-none mb-1"
        height="70px"
        rounded="4"
        :to="item.link"
        width="84px"
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
  defineProps(['menus'])
</script>

<style scoped>
  .label {
    font-size: 12px;
  }
</style>

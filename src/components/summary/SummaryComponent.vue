<template>
  <!-- Summary -->
  <v-navigation-drawer class="h-auto bg-transparent ml-2 mt-2" location="right" permanent width="285">
    <div class="d-flex mt-1 justify-space-between">
      <h6 class="text-white">{{ title }}</h6>
      <slot name="btn" />
    </div>
    <slot name="content" />
  </v-navigation-drawer>
</template>

<script setup>
  defineProps(['title'])
</script>

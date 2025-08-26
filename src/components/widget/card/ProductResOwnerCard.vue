<template>
  <v-sheet class="bg-grey-darken-2 rounded-lg p-2 w-auto">
    <v-img class="rounded-lg" cover height="200" :src="product.image" />

    <h6 class="font-weight-bold mt-1">{{ product.name }}</h6>
    <v-row>
      <v-col cols="6">
        {{ product.product_code }}
      </v-col>

      <v-col v-if="product.product_customizes.length > 1" class="text-right" cols="6">
        {{ product.product_customizes.length }} sizes
      </v-col>
      <v-col v-else class="text-right" cols="6">
        {{ product.product_customizes.length }} size
      </v-col>
    </v-row>
    <slot />
  </v-sheet>
</template>

<script setup>
  defineProps(['product'])
</script>

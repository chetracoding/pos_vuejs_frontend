<template>
  <v-snackbar
    :color="`${getColor(props.type)} alert`"
    location="top right"
    min-width="auto"
    rounded="xg"
    :timeout="5000"
  >
    <div class="d-flex align-center cus-text w-100">
      <slot />
    </div>
    <template #actions>
      <v-btn variant="text" @click="emit('hide-snackbar')">
        <v-icon class="text-h4 mdi mdi-close-circle" />
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
  const emit = defineEmits(['hide-snackbar'])
  const props = defineProps({
    type: {
      type: String,
      default: 'success',
    },
  })

  const getColor = type => {
    const types = {
      success: 'success',
      warning: 'deep-orange',
      error: 'red',
    }
    return types[type] || 'success'
  }
</script>
<style>
.alert {
  margin-top: 65px;
}

@media screen and (max-width: 430px) {
  .cus-text > h5 {
    font-size: 16px !important;
  }
}
</style>

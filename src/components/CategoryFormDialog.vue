<script setup>
  import { useRules } from 'vuetify/labs/rules'
  import { defineEmits, defineProps } from 'vue'
  const rules = useRules()

  const emit = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
  })

  // method
  const close = () => {
    emit('update:modelValue', false)
  }
</script>

<template>
  <v-dialog :model-value="props.modelValue" max-width="600" persistent>
    <v-card title="Create new category" rounded="4">
      <v-card-text>
        <v-form>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                label="Name *"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required()]"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn text="Close" color="error" variant="tonal" @click="close" />

        <v-btn
          class="text-none"
          color="primary"
          text="Save"
          variant="flat"
          @click="close"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

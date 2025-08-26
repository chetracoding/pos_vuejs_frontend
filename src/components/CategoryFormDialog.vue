<template>
  <v-dialog :model-value="props.modelValue" max-width="600" persistent>
    <v-card :title="title" rounded="4">
      <v-card-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Name *"
                variant="outlined"
                density="comfortable"
                :rules="[FORM_RULES.required]"
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
          @click="save"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { defineEmits, defineProps, ref } from 'vue'
  import { FORM_RULES } from '@/validators/form-rules.js'
  import { useCategoryStore } from '@/stores/index.js'

  const { createCategory } = useCategoryStore()

  const emit = defineEmits(['update:modelValue', 'load'])
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object,
      required: false,
      default: () => ({
        name: '',
      }),
    },
  })
  const formRef = ref(null)
  const form = ref({
    name: props.form?.name || '',
  })
  const isCreated = ref(props.form ? false : true)
  const title = ref(isCreated.value ? 'Create new category' : 'Edit category')

  // method
  const close = () => {
    emit('update:modelValue', false)
  }
  const save = async () => {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    if (isCreated.value) {
      await createCategory(form.value)
    }

    emit('load')
    console.log(form.value)
  }
</script>

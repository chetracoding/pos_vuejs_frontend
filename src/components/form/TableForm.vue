<template>
  <v-form>
    <v-dialog v-model="dialog" persistent width="400">
      <v-card class="rounded-lg">
        <v-card-title class="text-center bg-red-accent-2">
          <span v-if="tableInForm.table_id" class="text-h6">Update table</span>
          <span v-else class="text-h6">Create new table</span>
        </v-card-title>
        <div>
          <v-col class="mt-2" cols="12">
            <v-text-field
              v-model="tableInForm.table_number"
              class="mt-2 text-black"
              density="compact"
              :error-messages="`${v$.table_number.$errors.map(
                (e) => e.$message
              )}${errMessage}`"
              label="Number"
              required
              variant="outlined"
              @blur="v$.table_number.$touch"
              @input="
                v$.table_number.$touch;
                errMessage = '';
              "
            />
          </v-col>
          <v-card-actions class="bg-grey-lighten-2 p-2">
            <v-spacer />
            <danger-button @click="close()">
              <v-icon
                color="white"
                icon="mdi-close-box-multiple"
                size="large"
              />
              CLOSE
            </danger-button>
            <primary-button
              @click="
                v$.$validate();
                save();
              "
            >
              <v-icon
                color="white"
                icon="mdi-content-save-all"
                size="large"
              />
              SAVE
            </primary-button>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script setup>
  import useVuelidate from '@vuelidate/core'
  import { required } from '@vuelidate/validators'
  import { storeToRefs } from 'pinia'
  import { useTableStore } from '@/stores/table'

  // Variables
  const instance = getCurrentInstance()
  const { storeTable, updateTable, clearForm } = useTableStore()
  const { errMessage, tableInForm } = storeToRefs(useTableStore())
  const emit = defineEmits(['close-form'])
  const props = defineProps(['isShowForm'])

  const rules = {
    table_number: { required },
  }
  const v$ = useVuelidate(rules, tableInForm)

  // method
  const save = async () => {
    if (tableInForm.value.table_number) {
      if (tableInForm.value.table_id) {
        await updateTable(tableInForm.value)
        instance.root.$notif('Successful updated', { type: 'success' })
      } else {
        await storeTable(tableInForm.value)
        instance.root.$notif('Successful created', { type: 'success' })
      }
      if (!errMessage.value) {
        emit('close-form')
        close()
      }
    }
  }

  const close = () => {
    clearForm()
    v$.value.$reset()
    errMessage.value = ''
    emit('close-form')
  }
  // computed
  const dialog = computed(() => {
    return props.isShowForm
  })
</script>

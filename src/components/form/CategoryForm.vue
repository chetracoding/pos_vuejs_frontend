<template>
  <v-dialog v-model="dialog" persistent width="400">
    <v-card class="rounded-lg">
      <v-card-title class="text-center bg-red-accent-2">
        <span
          v-if="categoryInForm.category_id"
          class="text-h6"
        >Update category</span>
        <span v-else class="text-h6 font-inter">{{
          $t("app.crud.category.form.title")
        }}</span>
      </v-card-title>
      <div>
        <v-col class="mt-2" cols="12">
          <v-text-field
            v-model="categoryInForm.name"
            class="mt-2 text-black"
            density="compact"
            :error-messages="`${v$.name.$errors.map(
              (e) => e.$message
            )}${errMessage}`"
            :label="$t('app.crud.category.form.name')"
            required
            variant="outlined"
            @blur="v$.name.$touch"
            @input="
              v$.name.$touch;
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
            <span class="text-uppercase">
              {{ $t("app.btn.close") }}
            </span>
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
            <span class="text-uppercase">
              {{ $t("app.btn.save") }}
            </span>
          </primary-button>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import useVuelidate from '@vuelidate/core'
  import { required } from '@vuelidate/validators'
  import { storeToRefs } from 'pinia'
  import { computed, getCurrentInstance } from 'vue'
  import { useCategoryStore } from '@/stores/category'

  export default {
    props: {
      isShowForm: Boolean,
      isUpdate: Boolean,
    },
    emits: ['close-form'],
    setup (props, { emit }) {
      // data
      const { categoryInForm, errMessage } = storeToRefs(useCategoryStore())
      const instance = getCurrentInstance()
      const rules = {
        name: { required },
      }
      const v$ = useVuelidate(rules, categoryInForm)

      // methods
      const { storeCategory, updateCategory, clearForm } = useCategoryStore()
      async function save () {
        if (categoryInForm.value.name) {
          if (categoryInForm.value.category_id) {
            await updateCategory(categoryInForm.value)
            instance.root.$notif('Successful updated', { type: 'success' })
          } else {
            await storeCategory(categoryInForm.value)
            instance.root.$notif('Successful created', { type: 'success' })
          }
          if (!errMessage.value) {
            close()
          }
        }
      }
      function close () {
        clearForm()
        v$.value.$reset()
        errMessage.value = ''
        emit('close-form')
      }

      // computed
      const dialog = computed(() => {
        return props.isShowForm
      })

      return {
        // data
        dialog,
        categoryInForm,
        errMessage,
        v$,

        // methods
        save,
        close,
      }
    },
  }
</script>

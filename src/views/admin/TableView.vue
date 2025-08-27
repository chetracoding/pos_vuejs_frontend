<template>
  <BaseHeader :title="$t('app.crud.table.title')" />

  <div v-if="tables.length > 0" class="grid-container gap-2">
    <table-card v-for="table in tables" :key="table._id" :table="table">
      <div class="d-flex justify-space-between align-center mt-2">
        <!-- close dialo delete table -->
        <dark-button @click="onEdit(table)">
          <v-icon
            color="white"
            icon="mdi-square-edit-outline"
            size="large"
          />
          Edit
        </dark-button>
        <danger-button @click="onDelete(table._id)">
          <v-icon color="white" icon="mdi-delete-forever" size="large" />
          Delete
        </danger-button>
      </div>
    </table-card>
  </div>

  <!-- list table empty -->
  <div v-else class="w-100">
    <h4 class="text-center mt-5 text-white">No table available.</h4>
  </div>

  <!-- <summary-component class="mt-2" title="Table Summary">
          <template v-slot:btn>
            <secondary-button @click="isShowForm = true">
              <v-icon
                icon="mdi-plus-box-multiple"
                color="white"
                size="large"
              ></v-icon>
              Add More
            </secondary-button>
          </template>
          <template v-slot:content>
            <div
              class="bg-grey-darken-2 mt-3 py-3 rounded-lg d-flex justify-space-between align-center"
            >
              <span class="ml-2">Total</span>
              <span v-if="tables.length > 1" class="mr-2"
                >{{ tables.length }} items</span
              >
              <span v-else class="mr-2">{{ tables.length }} item</span>
            </div>
          </template>
        </summary-component> -->

  <base-dialog
    v-model="dialog"
    ms="Are you sure you want to delete?"
    title="Tips"
  >
    <danger-button class="justify-end" @click="dialog = false">
      <v-icon color="white" icon="mdi-close-box-multiple" size="large" />
      Cancel
    </danger-button>
    <primary-button @click="deleted">
      <v-icon
        color="white"
        icon="mdi-checkbox-multiple-marked"
        size="large"
      />
      Confirm
    </primary-button>
  </base-dialog>

  <!-- form create table -->
  <table-form :is-show-form="isShowForm" @close-form="closeForm" />
</template>

<script setup>
  import { useTableStore } from '@/stores/table'

  // Variables
  const instance = getCurrentInstance()
  const isShowForm = ref(false)
  const { getTables, deleteTable } = useTableStore()
  const { tables, tableInForm } = storeToRefs(useTableStore())
  const tableId = ref(null)
  const dialog = ref(false)

  // methods
  const onDelete = id => {
    tableId.value = id
    dialog.value = true
  }
  const deleted = () => {
    if (tableId.value != null) {
      const id = tableId.value
      deleteTable(id)
      instance.root.$notif('Successful deleted', { type: 'success' })
    }
    dialog.value = false
  }

  const onEdit = table => {
    const { _id, table_number } = table
    tableInForm.value = { table_id: _id, table_number }
    isShowForm.value = true
  }

  const closeForm = () => {
    isShowForm.value = false
  }

  // Lifecycle hook
  onMounted(() => {
    getTables()
  })
</script>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  .card-summary {
    background: #2c2c2c;
  }

  .search {
    background: #2c2c2c;
  }
</style>

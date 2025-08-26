<template>
  <BaseHeader :title="$t('app.crud.category.title')" />

  <div class="app-wrapper">
    <div>
      <div class="d-flex justify-end mb-2">
        <v-btn
          v-if="isFilter"
          class="text-none mr-2"
          color="error"
          prepend-icon="mdi-filter-remove-outline"
          variant="outlined"
          @click="clearFilter"
        >
          Clear
        </v-btn>

        <v-btn
          class="text-none mr-2"
          color="warning"
          prepend-icon="mdi-filter-outline"
          :variant="isFilter ? 'flat' : 'outlined'"
          @click="isFilter = !isFilter"
        >
          Filter
        </v-btn>
        <v-btn
          class="text-none"
          color="primary"
          prepend-icon="mdi-plus"
          @click="onCreate"
        >
          Create
        </v-btn>
      </div>

      <v-card v-if="isFilter" rounded="3" class="mb-2 pa-3">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="filter.id"
              label="Identifier"
              variant="outlined"
              hide-details="auto"
              density="comfortable"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="filter.name"
              label="Name"
              variant="outlined"
              hide-details="auto"
              density="comfortable"
              @update:model-value="search"
            />
          </v-col>
        </v-row>
      </v-card>
    </div>

    <div class="bottom">
      <DataTable
        v-model:options="options"
        :headers="headers"
        :items="categories"
        :items-length="totalCount"
        :loading="loading"
        :items-per-page-options="[10, 20, 50, 100]"
        @update:options="search"
      >
        <template #[`item.actions`]="{ item }">
          <v-icon-btn
            icon="mdi-pencil"
            color="warning"
            variant="text"
            @click="onEdit(item)"
          />
          <v-icon-btn
            icon="mdi-delete"
            color="error"
            variant="text"
            @click="onDelete(item._id)"
          />
        </template>
      </DataTable>
    </div>
  </div>

  <CategoryFormDialog
    v-model="isShowDialog"
    v-if="isShowDialog"
    :form="editItem"
    @load="search"
  />
</template>

<script setup>
  import BaseHeader from '@/components/BaseHeader.vue'
  import DataTable from '@/components/DataTable.vue'
  import CategoryFormDialog from '@/components/CategoryFormDialog.vue'
  import { ref, getCurrentInstance } from 'vue'
  import { useCategoryStore } from '@/stores/index.js'
  import { storeToRefs } from 'pinia'
  import { format } from 'date-fns'

  // data
  const instance = getCurrentInstance()
  const { categories } = storeToRefs(useCategoryStore())
  const totalCount = ref(0)
  const loading = ref(false)
  const isFilter = ref(false)
  const isShowDialog = ref(false)
  const headers = ref([
    {
      title: 'Identifier',
      key: '_id',
      sortable: false,
    },
    { title: 'Name', key: 'name' },
    {
      title: 'Date creation',
      key: 'createdAt',
      value: ({ createdAt }) => format(createdAt, 'dd-MM-yyyy HH:mm'),
    },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ])
  const filter = ref({
    id: '',
    name: '',
  })
  const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
  })
  const editItem = ref(null)

  // method
  const { getCategory, deleteCategoryById } = useCategoryStore()

  const search = async () => {
    const { page, itemsPerPage, sortBy } = options.value

    loading.value = true

    const sort = sortBy.reduce((acc, { key, order }) => {
      acc[key] = order
      return acc
    }, {})
    const { count } = await getCategory({
      page,
      limit: itemsPerPage,
      sort,
      filter: {
        ...(filter.value.id &&
          filter.value.id.length === 24 && { _id: filter.value.id }),
        ...(filter.value.name && {
          name: { $regex: filter.value.name, $options: 'i' },
        }),
      },
    })
    totalCount.value = count

    loading.value = false
  }
  const clearFilter = async () => {
    filter.value = {
      id: '',
      name: '',
    }
    await search()
  }
  const onDelete = async (id) => {
    instance.root.$confirm({
      title: 'Confirm delete',
      msg: 'Are you sure to delete?',
      agree: async () => {
        await deleteCategoryById(id)
        instance.root.$notif('Successful deleted', { type: 'success' })
        await search()
      },
    })
  }
  const onCreate = () => {
    editItem.value = null
    isShowDialog.value = true
  }
  const onEdit = (item) => {
    editItem.value = item
    isShowDialog.value = true
  }
</script>

<style scoped>
  .app-wrapper {
    height: 88.5vh;
    display: flex;
    flex-direction: column;
  }
  .bottom {
    flex: 1;
    overflow: auto;
  }
</style>

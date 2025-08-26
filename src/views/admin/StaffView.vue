<template>
  <v-layout>
    <!-- Left side bar -->
    <ResOwnerSideBar />

    <!-- Main -->
    <v-main>
      <!--Header -->
      <header-component :title="$t('app.crud.staff.title')" />

      <!--List staff card-->
      <div v-if="staff.length > 0" class="mt-3">
        <staff-card v-for="sta in staff" :key="sta._id" :user="sta">
          <!--Edit button-->
          <dark-button
            :disabled="user.data._id === sta._id"
            @click="onEdit(sta)"
          >
            <v-icon icon="mdi-square-edit-outline" />
            Edit
          </dark-button>
          <!--Delete button-->
          <danger-button
            :disabled="user.data._id === sta._id"
            @click="onDelete(sta._id)"
          >
            <v-icon icon="mdi-delete-forever" />
            Delete
          </danger-button>
        </staff-card>
      </div>
      <!-- No staff -->
      <div v-else class="w-100">
        <h4 class="text-center mt-5 text-white">No staff available.</h4>
      </div>

      <!--Staff summary -->
      <summary-component class="mt-2" title="Staff Summary">
        <template #btn>
          <secondary-button @click="isShowForm = true">
            <v-icon
              color="white"
              icon="mdi-plus-box-multiple"
              size="large"
            />
            Add More
          </secondary-button>
        </template>
        <template #content>
          <div
            class="bg-grey-darken-2 mt-3 py-3 rounded-lg d-flex justify-space-between align-center"
          >
            <span class="ml-2">Total</span>
            <span
              v-if="staff.length > 1"
              class="mr-2"
            >{{ staff.length }} people</span>
            <span v-else class="mr-2">{{ staff.length }} person</span>
          </div>
        </template>
      </summary-component>
    </v-main>
  </v-layout>

  <staff-form :is-show-form="isShowForm" @close-form="closeForm" />

  <!-- Delete dialog -->
  <base-dialog
    v-model="isDelete"
    ms="Are you sure you want to delete?"
    title="Tips"
  >
    <danger-button @click="isDelete = false">
      <v-icon color="white" icon="mdi-close-box-multiple" size="large" />
      Cancel
    </danger-button>
    <primary-button
      @click="
        deleted();
        isDelete = false;
      "
    >
      <v-icon
        color="white"
        icon="mdi-checkbox-multiple-marked"
        size="large"
      />
      Confirm
    </primary-button>
  </base-dialog>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { getCurrentInstance, onMounted, ref } from 'vue'

  import ResOwnerSideBar from '@/components/aside/ResOwnerSideBar'
  import { useUserStore } from '@/stores/user'

  // Variable
  const instance = getCurrentInstance()
  const { getStaff, deleteStaff } = useUserStore()
  const { user } = storeToRefs(useUserStore())
  const { staff, staffInForm } = storeToRefs(useUserStore())
  const isShowForm = ref(false)
  const isDelete = ref(false)
  const findStaffId = ref(null)

  // Method
  // On edit staff
  const onEdit = staff => {
    isShowForm.value = true
    const { _id, first_name, last_name, gender, email, role } = staff
    staffInForm.value = {
      user_id: _id,
      first_name,
      last_name,
      gender,
      email,
      role_id: role._id,
    }
  }
  // On delete staff
  const onDelete = user_id => {
    findStaffId.value = user_id
    isDelete.value = true
  }
  const deleted = async () => {
    await deleteStaff(findStaffId.value)
    instance.root.$notif('Successful deleted', { type: 'success' })
  }
  // Close staff form
  const closeForm = () => {
    isShowForm.value = false
  }

  // LifeCycle hook
  onMounted(() => {
    getStaff()
  })
</script>

<style scoped>
.card-summary {
  background: #2c2c2c;
}
</style>

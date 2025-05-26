<template>
  <v-layout>
    <v-main
      class="h-screen bg-grey-lighten-1 d-flex flex-column align-center main-container"
    >
      <div class="w-100">
        <v-icon
          @click="comeback"
          class="back text-h4 text-black ml-5 mt-3"
          icon="mdi-keyboard-backspace"
        ></v-icon>
      </div>
      <div
        class="w-75 card-container m-auto py-15 px-8 rounded-lg bg-grey-darken-2"
      >
        <div class="d-flex image-container ml-10 flex-column justify-center">
          <v-avatar size="200" class="profile align-self-center" elevation="24">
            <v-img
              v-if="userData.image"
              :src="userData.image"
              :alt="userData.first_name"
              cover
            ></v-img>
            <span v-else class="text-h2 text-white">{{ initials }}</span>
          </v-avatar>
          <div
            class="user-info align-self-center d-flex flex-column align-center text-center mt-3"
          >
            <div>
              <h3 class="font-weight-bold">{{ userData.first_name }} {{ userData.last_name }}</h3>
              <h5>{{ userData.email }}</h5>
            </div>
            <div
              class="d-flex justify-space-around bg-grey-lighten-1 w-100 rounded-xl mt-4 py-2 role"
            >
              <div>
                <div class="mb-1">Role</div>
                <div class="text-capitalize font-weight-bold">{{ userData.role.name === 'restaurant_owner'? 'owner' : userData.role.name }}</div>
              </div>
              <div>
                <div class="mb-1">Gender</div>
                <div class="text-capitalize font-weight-bold">{{ userData.gender }}</div>
              </div>
            </div>

            <primary-button class="px-2 mt-4" @click="showEditForm">
              <v-icon
                icon="mdi-square-edit-outline"
                color="white"
                size="large"
              ></v-icon>
              Update
            </primary-button>
          </div>
        </div>
      </div>
    </v-main>
  </v-layout>
  <update-profile-form
    :initials="initials"
    :isShowForm="isShowForm"
    @closeForm="closeForm"
  />
</template>
<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// Variables
const { clearProfileForm } = useUserStore();
const { userData, userProfileInForm } = storeToRefs(useUserStore());
const router = useRouter();
const isShowForm = ref(false);
const initials = ref(
  userData.value.first_name.slice(0, 1).toUpperCase() +
    userData.value.last_name.slice(0, 1).toUpperCase()
);

// Method
const comeback = () => {
  router.go(-1);
};
const showEditForm = async () => {
  userProfileInForm.value = { ...userData.value };
  isShowForm.value = true;
};

// Close update profile form
const closeForm = () => {
  isShowForm.value = false;
  clearProfileForm();
};
</script>

<style scoped>
.profile {
  background: #2c2c2c;
}

.content-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.font-size {
  font-size: 1.1rem;
}

.card-container {
  display: flex;
}

.cursor {
  cursor: pointer;
}
.card-container {
  flex-direction: column;
}

.user-info {
  width: 50%;
}

@media screen and (max-width: 900px) {
  .user-info {
    width: 80%;
  }
  .text-right-group {
    width: 80% !important;
  }

  /* .card-container {
    flex-direction: column;
  } */

  .image-container {
    margin-left: 0 !important;
  }

  .info-container {
    margin-top: 40px;
    width: 100% !important;
    margin-left: 20px !important;
  }
}

@media screen and (max-width: 430px) {
  .user-info {
    width: 100%;
  }
  .role {
    width: 90% !important;
  }
  .back {
    color: white !important;
  }

  .main-container {
    width: 100% !important;
    background: #616161 !important;
  }

  .card-container {
    padding: 0 !important;
    width: 100% !important;
    background: none !important;
  }

  .info-container {
    width: auto !important;
    margin: 0 !important;
    margin-left: 20px !important;
    margin-top: 30px !important;
    padding: 0 !important;
  }

  .text-right-group {
    width: 100% !important;
    margin-right: 20px !important;
  }
}
</style>

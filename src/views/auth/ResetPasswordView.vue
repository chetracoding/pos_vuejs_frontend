<template>
  <div class="h-screen bg-grey-lighten-1 d-flex justify-center align-center">
    <v-form
      @submit.prevent="reset"
      class="form d-flex flex-column align-center rounded-lg w-40 px-8 py-10"
    >
      <div class="d-flex text-center flex-column align-center justify-center">
        <v-icon
          icon="mdi-shield-lock"
          class="logo mb-4 text-red-accent-2"
        ></v-icon>
        <h2>Reset a new password</h2>
        <span
          >Please create a new password for
          <span class="text-red-accent-2">{{ email }}</span
          >.</span
        >
      </div>
      <div class="w-100 mt-4">
        <v-text-field
          class="text-black"
          v-model="passwords.password"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          density="compact"
          placeholder="New password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="showPassword = !showPassword"
          :error-messages="v$.password.$errors.map((e) => e.$message)"
          @input="v$.password.$touch"
          @blur="v$.password.$touch"
        ></v-text-field>
        <v-text-field
          class="text-black mt-2"
          v-model="passwords.confirmPassword"
          :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showConfirm ? 'text' : 'password'"
          density="compact"
          placeholder="Confirm password"
          prepend-inner-icon="mdi-lock-check-outline"
          variant="outlined"
          @click:append-inner="showConfirm = !showConfirm"
          :rules="[passwordConfirmationRule]"
          :error-messages="v$.confirmPassword.$errors.map((e) => e.$message)"
          @input="v$.confirmPassword.$touch"
          @blur="v$.confirmPassword.$touch"
        ></v-text-field>
      </div>
      <primary-button
        @click="v$.$touch()"
        :disabled="success"
        class="mt-2"
        block
        size="large"
        type="medium"
      >
        <v-icon icon="mdi-lock-reset" class="mr-2"></v-icon>
        RESET
      </primary-button>
    </v-form>
  </div>
</template>

<script setup>
import {
  defineProps,
  onBeforeMount,
  reactive,
  ref,
  getCurrentInstance,
} from "vue";
import http from "@/utils/http.js";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

// Variables
const instance = getCurrentInstance();
const router = useRouter();
const props = defineProps(["token", "email"]);
const email = ref("unknown user");
const success = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);
const initialsPassword = {
  password: "",
  confirmPassword: "",
};
const passwords = reactive({
  ...initialsPassword,
});
const rules = {
  password: { required, minLength: minLength(8) },
  confirmPassword: { required },
};
const v$ = useVuelidate(rules, passwords);
// Validation confirm password
const passwordConfirmationRule = () => {
  if (passwords.password !== passwords.confirmPassword) {
    return "Confirm password must be match.";
  } else {
    return true;
  }
};

// Method
const reset = async () => {
  if (v$.value.$errors.length === 0 && passwordConfirmationRule() === true) {
    let resetData = {
      token: props.token,
      password: passwords.password,
    };
    try {
      await http.post("auth/reset-pwd", resetData);
      success.value = true;
      instance.root.$notif("Your password is changed", { type: "success" });
      router.push("/login");
    } catch (err) {
      instance.root.$notif("Couldn't find your reset password link", {
        type: "error",
      });
      router.push("/login");
    }
  }
};
// Lifecycle hook
onBeforeMount(async () => {
  let resetData = {
    token: props.token,
  };
  // Check email and token reset password in database
  try {
    const res = await http.post("/auth/check-pwd", resetData);
    email.value = res.data.data.email;
  } catch (err) {
    if (!err.response.data.success) {
      instance.root.$notif("Couldn't find your reset password link", {
        type: "error",
      });
      router.push("/login");
    }
  }
});
</script>

<style scoped>
.w-40 {
  width: 40%;
}
.logo {
  font-size: 10rem;
}
.cursor {
  cursor: pointer;
}

@media screen and (max-width: 900px) {
  .form {
    width: 60%;
  }
}

@media screen and (max-width: 430px) {
  .form {
    width: 100%;
  }
}
</style>

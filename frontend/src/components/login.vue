<template>
  <v-container class="login-container">
    <v-card class="login-card">
      <v-card-title class="text-center mb-3 text-h5"> ログイン </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="inputUserInfo.email"
          label="メールアドレス"
          required
          :rules="emailRules"
          type="email"
        ></v-text-field>
        <v-text-field
          v-model="inputUserInfo.password"
          label="パスワード"
          type="password"
          required
          @keydown.enter="confirmUser"
        ></v-text-field>

        <v-alert
          v-if="notLoginAlert"
          class="mb-5"
          color="error"
          icon="$error"
          text="メールアドレスまたはパスワードが誤っています。"
          @click="notLoginAlert = false"
        ></v-alert>

        <div class="text-center">
          <v-btn icon color="blue" @click="confirmUser">
            <v-icon>mdi-login</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >ログイン</v-tooltip
            ></v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import {
  userInfo,
  confirmUser,
  inputUserInfo,
  notLoginAlert,
} from "../store/user.js";
import { useRouter } from "vue-router";
import { emailRules } from "../store/common.js";

const router = useRouter();

inputUserInfo.value.password = "";
</script>

<style scoped>
.login-container {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  padding: 20px;
  width: 100%;
  max-width: 400px;
}
</style>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="register-card">
        <v-card>
          <v-card-title class="text-center text-h5 mb-3">
            <span v-if="!userInfo.id">アカウント登録</span>
            <span v-else>アカウント編集</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="inputUserInfo.name"
              required
              prepend-inner-icon-color="red"
              ><template v-slot:label>
                <v-icon slot="prependIcon" large color="red"
                  >mdi-asterisk</v-icon
                >
                名前
              </template></v-text-field
            >
            <v-text-field
              v-model="inputUserInfo.employee_no"
              required
              prepend-inner-icon-color="red"
              ><template v-slot:label>
                <v-icon slot="prependIcon" large color="red"
                  >mdi-asterisk</v-icon
                >
                社員番号
              </template></v-text-field
            >
            <v-text-field
              v-model="inputUserInfo.birthday"
              type="date"
              label="生年月日"
            ></v-text-field>
            <v-text-field
              v-model="inputUserInfo.email"
              required
              :rules="emailRules"
              type="email"
              ><template v-slot:label>
                <v-icon slot="prependIcon" large color="red"
                  >mdi-asterisk</v-icon
                >
                メールアドレス
              </template></v-text-field
            >
            <v-text-field
              v-model="inputUserInfo.password"
              type="password"
              required
              ><template v-slot:label>
                <v-icon slot="prependIcon" large color="red"
                  >mdi-asterisk</v-icon
                >
                パスワード
              </template></v-text-field
            >
            <v-text-field
              v-model="passwordConfirmation"
              label="パスワード確認"
              type="password"
              required
            >
              <template v-slot:label>
                <v-icon slot="prependIcon" large color="red"
                  >mdi-asterisk</v-icon
                >
                パスワード確認
              </template>
            </v-text-field>
            <v-file-input
              v-model="newAttachedFiles"
              accept="image/*"
              label="アイコン画像"
            ></v-file-input>

            <v-alert v-if="!passwordMatch" type="error" class="my-2">
              パスワードとパスワード確認が一致しません
            </v-alert>
            <v-alert v-if="requiredIsNull" type="error" class="my-2">
              必須項目が入力されていません
            </v-alert>
            <v-alert v-if="registeredEmail" type="error" class="my-2">
              メールアドレスは既に登録されています。
            </v-alert>

            <div class="text-center">
              <v-btn icon color="yellow" @click="saveUser" v-if="!userInfo.id">
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >登録</v-tooltip
                ></v-btn
              >
              <v-btn icon color="blue" @click="saveUser" v-else>
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >編集完了</v-tooltip
                ></v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import {
  userInfo,
  postUser,
  inputUserInfo,
  putUser,
  getUser,
  users,
  previousFileName,
} from "../store/user.js";
import { useRouter } from "vue-router";
import { emailRules, newAttachedFiles } from "../store/common.js";

const router = useRouter();

userInfo.value.password = "";
inputUserInfo.value = Object.assign({}, userInfo.value);
previousFileName.value = userInfo.value.icon;
onBeforeMount(async () => {
  await getUser(0);
  newAttachedFiles.value = [];
});

const passwordConfirmation = ref("");

const passwordMatch = ref(true); // パスワード一致の初期値
const requiredIsNull = ref(false);
const registeredEmail = ref(false);

const validateName = () => {
  if (
    inputUserInfo.value.name.replace(/ /g, "") &&
    inputUserInfo.value.name.replace(/　/g, "") &&
    inputUserInfo.value.employee_no.replace(/ /g, "") &&
    inputUserInfo.value.employee_no.replace(/　/g, "") &&
    inputUserInfo.value.password.replace(/ /g, "") &&
    inputUserInfo.value.password.replace(/　/g, "") &&
    inputUserInfo.value.email.replace(/ /g, "") &&
    inputUserInfo.value.email.replace(/　/g, "")
  ) {
    requiredIsNull.value = false;
  } else {
    requiredIsNull.value = true;
  }
};

const validatePasswordMatch = () => {
  if (inputUserInfo.value.password !== passwordConfirmation.value) {
    passwordMatch.value = false;
  } else {
    passwordMatch.value = true;
  }
};

const saveUser = async () => {
  validatePasswordMatch();
  if (!passwordMatch.value) {
    return;
  }
  validateName();
  if (requiredIsNull.value) {
    return;
  }
  if (!userInfo.value.id) {
    for (const user of users.value) {
      if (inputUserInfo.value.email == user.email) {
        registeredEmail.value = true;
        return;
      }
    }
    await postUser();
  } else {
    await putUser();
  }
  router.push("/");
};
</script>

<style scoped>
.register-card {
  max-width: 550px;
}
</style>

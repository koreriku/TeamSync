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
                名前<span class="red-asterisk ml-1">*</span>
              </template></v-text-field
            >
            <v-text-field
              v-model="inputUserInfo.employee_no"
              required
              prepend-inner-icon-color="red"
              ><template v-slot:label>
                社員番号<span class="red-asterisk ml-1">*</span>
              </template></v-text-field
            >

            <v-select
              v-model="inputUserInfo.department_name"
              :items="
                departmentsForInput
                  .filter((item) => item.name != '--')
                  .map((item) => item.name)
              "
              ><template v-slot:label>
                部署 <span class="red-asterisk ml-1">*</span>
              </template></v-select
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
                メールアドレス<span class="red-asterisk ml-1">*</span>
              </template></v-text-field
            >
            <v-text-field
              v-model="inputUserInfo.password"
              type="password"
              required
              ><template v-slot:label>
                パスワード<span class="red-asterisk ml-1">*</span>
              </template></v-text-field
            >
            <v-text-field
              v-model="passwordConfirmation"
              label="パスワード確認"
              type="password"
              required
            >
              <template v-slot:label>
                パスワード確認<span class="red-asterisk ml-1">*</span>
              </template>
            </v-text-field>
            <v-file-input
              v-model="newAttachedFiles"
              accept="image/*"
              label="アイコン画像"
            ></v-file-input>
            <p class="mb-5 text-medium-emphasis" v-if="inputUserInfo.icon">
              ※現在、アイコンに「{{
                inputUserInfo.icon.replace(/^(\d+)_/, "")
              }}」が設定されています。
            </p>

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
  <workDetailDialog />
  <wikiDetailDialog />
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
import {
  emailRules,
  newAttachedFiles,
  displaySnackbar,
  departmentsForInput,
  getDepartments,
  convertDepartmentNameToId,
} from "../store/common.js";
import wikiDetailDialog from "./dialogs/wiki/wikiDetailDialog.vue";
import workDetailDialog from "./dialogs/workDetailDialog.vue";

const router = useRouter();

userInfo.value.password = "";
inputUserInfo.value = Object.assign({}, userInfo.value);
previousFileName.value = userInfo.value.icon;
onBeforeMount(async () => {
  await getDepartments();
  await getUser(0);
  newAttachedFiles.value = [];
});

const passwordConfirmation = ref("");

const passwordMatch = ref(true); // パスワード一致の初期値
const requiredIsNull = ref(false);

const validateName = () => {
  if (
    inputUserInfo.value.name.replace(/ /g, "") &&
    inputUserInfo.value.name.replace(/　/g, "") &&
    inputUserInfo.value.employee_no.replace(/ /g, "") &&
    inputUserInfo.value.employee_no.replace(/　/g, "") &&
    inputUserInfo.value.password.replace(/ /g, "") &&
    inputUserInfo.value.password.replace(/　/g, "") &&
    inputUserInfo.value.email.replace(/ /g, "") &&
    inputUserInfo.value.email.replace(/　/g, "") &&
    inputUserInfo.value.department_name.replace(/ /g, "") &&
    inputUserInfo.value.department_name.replace(/　/g, "")
  ) {
    requiredIsNull.value = false;
  } else {
    displaySnackbar("red", "必須項目が入力されていません");
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
    displaySnackbar("red", "パスワードとパスワード確認が一致しません");
    return;
  }
  validateName();
  if (requiredIsNull.value) {
    return;
  }
  if (!userInfo.value.id) {
    for (const user of users.value) {
      if (inputUserInfo.value.email == user.email) {
        displaySnackbar("red", "メールアドレスは既に登録されています。");
        return;
      }
      if (inputUserInfo.value.name == user.name) {
        displaySnackbar("red", "名前は既に登録されています。");
        return;
      }
      if (inputUserInfo.value.employee_no == user.employee_no) {
        displaySnackbar("red", "社員番号は既に登録されています。");
        return;
      }
    }
    inputUserInfo.value.department = convertDepartmentNameToId(
      inputUserInfo.value.department_name
    );
    await postUser();
  } else {
    inputUserInfo.value.department = convertDepartmentNameToId(
      inputUserInfo.value.department_name
    );
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

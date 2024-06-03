<template>
  <v-dialog v-model="isOpenUserMemoDialog" max-width="500px">
    <v-card>
      <v-card-title class="d-flex justify-space-between"
        ><span>メモを入力</span>
        <v-btn
          icon
          color="gray"
          class="mb-3"
          @click="isOpenUserMemoDialog = false"
        >
          <v-icon>mdi-arrow-u-left-top</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >閉じる</v-tooltip
          ></v-btn
        >
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="userInfo.memo"
          label="メモ内容"
          outlined
          rows="5"
        ></v-textarea>
      </v-card-text>

      <div class="text-center">
        <v-btn icon color="blue" class="mb-3" @click="saveMemo">
          <v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >編集完了</v-tooltip
          ></v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onBeforeMount } from "vue";
import {
  inputUserInfo,
  userInfo,
  isOpenUserMemoDialog,
  putUser,
} from "../../store/user.js";

const saveMemo = async () => {
  inputUserInfo.value = userInfo.value;
  isOpenUserMemoDialog.value = false;
  await putUser();
};
</script>

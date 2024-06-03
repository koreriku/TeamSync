<template>
  <v-dialog v-model="isTemplateRegistrationDialog" max-width="1000px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <div class="headline">テンプレート新規登録</div>
        <v-btn
          icon
          color="gray"
          class="mb-3"
          @click="isTemplateRegistrationDialog = false"
        >
          <v-icon>mdi-arrow-u-left-top</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >閉じる</v-tooltip
          ></v-btn
        >
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="template.name"
          label="テンプレート名"
          required
        ></v-text-field>
        <v-text-field
          v-model="template.title"
          label="タイトル"
          required
        ></v-text-field>
        <v-textarea
          v-model="template.detail"
          label="詳細"
          rows="8"
        ></v-textarea>
        <MarkDownViewer :source="template.detail" class="mb-5" />
        <v-alert v-if="requiredIsNull" type="error" class="my-2">
          必須項目が入力されていません
        </v-alert>
      </v-card-text>
      <div class="text-center">
        <v-btn
          icon
          color="yellow"
          class="mb-3"
          @click="saveTemplate"
          v-if="template.id == 0"
        >
          <v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >登録</v-tooltip
          ></v-btn
        >
        <v-btn icon color="blue" class="mb-3" @click="saveTemplate" v-else>
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
import { ref } from "vue";
import {
  isTemplateRegistrationDialog,
  template,
  postTemplate,
  getTemplate,
} from "../../store/work.js";
import { currentProject } from "../../store/project.js";
import MarkDownViewer from "./MarkDownViewer.vue";

const requiredIsNull = ref(false);
const validateName = () => {
  if (
    template.value.name.replace(/ /g, "") &&
    template.value.name.replace(/　/g, "") &&
    ((template.value.title.replace(/ /g, "") &&
      template.value.title.replace(/　/g, "")) ||
      (template.value.detail.replace(/ /g, "") &&
        template.value.detail.replace(/　/g, "")))
  ) {
    requiredIsNull.value = false;
  } else {
    requiredIsNull.value = true;
  }
};

const saveTemplate = async () => {
  validateName();
  if (requiredIsNull.value) {
    return;
  }
  template.value.project_id = currentProject.value.id;
  await postTemplate();
  await getTemplate();
  isTemplateRegistrationDialog.value = false;
};
</script>

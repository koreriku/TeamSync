<template>
  <v-dialog v-model="isTemplateRegistrationDialog" max-width="1000px">
    <v-card :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }">
      <v-card-title class="d-flex justify-space-between">
        <div class="headline">
          テンプレート<span v-if="template.id == 0">登録</span
          ><span v-else>編集</span>
        </div>
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
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
          <v-card>
            <v-card-text>
              <v-text-field v-model="template.name" required
                ><template v-slot:label>
                  テンプレート名<span class="red-asterisk ml-1">*</span>
                </template></v-text-field
              >
              <v-select
                v-model="template.project_name"
                :items="
                  projects
                    .filter((item) => item.staff_ids.includes(userInfo.id))
                    .map((item) => `${item.title}`)
                "
                multiple
                chips
                ><template v-slot:label>
                  プロジェクト <span class="red-asterisk ml-1">*</span>
                </template></v-select
              >
              <v-text-field v-model="template.title" required
                ><template v-slot:label>
                  タイトル<span class="red-asterisk ml-1">*</span>
                </template></v-text-field
              >

              <v-textarea v-model="template.detail" rows="8"
                ><template v-slot:label>
                  詳細<span class="red-asterisk ml-1">*</span>
                </template></v-textarea
              >
              <div v-if="template.detail">
                <MarkDownViewer :source="template.detail" class="mb-5" />
              </div>
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
                  >新規登録</v-tooltip
                ></v-btn
              >
              <v-btn
                icon
                color="blue"
                class="mb-3"
                @click="saveTemplate"
                v-else
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >編集完了</v-tooltip
                ></v-btn
              >
            </div>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          xs="12"
          sm="12"
          md="6"
          lg="6"
          xl="6"
          xxl="6"
          v-if="templates.filter((item) => item.id != 0).length > 0"
        >
          <v-card
            ><v-card-text
              ><v-table>
                <tbody>
                  <tr
                    v-for="(item, i) in templates.filter(
                      (item) => item.id != 0
                    )"
                    :value="item"
                  >
                    <td
                      class="tr-data point-cursor"
                      style="width: 80%; font-size: 1.1rem"
                      @click="selectTemplate(item)"
                      :class="{ 'active-data': item.id == template.id }"
                    >
                      <div class="mr-2 mt-3">
                        {{ item.name }}
                      </div>
                    </td>
                    <td style="width: 20%">
                      <v-btn
                        icon
                        color="gray"
                        size="small"
                        @click="deleteSelectedTemplate(item)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                        <v-tooltip activator="parent" location="bottom"
                          >テンプレートを削除</v-tooltip
                        ></v-btn
                      >
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text></v-card
          >
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import {
  isTemplateRegistrationDialog,
  template,
  postTemplate,
  getTemplate,
  templates,
  deleteTemplate,
  resetTemplate,
  putTemplate,
} from "../../store/work.js";
import {
  currentProject,
  projects,
  convertProjectNamesToIds,
} from "../../store/project.js";
import { userInfo } from "../../store/user.js";
import { displaySnackbar, baseThemeColor } from "../../store/common.js";
import MarkDownViewer from "./MarkDownViewer.vue";

const requiredIsNull = ref(false);
const validateName = () => {
  if (
    template.value.name.replace(/ /g, "") &&
    template.value.name.replace(/　/g, "") &&
    template.value.project_name.length > 0 &&
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
    displaySnackbar("red", "必須項目が入力されていません");
    return;
  }
  template.value.project_id = convertProjectNamesToIds(
    template.value.project_name
  );
  if (template.value.id == 0) {
    await postTemplate();
    displaySnackbar("blue", "テンプレートを登録しました。");
  } else {
    await putTemplate();
    displaySnackbar("blue", "テンプレートを更新しました。");
  }
  await getTemplate();
};
const deleteSelectedTemplate = async (item) => {
  if (item.id == template.value.id) {
    resetTemplate();
  }
  await deleteTemplate(item.id);
  await getTemplate();
};

const selectTemplate = (item) => {
  if (item.id == template.value.id) {
    resetTemplate();
  } else {
    template.value = item;
  }
};
</script>

<style scoped>
.active-data {
  color: #2196f3;
}
</style>

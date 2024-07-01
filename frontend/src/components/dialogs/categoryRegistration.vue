<template>
  <v-dialog v-model="isCategoryRegistrationDialog" max-width="800px">
    <v-card :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }">
      <v-card-title> 新しいカテゴリーを追加 </v-card-title>
      <v-card-text>
        <div class="d-flex">
          <v-text-field
            v-model="newCategory.name"
            label="カテゴリー名"
            class="mr-3"
            variant="outlined"
            required
          ></v-text-field>
          <v-select
            v-model="newCategory.project_name"
            variant="outlined"
            class="mr-3"
            :items="
              projects
                .filter((item) => item.staff_ids.includes(userInfo.id))
                .map((item) => `${item.title}`)
            "
            multiple
            chips
            style="max-width: 350px"
            ><template v-slot:label>
              プロジェクト <span class="red-asterisk ml-1">*</span>
            </template></v-select
          >
          <div class="text-center">
            <v-btn icon color="yellow" @click="saveCategory">
              <v-icon>mdi-check</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >登録</v-tooltip
              ></v-btn
            >
          </div>
        </div>
        <v-table>
          <div class="mb-3">
            <v-chip
              v-if="!isEdited"
              prepend-icon="mdi-sort"
              @click="isEdited = !isEdited"
              >並べ替え</v-chip
            ><v-chip
              v-else
              prepend-icon="mdi-pencil"
              @click="isEdited = !isEdited"
              >編集</v-chip
            >
          </div>
          <div
            v-if="!isEdited"
            v-for="(item, i) in categories"
            :key="i"
            :value="item"
            :active="false"
            @click="inputDepartment(item)"
          >
            <div
              class="my-3 point-cursor tr-data"
              :style="{
                color: selectedItem.name === item.name ? '#2196F3' : '',
              }"
            >
              {{ item.name }}
            </div>
            <v-divider class="mt-2"></v-divider>
          </div>
          <div
            v-else
            v-for="(item, i) in categories"
            :value="item"
            :active="false"
          >
            <div class="d-flex">
              <v-text-field
                variant="outlined"
                v-model="item.name"
                density="compact"
                single-line
                hide-details
                class="mr-2"
              ></v-text-field>
              <v-select
                v-model="item.project_name"
                single-line
                hide-details
                variant="outlined"
                density="compact"
                class="mr-2"
                :items="
                  projects
                    .filter((item) => item.staff_ids.includes(userInfo.id))
                    .map((item) => `${item.title}`)
                "
                multiple
                chips
                style="max-width: 350px"
                ><template v-slot:label>
                  プロジェクト <span class="red-asterisk ml-1">*</span>
                </template></v-select
              >
              <v-btn
                icon
                color="blue"
                class="mr-2"
                size="small"
                @click="putCategory(item)"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >登録</v-tooltip
                ></v-btn
              >
              <v-btn icon color="red" size="small" @click="deleteItem(item)">
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >削除</v-tooltip
                ></v-btn
              >
            </div>
            <v-divider class="my-2"></v-divider>
          </div>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineProps } from "vue";
import {
  isCategoryRegistrationDialog,
  newCategory,
  postCategory,
  selectedItem,
  puttedItem,
  sortCategory,
  categories,
  putCategory,
  deleteCategory,
} from "../../store/work.js";
import { displaySnackbar, baseThemeColor } from "../../store/common.js";
import { projects } from "../../store/project.js";
import { userInfo } from "../../store/user.js";

const props = defineProps({
  projectId: Number,
});

const isSelectedCategory = ref(true);

const isEdited = ref(false);
selectedItem.value = {};
puttedItem.value = {};
const saveCategory = () => {
  if (
    newCategory.value.name == "" ||
    newCategory.value.project_name.length == 0
  ) {
    displaySnackbar("red", "必須項目が入力されていません。");
    return;
  }
  if (props.projectId == 0) {
    postCategory(0);
  } else {
    postCategory();
  }
  newCategory.value.name = "";
  newCategory.value.project_name = [];
  newCategory.value.project_id = [];
  isCategoryRegistrationDialog.value = false;
};

const inputDepartment = (item) => {
  if (isSelectedCategory.value) {
    selectedItem.value = item;
    isSelectedCategory.value = false;
  } else {
    puttedItem.value = item;
    isSelectedCategory.value = true;
  }
  if (selectedItem.value.id > 0 && puttedItem.value.id > 0) {
    sortCategory();
    selectedItem.value = {};
    puttedItem.value = {};
  }
};

const deleteItem = (item) => {
  deleteCategory(item.id);
  categories.value = categories.value.filter(
    (category) => item.id != category.id
  );
};
</script>

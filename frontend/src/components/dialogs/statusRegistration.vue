<template>
  <v-dialog v-model="isStatusRegistrationDialog" max-width="800px">
    <v-card :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }">
      <v-card-title>状況を追加</v-card-title>
      <v-card-text>
        <div class="d-flex">
          <v-text-field
            v-model="newStatus.name"
            label="状況名"
            variant="outlined"
            required
            class="mr-3"
          ></v-text-field>
          <v-select
            v-model="newStatus.project_name"
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
          <v-btn icon class="mr-3" :color="newStatus.color">
            <v-menu
              activator="parent"
              location="end"
              :close-on-content-click="false"
            >
              <v-card style="min-width: 350px">
                <v-card-title class="text-center"></v-card-title>
                <v-card-text
                  ><v-color-picker
                    class="ma-2"
                    v-model="newStatus.color"
                    swatches-max-height="400px"
                    show-swatches
                  ></v-color-picker>
                </v-card-text> </v-card
            ></v-menu>
            <v-icon>mdi-palette</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >カラー選択</v-tooltip
            ></v-btn
          >
          <v-btn icon color="yellow" @click="saveStatus">
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >登録</v-tooltip
            ></v-btn
          >
        </div>
        <v-table>
          <div>
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
              v-for="(item, i) in statuses.slice(1)"
              :key="i"
              :value="item"
              :active="false"
              class="my-5"
              @click="inputDepartment(item)"
            >
              <div
                class="point-cursor tr-data"
                :style="{
                  color: selectedItem.name === item.name ? '#2196F3' : '',
                }"
              >
                {{ item.name }}
              </div>
              <v-divider class="mt-3"></v-divider>
            </div>
            <div
              v-else
              v-for="(item, i) in statuses.slice(1)"
              :value="item"
              :active="false"
              style="border-bottom: 1px solid #e0e0e0"
              class="mb-2"
            >
              <div class="d-flex">
                <v-text-field
                  class="mr-2"
                  variant="outlined"
                  v-model="item.name"
                  density="compact"
                  single-line
                  hide-details
                ></v-text-field
                ><v-select
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
                ><v-btn icon class="mr-2" size="small" :color="item.color">
                  <v-menu
                    activator="parent"
                    location="end"
                    :close-on-content-click="false"
                  >
                    <v-card style="min-width: 350px">
                      <v-card-title class="text-center"></v-card-title>
                      <v-card-text
                        ><v-color-picker
                          class="ma-2"
                          v-model="item.color"
                          swatches-max-height="400px"
                          show-swatches
                        ></v-color-picker>
                      </v-card-text> </v-card
                  ></v-menu>
                  <v-icon>mdi-palette</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >カラー選択</v-tooltip
                  ></v-btn
                ><v-btn
                  icon
                  color="blue"
                  class="mr-2"
                  size="small"
                  @click="putStatus(item)"
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
              <v-divider class="mt-2"></v-divider>
            </div>
          </div>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import {
  isStatusRegistrationDialog,
  newStatus,
  postStatus,
  statuses,
  sortStatues,
  putStatus,
  selectedItem,
  puttedItem,
  deleteStatus,
} from "../../store/work.js";
import { projects } from "../../store/project.js";
import { userInfo } from "../../store/user.js";
import { displaySnackbar, baseThemeColor } from "../../store/common.js";

const isSelectedStatus = ref(true);

const isEdited = ref(false);

selectedItem.value = {};
puttedItem.value = {};

const inputDepartment = (item) => {
  if (isSelectedStatus.value) {
    selectedItem.value = item;
    isSelectedStatus.value = false;
  } else {
    puttedItem.value = item;
    isSelectedStatus.value = true;
  }
  if (selectedItem.value.id > 0 && puttedItem.value.id > 0) {
    sortStatues();
    selectedItem.value = {};
    puttedItem.value = {};
  }
};
const deleteItem = (item) => {
  deleteStatus(item.id);
  statuses.value = statuses.value.filter((status) => item.id != status.id);
};

const saveStatus = () => {
  if (newStatus.value.name == "" || newStatus.value.project_name.length == 0) {
    displaySnackbar("red", "必須項目が入力されていません。");
    return;
  }
  postStatus();
  newStatus.value.name = "";
  newStatus.value.color = "";
  newStatus.value.project_name = [];
  newStatus.value.project_id = [];
  isStatusRegistrationDialog.value = false;
};
</script>

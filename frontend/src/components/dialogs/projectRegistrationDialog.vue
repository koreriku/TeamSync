<template>
  <v-dialog v-model="isProjectRegistrationDialogOpen" max-width="600px">
    <v-card :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }">
      <v-card-title class="d-flex justify-space-between">
        <span class="headline" v-if="props.isEdited">プロジェクト編集</span>
        <span class="headline" v-else>プロジェクト登録</span>
        <div>
          <v-btn
            icon
            color="red"
            class="mb-3 mr-3"
            @click="isDeleteDialogOpen = true"
            v-if="props.isEdited"
          >
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >削除</v-tooltip
            ></v-btn
          >
          <deleteDialog content="project" />
          <v-btn icon color="gray" class="mb-3" @click="closeDialog">
            <v-icon>mdi-arrow-u-left-top</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >閉じる</v-tooltip
            ></v-btn
          >
        </div>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="editProject.title"
                ><template v-slot:label>
                  タイトル <span class="red-asterisk ml-1">*</span>
                </template></v-text-field
              >
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editProject.detail"
                label="詳細"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editProject.project_no"
                ><template v-slot:label>
                  プロジェクトNO <span class="red-asterisk ml-1">*</span>
                </template></v-text-field
              >
            </v-col>
            <v-col cols="5">
              <v-select
                :items="projectStatus.map((item) => item.name)"
                v-model="editProject.state_name.name"
                label="状態"
              ></v-select>
            </v-col>
            <v-col cols="7" class="d-flex">
              <v-combobox
                v-model="currentProjectUserIds"
                :items="usersForInput.map((item) => item.name)"
                multiple
                chips
                class="mr-2"
                ><template v-slot:label>
                  担当者 <span class="red-asterisk ml-1">*</span>
                </template></v-combobox
              >
              <v-menu
                v-model="filterStaffMenu"
                :close-on-content-click="false"
                location="end"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="grey"
                    class="mt-2"
                    v-bind="props"
                    icon
                    size="small"
                  >
                    <v-icon>mdi-filter-outline</v-icon>
                    <v-tooltip activator="parent" location="bottom"
                      >部署で担当者を絞り込む</v-tooltip
                    >
                  </v-btn>
                </template>
                <v-card width="350">
                  <v-card-text
                    ><v-select
                      label="部署"
                      v-model="filterDepartment"
                      :items="
                        [{ name: '' }, ...departmentsForInput]
                          .filter((item) => item.name != '--')
                          .map((item) => item.name)
                      "
                      @update:model-value="
                        () => {
                          filterStaffs(filterDepartment);
                        }
                      "
                    ></v-select
                  ></v-card-text>
                </v-card>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="editProject.from"
                type="date"
                label="開始日"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="editProject.to"
                type="date"
                label="終了日"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                type="number"
                v-model.number="editProject.estimate_time"
                label="予想時間"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                type="number"
                v-model.number="editProject.actual_time"
                label="実績時間"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                type="number"
                v-model.number="editProject.progress"
                label="進捗（%）"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <div class="text-center">
          <v-btn
            icon
            color="blue"
            class="mb-3"
            @click="saveProject"
            v-if="props.isEdited"
          >
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >編集完了</v-tooltip
            ></v-btn
          >
          <v-btn icon color="yellow" class="mb-3" @click="saveProject" v-else>
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >登録</v-tooltip
            ></v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onBeforeMount, defineProps } from "vue";

import {
  editProject,
  editedProject,
  postProject,
  putProject,
  getProject,
  isProjectRegistrationDialogOpen,
  currentProjectUserIds,
  currentProject,
  projectStatus,
  getProjectStatus,
  selectedProject,
  convertProjectStatusNameToId,
  convertIdToProjectStatusName,
  projects,
} from "../../store/project.js";
import { getWork } from "../../store/work.js";
import {
  isDeleteDialogOpen,
  departmentsForInput,
  getDepartments,
  baseThemeColor,
  displaySnackbar,
} from "../../store/common.js";
import {
  getUser,
  users,
  userInfo,
  convertUserNameToId,
  getProjectUsers,
  projectUsers,
  filterStaffs,
  usersForInput,
} from "../../store/user.js";
import deleteDialog from "./deleteDialog.vue";

const props = defineProps({
  isEdited: Boolean,
});

const filterStaffMenu = ref(false);
const filterDepartment = ref("");

onBeforeMount(async () => {
  await getDepartments();
  await getUser(0);
  if (projectStatus.value.length === 0) {
    await getProjectStatus();
  }
});
const closeDialog = () => {
  isProjectRegistrationDialogOpen.value = false;
};

const validateName = () => {
  if (
    editProject.value.title.replace(/ /g, "") &&
    editProject.value.title.replace(/　/g, "") &&
    editProject.value.project_no.replace(/ /g, "") &&
    editProject.value.project_no.replace(/　/g, "") &&
    currentProjectUserIds.value.length > 0
  ) {
    return false;
  } else {
    return true;
  }
};

const saveProject = async () => {
  if (validateName()) {
    displaySnackbar("red", "必須項目が入力されていません。");
    return;
  }
  editedProject.value = Object.assign({}, editProject.value);
  selectedProject.value = Object.assign({}, editProject.value);
  editedProject.value.staff_ids = convertUserNameToId(
    currentProjectUserIds.value
  );
  editedProject.value.state = convertProjectStatusNameToId(
    editedProject.value.state_name.name
  );
  isProjectRegistrationDialogOpen.value = false;
  if (props.isEdited) {
    await putProject();
  } else {
    await postProject();
  }
  await getProject(userInfo.value.id);
};
</script>

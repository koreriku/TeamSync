<template>
  <div class="mb-8 d-flex justify-space-between">
    <div>
      <span class="text-h4 mr-5">プロジェクト一覧</span>
      <v-btn
        icon
        color="yellow"
        class="mr-3"
        @click="
          resetProject();
          editProject.from = getCurrentDate();
          editProject.to = getFutureDate(60);
          isEdited = false;
          currentProjectUserIds.push(userInfo.name);
          isProjectRegistrationDialogOpen = true;
        "
      >
        <v-icon>mdi-plus</v-icon>
        <v-tooltip activator="parent" location="bottom">新規</v-tooltip></v-btn
      >
      <v-btn
        icon
        color="gray"
        class="mr-3"
        @click="reset"
        v-if="isSearchedProject"
      >
        <v-icon>mdi-restore</v-icon>
        <v-tooltip activator="parent" location="bottom"
          >リセット</v-tooltip
        ></v-btn
      >
    </div>
    <v-text-field
      label="タスクID検索"
      prepend-inner-icon="mdi-magnify"
      type="number"
      v-model="workId"
      density="compact"
      style="max-width: 300px"
      variant="outlined"
      @keyup.enter="searchTaskId"
    ></v-text-field>
  </div>
  <v-row>
    <v-col cols="6" xs="6" sm="6" md="3" lg="2" xl="2" xxl="2">
      <v-select
        v-model="searchProjectCondition.state"
        style="max-width: 300px"
        @update:model-value="
          () => {
            searchProject();
          }
        "
        :items="selectProjectStatus"
        class="mb-3 mr-3"
        density="compact"
        variant="outlined"
        label="状態"
      ></v-select>
    </v-col>
    <v-col cols="6" xs="6" sm="6" md="6" lg="6" xl="6" xxl="6"></v-col>
    <v-col cols="12" xs="12" sm="12" md="12" lg="4" xl="4" xxl="4">
      <v-text-field
        label="キーワード検索"
        prepend-inner-icon="mdi-magnify"
        v-model="searchProjectCondition.word"
        density="compact"
        variant="outlined"
        @keyup.enter="searchProject"
      ></v-text-field>
    </v-col>
  </v-row>

  <v-alert
    v-if="projects.length == 0"
    color="info"
    icon="$info"
    text="加入しているプロジェクトがありません。"
  ></v-alert>
  <div>
    <v-row>
      <v-col cols="12" xxl="9" xl="6" md="6" sm="12" xs="12">
        <v-row>
          <v-col
            v-for="project in searchedProjects"
            :key="project.id"
            cols="12"
            sm="12"
            md="12"
            lg="6"
          >
            <div class="project">
              <v-card class="point-cursor" @click="goToWork(project)">
                <v-card-title
                  ><div>{{ project.title }}</div>
                </v-card-title>
                <v-card-subtitle>{{ project.state }}</v-card-subtitle>
                <v-card-text class="d-flex justify-space-between">
                  <div>
                    <div>開始日: {{ project.from }}</div>
                    <div>終了日: {{ project.to }}</div>
                    <div>進捗度: {{ project.progress }}%</div>
                  </div>
                </v-card-text>
              </v-card>
              <v-btn
                icon
                color="blue"
                class="mr-3 mb-2 project-edit"
                size="small"
                @click="editSelectedProject(project)"
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >編集</v-tooltip
                ></v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" xxl="3" xl="6" md="6" sm="12" xs="12">
        <v-card v-if="participatingProjectIds.length != 0">
          <v-tabs v-model="workTab" bg-color="#F5F5F5" @click="searchWorks">
            <v-tab value="recent">最近の更新</v-tab>
            <v-tab value="myWork">自分の課題</v-tab>
          </v-tabs>
          <!-- <v-window v-model="workTab">
            <v-window-item value="recent"></v-window-item
          ><v-window-item value="myWork"></v-window-item
          ></v-window> -->

          <v-card-text>
            <v-list lines="four">
              <v-table style="max-height: 700px">
                <v-list-item
                  v-for="(item, i) in showRecentUpdateWorks.slice(
                    0,
                    worksDisplayNum
                  )"
                  :key="i"
                  :value="item"
                  :active="false"
                  style="border-bottom: 1px solid #e0e0e0"
                  @click="openDetailsModal(item)"
                >
                  <v-list-item-title class="mb-2"
                    ><p class="text-medium-emphasis" style="font-size: 0.9rem">
                      {{ item.update_date }}
                    </p>
                    <p>
                      <v-icon
                        color="yellow"
                        class="mr-2"
                        v-if="item.progress == 100"
                        >mdi-crown</v-icon
                      >
                      <v-icon
                        color="red"
                        class="mr-2"
                        v-if="item.progress != 100 && deadlineIsPasted(item.to)"
                        >mdi-fire</v-icon
                      >
                      <span v-if="item.work_id"
                        ><v-chip size="small" prepend-icon="mdi-car-child-seat">
                          {{ item.children_title }}
                        </v-chip></span
                      >{{ `【${item.project_name}】${item.title}` }}
                    </p>
                  </v-list-item-title>
                  <v-list-item-subtitle class="mb-3">
                    <p class="mb-1">
                      状況：<v-chip
                        v-if="item.stateName.name"
                        :color="item.stateName.color"
                      >
                        {{ item.stateName.name }}
                      </v-chip>
                    </p>
                    <p class="mb-1">
                      担当者：
                      <span
                        v-for="(user, index) in addIconBasedOnUserId(
                          item.staffs,
                          users
                        )"
                      >
                        <v-avatar class="mr-2 mb-1" size="20" v-if="user.icon">
                          <v-img
                            :src="baseURL + '/public/uploads/' + user.icon"
                            :alt="user.name"
                          ></v-img
                        ></v-avatar>
                        <v-avatar class="mr-2" size="x-small" v-else>{{
                          String(user.name).charAt(0)
                        }}</v-avatar>
                        {{ user.name }}
                        <span v-if="index != item.staffs.length - 1"> , </span>
                      </span>
                    </p>
                    <p class="mb-1">
                      優先度：<span v-if="item.priority == 2"
                        ><v-icon color="red">mdi-arrow-up-thin</v-icon>
                        {{ item.priorityName }}
                      </span>
                      <span v-else-if="item.priority == 3"
                        ><v-icon color="green">mdi-arrow-right-thin</v-icon>
                        {{ item.priorityName }}
                      </span>
                      <span v-else-if="item.priority == 4"
                        ><v-icon color="blue">mdi-arrow-down-thin</v-icon>
                        {{ item.priorityName }}
                      </span>
                      <span v-else></span>
                    </p>
                    <p>実績時間：{{ item.actual_time }}</p>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item
                  @click="worksDisplayNum += 10"
                  v-if="showRecentUpdateWorks.length > worksDisplayNum"
                  ><v-list-title class="text-center"
                    ><div><v-icon>mdi-chevron-down</v-icon></div></v-list-title
                  ></v-list-item
                >
              </v-table>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <projectRegistrationDialog :isEdited="isEdited" />
  <workDetailDialog />
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import {
  currentProject,
  currentProjectUserIds,
  isProjectRegistrationDialogOpen,
  resetProject,
  editProject,
  editedProject,
  projectStatus,
  getProject,
  projects,
  getProjectStatus,
  searchProjectCondition,
  searchedProjects,
  searchProject,
  isSearchedProject,
  resetSearchProjectCondition,
  selectedProject,
  participatingProjectIds,
} from "../store/project.js";
import {
  getCurrentDate,
  getFutureDate,
  convertArrayToText,
  displaySnackbar,
  baseURL,
} from "../store/common.js";
import {
  userInfo,
  convertIdToUserName,
  addIconBasedOnUserId,
  users,
} from "../store/user.js";
import { getNotification } from "../store/notification.js";
import projectRegistrationDialog from "./dialogs/projectRegistrationDialog.vue";
import {
  works,
  getRecentUpdateWorks,
  recentUpdateWorks,
  selectedWork,
  isWorkDetailsDialogOpen,
  openDetailsModal,
  getCategory,
  getPriority,
  getStatus,
  searchWorkConditions,
  deadlineIsPasted,
  showRecentUpdateWorks,
} from "../store/work";
import workDetailDialog from "./dialogs/workDetailDialog.vue";

const router = useRouter();

const selectProjectStatus = ref([]);
if (!userInfo.value.id) {
  router.push("/login");
}
onBeforeMount(async () => {
  if (selectProjectStatus.value.length == 0) {
    await getProjectStatus();
    selectProjectStatus.value = projectStatus.value.map((item) => item.name);
    selectProjectStatus.value.push("完了以外");
  }
  await getProject(userInfo.value.id);
  works.value = [];
  await getRecentUpdateWorks();
  getNotification();
});

const isEdited = ref(false);
const workId = ref();
const workTab = ref("recent");

const goToWork = (project) => {
  currentProject.value = project;
  localStorage.setItem("currentProject", JSON.stringify(project));
  currentProjectUserIds.value = project.staff_ids;
  localStorage.setItem("currentProjectUserIds", project.staff_ids);
  router.push(`/work`);
};

const editSelectedProject = async (project) => {
  isEdited.value = true;
  editProject.value = Object.assign({}, project);
  if (project.staff_ids.length > 0) {
    currentProjectUserIds.value = convertIdToUserName(project.staff_ids);
  }
  isProjectRegistrationDialogOpen.value = true;
};

const reset = () => {
  isSearchedProject.value = false;
  resetSearchProjectCondition();
  searchedProjects.value = projects.value;
};

const searchTaskId = () => {
  let isFound = false;
  if (!workId.value) {
    return;
  }
  for (const work of recentUpdateWorks.value) {
    if (workId.value == work.id) {
      isFound = true;
      selectedWork.value = work;
      isWorkDetailsDialogOpen.value = true;
      break;
    }
  }
  if (!isFound) {
    displaySnackbar(
      "red",
      "加入しているプロジェクト内でタスクが見つかりませんでした。"
    );
  }
};

const searchWorks = () => {
  if (workTab.value == "myWork") {
    showRecentUpdateWorks.value = [];
    for (const work of recentUpdateWorks.value) {
      if (work.staffs.includes(userInfo.value.id) && work.progress != 100) {
        showRecentUpdateWorks.value.push(work);
      }
    }
    // showRecentUpdateWorks.value.sort((a, b) => {
    //オブジェクトの値を比較。
    //   if (!a.to || !b.to) {
    //     if (b.priority == 1 || !b.priority || a.priority == 1 || !a.priority) {
    //       return b.to > a.to
    //         ? 10 + b.priority - a.priority
    //         : -10 - b.priority - a.priority;
    //     }
    //     //return a.priority - b.priority;
    //     return b.to > a.to
    //       ? 10 + a.priority - b.priority
    //       : -10 - a.priority - b.priority;
    //   }
    //   return a.to > b.to ? 100 : -100;
    // });

    showRecentUpdateWorks.value.sort((a, b) => {
      //オブジェクトの値を比較。
      if (!a.to || !b.to) {
        return b.to > a.to ? 1 : -1;
      }
      return a.to > b.to ? 1 : -1;
    });
    showRecentUpdateWorks.value.sort((a, b) => {
      //オブジェクトの値を比較。
      if (b.priority == 1 || !b.priority || a.priority == 1 || !a.priority) {
        return b.priority - a.priority;
      }
      return a.priority - b.priority;
    });
  } else {
    showRecentUpdateWorks.value = recentUpdateWorks.value;
  }
};

const worksDisplayNum = ref(10);
</script>

<style scoped>
.project {
  position: relative;
}
.project-edit {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
</style>

<template>
  <v-row justify="space-between">
    <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
      <div class="d-flex">
        <span class="text-h4 mr-5">
          {{ currentProject.title }}
        </span>

        <v-btn
          icon
          color="yellow"
          class="mr-3"
          @click="
            resetWork();
            resetChildrenWork();
            selectedTemplateName = '';
            selectedWork.from = getCurrentDate();
            selectedWork.to = getFutureDate(7);
            workRegistrationDialog = true;
          "
        >
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >新規</v-tooltip
          ></v-btn
        >
        <v-btn icon color="green" class="mr-3">
          <v-menu activator="parent" location="end">
            <v-list>
              <v-list-item>
                <v-list-item-title
                  class="tr-data point-cursor py-4"
                  @click="createExcel"
                  >「{{ currentProject.title }}」出力</v-list-item-title
                >
                <v-divider></v-divider>
                <v-list-item-title
                  class="tr-data point-cursor py-4"
                  @click="outputExcelChoices"
                  >「{{
                    currentProject.title
                  }}」取り込みテンプレート出力</v-list-item-title
                >
                <v-divider></v-divider>
                <v-list-item-title class="pt-4"
                  ><v-file-input
                    label="エクセル取込"
                    variant="outlined"
                    prepend-icon="mdi-microsoft-excel"
                    density="compact"
                    style="width: 300px"
                    v-model="newAttachedFiles"
                    accept=".xls,.xlsx,.xlsm"
                    @update:model-value="
                      () => {
                        importExcel();
                      }
                    "
                  ></v-file-input
                ></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-icon>mdi-microsoft-excel</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >エクセル入出力</v-tooltip
          ></v-btn
        >
        <v-btn icon color="gray" class="mr-3" @click="reset" v-if="isSearched">
          <v-icon>mdi-restore</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >リセット</v-tooltip
          ></v-btn
        >
      </div>
    </v-col>

    <v-col
      cols="12"
      xs="12"
      sm="12"
      md="6"
      lg="6"
      xl="6"
      xxl="6"
      class="text-end"
    >
      <span v-if="projectUsers.length > 5" class="point-cursor"
        ><v-menu activator="parent" location="end">
          <v-card>
            <v-card-title>このプロジェクトへの参加ユーザー</v-card-title>
            <v-card-text>
              <v-table>
                <v-list>
                  <v-list-item
                    v-for="(user, i) in projectUsers"
                    :key="i"
                    :value="user"
                    style="border-bottom: 1px solid #e0e0e0"
                  >
                    <v-list-item-title
                      ><span class="mr-3"
                        ><v-avatar
                          class="mr-2 mb-1"
                          size="small"
                          v-if="user.icon"
                        >
                          <v-img
                            :src="baseURL + '/public/uploads/' + user.icon"
                            :alt="user.name"
                          ></v-img
                        ></v-avatar>
                        <v-avatar class="mr-2 mb-1" size="small" v-else>{{
                          String(user.name).charAt(0)
                        }}</v-avatar></span
                      ><span>{{ user.name }}</span></v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-table>
            </v-card-text>
          </v-card></v-menu
        ><v-avatar class="mr-2 mb-1" size="small"
          >+{{ projectUsers.length - 5
          }}<v-tooltip activator="parent" location="bottom"
            >このプロジェクトへの参加ユーザー</v-tooltip
          ></v-avatar
        ></span
      >
      <span v-for="user of projectUsers.slice(0, 5)">
        <v-avatar class="mr-2 mb-1" size="small" v-if="user.icon">
          <v-img
            :src="baseURL + '/public/uploads/' + user.icon"
            :alt="user.name"
          ></v-img
          ><v-tooltip activator="parent" location="bottom">{{
            user.name
          }}</v-tooltip></v-avatar
        >
        <v-avatar class="mr-2 mb-1" size="small" v-else
          >{{ String(user.name).charAt(0)
          }}<v-tooltip activator="parent" location="bottom">{{
            user.name
          }}</v-tooltip></v-avatar
        >
      </span>
    </v-col>
  </v-row>
  <div class="mt-1 mb-2">{{ currentProject.detail }}</div>
  <div class="mb-5">
    <v-chip
      @click="
        searchWorkConditions.notDisplayProgress100 =
          !searchWorkConditions.notDisplayProgress100;
        search();
      "
      variant="flat"
      v-if="!searchWorkConditions.notDisplayProgress100"
    >
      進捗度100%以外
    </v-chip>
    <v-chip
      v-else
      @click="
        searchWorkConditions.notDisplayProgress100 =
          !searchWorkConditions.notDisplayProgress100;
        search();
      "
      color="blue"
      variant="flat"
    >
      進捗度100%以外
    </v-chip>
    <!-- <v-checkbox
      label="進捗度100以下"
      v-model="searchWorkConditions.notDisplayProgress100"
      @click="search"
    ></v-checkbox> -->
  </div>
  <v-row>
    <v-col cols="6" xs="6" sm="6" md="3" lg="2" xl="2" xxl="2">
      <v-select
        v-model="searchWorkConditions.categoryName"
        :items="[{ name: '' }, ...categories].map((item) => item.name)"
        label="カテゴリー"
        density="compact"
        variant="outlined"
        @update:model-value="
          () => {
            search();
          }
        "
      ></v-select>
    </v-col>
    <v-col cols="6" xs="6" sm="6" md="3" lg="2" xl="2" xxl="2">
      <v-select
        v-model="searchWorkConditions.priorityName"
        :items="priorities.map((item) => item.name)"
        density="compact"
        variant="outlined"
        label="優先度"
        @update:model-value="
          () => {
            search();
          }
        "
      ></v-select>
    </v-col>
    <v-col cols="6" xs="6" sm="6" md="3" lg="2" xl="2" xxl="2">
      <div class="d-flex">
        <v-select
          v-model="searchWorkConditions.stateName"
          :items="statuses.map((item) => item.name)"
          density="compact"
          variant="outlined"
          label="状況"
          @update:model-value="
            () => {
              search();
            }
          "
        ></v-select>
        <v-chip
          class="ml-2 mt-2"
          @click="
            exceptSelectedSearchState = !exceptSelectedSearchState;
            search();
          "
          variant="flat"
          v-if="!exceptSelectedSearchState"
        >
          以外
        </v-chip>
        <v-chip
          v-else
          class="ml-2 mt-2"
          @click="
            exceptSelectedSearchState = !exceptSelectedSearchState;
            search();
          "
          variant="flat"
          color="blue"
        >
          以外
        </v-chip>
      </div>
    </v-col>
    <v-col cols="6" xs="6" sm="6" md="3" lg="2" xl="2" xxl="2">
      <div class="d-flex">
        <v-combobox
          v-model="searchWorkConditions.staffsName"
          :items="[{ name: '' }, ...projectUsers].map((item) => item.name)"
          density="compact"
          class="mr-3"
          variant="outlined"
          label="担当者"
          @update:model-value="
            () => {
              search();
            }
          "
        ></v-combobox>
        <v-btn
          icon
          color="gray"
          size="small"
          @click="
            searchWorkConditions.staffsName = userInfo.name;
            search();
          "
        >
          <v-icon>mdi-account</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >自身を検索</v-tooltip
          ></v-btn
        >
      </div>
    </v-col>
    <v-col cols="12" xs="12" sm="12" md="12" lg="4" xl="4" xxl="4">
      <v-text-field
        label="キーワード検索"
        prepend-inner-icon="mdi-magnify"
        v-model="searchWorkConditions.word"
        density="compact"
        variant="outlined"
        @keyup.enter="search"
      ></v-text-field>
    </v-col>
  </v-row>
  <workRegistration />
  <div v-cloak>
    <v-card>
      <v-data-table
        :headers="headers"
        items-per-page-text="表示件数 :"
        :items-per-page="itemsPerPage"
        v-model:page="page"
        :items="searchedWorks"
        :height="tableSize"
        :fixed-header="true"
        item-key="id"
        no-data-text="データがありません。"
        :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }"
      >
        <template v-slot:item="{ item }">
          <tr class="tr-data point-cursor">
            <td>
              <v-btn
                icon
                size="x-small"
                color="light-blue"
                class="mr-3"
                @click="openTodo(item.raw)"
              >
                <v-menu
                  activator="parent"
                  location="end"
                  :close-on-content-click="false"
                >
                  <v-card style="width: 350px">
                    <v-card-title class="text-center"
                      >「<span v-if="item.raw.work_id" class="mr-2"
                        ><v-chip size="small" prepend-icon="mdi-car-child-seat">
                          {{ item.raw.children_title }}
                        </v-chip></span
                      >{{
                        omittedText(item.columns.title, 6)
                      }}」をToDoに追加</v-card-title
                    >
                    <v-card-text>
                      <v-text-field
                        v-model="editTodo.day"
                        type="date"
                        label="実施日"
                      ></v-text-field>
                      <v-text-field
                        type="number"
                        v-model="editTodo.target_progress"
                        label="目標進捗（%）"
                      ></v-text-field>
                      <v-text-field
                        type="number"
                        v-model="editTodo.current_progress"
                        label="現在進捗（%）"
                      ></v-text-field>
                      <v-text-field
                        type="number"
                        v-model="editTodo.required_time"
                        label="作業時間"
                      ></v-text-field>
                      <v-text-field
                        type="number"
                        v-model="editTodo.overtime"
                        label="残業時間"
                      ></v-text-field>
                      <div class="text-center">
                        <v-btn icon color="blue" @click="addTodo(item.columns)">
                          <v-icon>mdi-check</v-icon>
                          <v-tooltip activator="parent" location="bottom"
                            >登録</v-tooltip
                          ></v-btn
                        >
                      </div>
                    </v-card-text>
                  </v-card></v-menu
                >
                <v-icon>mdi-checkbox-outline</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >ToDoに追加</v-tooltip
                ></v-btn
              >
              <!-- <v-checkbox
                v-model="item.columns.todo"
                color="blue"
                hide-details
                @change="addTodo(item.columns.id, item.columns.todo)"
              ></v-checkbox> -->
            </td>
            <td @click="openDetailsModal(item.raw)">
              {{ item.columns.id }}
            </td>
            <td @click="openDetailsModal(item.raw)">
              <v-icon
                color="yellow"
                class="mr-2"
                v-if="item.raw.progress == 100"
                >mdi-crown</v-icon
              >
              <v-icon
                color="red"
                class="mr-2"
                v-if="item.raw.progress != 100 && deadlineIsPasted(item.raw.to)"
                >mdi-fire</v-icon
              >
              <span v-if="item.raw.work_id" class="mr-2"
                ><v-chip size="small" prepend-icon="mdi-car-child-seat">
                  {{ item.raw.children_title }}
                </v-chip></span
              ><span>{{ item.columns.title }}</span>
            </td>
            <td @click="openDetailsModal(item.raw)">
              <span
                v-for="(user, index) in addIconBasedOnUserId(
                  item.columns.staffs
                )"
              >
                <v-avatar class="mr-2 mb-1" size="x-small" v-if="user.icon">
                  <v-img
                    :src="baseURL + '/public/uploads/' + user.icon"
                    :alt="user.name"
                  ></v-img
                ></v-avatar>
                <v-avatar class="mr-2 mb-1" size="x-small" v-else>{{
                  String(user.name).charAt(0)
                }}</v-avatar>
                {{ user.name }}
                <span v-if="index != item.columns.staffs.length - 1"> , </span>
              </span>
            </td>
            <td @click="openDetailsModal(item.raw)">
              <v-chip
                v-if="item.raw.stateName.name"
                :color="item.raw.stateName.color"
              >
                {{ item.raw.stateName.name }}
              </v-chip>
            </td>
            <td @click="openDetailsModal(item.raw)">
              <span v-if="item.columns.priority == 2"
                ><v-icon color="red">mdi-arrow-up-thin</v-icon>
                {{ item.raw.priorityName }}
              </span>
              <span v-else-if="item.columns.priority == 3"
                ><v-icon color="green">mdi-arrow-right-thin</v-icon>
                {{ item.raw.priorityName }}
              </span>
              <span v-else-if="item.columns.priority == 4"
                ><v-icon color="blue">mdi-arrow-down-thin</v-icon>
                {{ item.raw.priorityName }}
              </span>
              <span v-else></span>
            </td>
            <td @click="openDetailsModal(item.raw)">
              {{ convertArrayToText(item.raw.categoryName) }}
            </td>
            <td @click="openDetailsModal(item.raw)">
              {{ item.columns.from }}
            </td>
            <td @click="openDetailsModal(item.raw)">
              {{ item.columns.to }}
            </td>
            <td @click="openDetailsModal(item.raw)">
              {{ item.columns.progress }}%
            </td>
          </tr>
        </template>

        <template v-slot:bottom>
          <div class="table-footer">
            <div class="pt-2 pagination" style="width: 500px">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>

            <v-text-field
              :model-value="itemsPerPage"
              class="pa-2 display-num"
              style="max-width: 300px"
              hide-details
              label="表示件数"
              density="compact"
              min="1"
              type="number"
              variant="outlined"
              @update:model-value="itemsPerPage = parseInt($event, 10)"
            ></v-text-field>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
  <workDetailDialog />
  <wikiDetailDialog />
</template>

<script setup>
import { ref, computed } from "vue";
import { useTheme } from "vuetify";
import {
  workRegistrationDialog,
  resetWork,
  editedWork,
  getWork,
  works,
  selectedWork,
  getChildrenWork,
  isWorkDetailsDialogOpen,
  resetChildrenWork,
  getCategory,
  getPriority,
  getStatus,
  searchWorkConditions,
  categories,
  priorities,
  statuses,
  searchedWorks,
  search,
  isSearched,
  resetSearchWorkConditions,
  importExcel,
  outputExcelChoices,
  selectedTemplateName,
  createExcel,
  openDetailsModal,
  getSeDailyReportProcess,
  deadlineIsPasted,
  exceptSelectedSearchState,
} from "../store/work.js";
import {
  getCurrentDate,
  getFutureDate,
  convertArrayToText,
  baseURL,
  postFiles,
  newAttachedFiles,
  omittedText,
  snackbar,
  baseThemeColor,
  themeColor,
  getDepartments,
} from "../store/common.js";
import {
  currentProject,
  isProjectRegistrationDialogOpen,
  editedProject,
  currentProjectUserIds,
  getProject,
  projects,
  participatingProjectIds,
  getParticipatingProjectIds,
} from "../store/project.js";
import {
  convertIdToUserName,
  userInfo,
  projectUsers,
  putUser,
  inputUserInfo,
  getProjectUsers,
  users,
  getUser,
  addIconBasedOnUserId,
} from "../store/user.js";
import { editTodo, resetTodo, addTodo } from "../store/todo.js";
import workRegistration from "./dialogs/workRegistration.vue";
import workDetailDialog from "./dialogs/workDetailDialog.vue";
import {
  VDataTable,
  VDataTableServer,
  VDataTableVirtual,
} from "vuetify/labs/VDataTable";
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import wikiDetailDialog from "./dialogs/wiki/wikiDetailDialog.vue";

const theme = useTheme();
const router = useRouter();
if (!userInfo.value.id) {
  router.push("/login");
}
const headers = [
  { title: "ToDo", key: "todo" },
  { title: "ID", key: "id" },
  { title: "タイトル", key: "title" },
  { title: "担当者", key: "staffs" },
  { title: "状況", key: "stateName.name" },
  { title: "優先度", key: "priority" },
  { title: "カテゴリー", key: "category" },
  { title: "開始日", key: "from" },
  { title: "終了日", key: "to" },
  { title: "進捗度", key: "progress" },
];

searchedWorks.value = [];
onBeforeMount(async () => {
  await getCategory();
  await getPriority();
  await getStatus();
  await getSeDailyReportProcess();
  await getDepartments();
  if (users.value.length == 0) {
    await getUser(0);
  }
  getProjectUsers(currentProjectUserIds.value);
  await getProject(userInfo.value.id);
  getParticipatingProjectIds(projects.value);
  if (localStorage.getItem("currentProject")) {
    currentProject.value = JSON.parse(localStorage.getItem("currentProject"));
  }
  await getWork();
  newAttachedFiles.value = [];
});

const reset = () => {
  isSearched.value = false;
  resetSearchWorkConditions();
  searchedWorks.value = works.value;
};

const page = ref(1);
const itemsPerPage = ref(10);
const pageCount = computed(() => {
  return Math.ceil(searchedWorks.value.length / itemsPerPage.value);
});
const tableSize = computed(() => {
  return window.innerHeight * 0.6;
});

const openTodo = (work) => {
  resetTodo();
  editTodo.value.target_progress = 100;
  editTodo.value.current_progress = work.progress;
};
</script>

<style scoped>
.table-footer {
  position: relative;
  height: 75px;
}
.blue {
  background-color: #2196f3;
  color: white;
}
.pagination {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  max-width: 500px;
}
.display-num {
  position: absolute;
  width: 100px;
  top: 50%;
  right: 2%;
  transform: translate(-2%, -50%);
  -webkit-transform: translate(-2%, -50%);
  -ms-transform: translate(-2%, -50%);
}
@media screen and (max-width: 800px) {
  .pagination {
    max-width: 300px;
    position: static;
    top: none;
    left: none;
    transform: none;
    -webkit-transform: none;
    -ms-transform: none;
  }
  .display-num {
    width: 100px;
    position: static;
    top: none;
    left: none;
    transform: none;
    -webkit-transform: none;
    -ms-transform: none;
  }
  .table-footer {
    position: static;
    display: flex;
  }
}
</style>

<template>
  <div class="text-h4 mb-5">ToDo</div>
  <v-card class="mb-5">
    <v-card-title class="d-flex justify-space-between"
      ><div>ボード</div>
      <div>
        <v-icon class="point-cursor" @click="isEditedBoard = !isEditedBoard"
          >mdi-note-edit-outline</v-icon
        >
      </div></v-card-title
    >
    <v-card-text
      ><v-textarea
        v-if="isEditedBoard"
        v-model="boardContent.content"
        rows="5"
        variant="outlined"
        @blur="
          updateBoard();
          isEditedBoard = false;
        "
      ></v-textarea>
      <MarkDownViewer v-else :source="boardContent.content"
    /></v-card-text>
  </v-card>
  <div class="d-flex mb-1">
    <v-text-field
      v-model="displayDay"
      type="date"
      label="開始日"
      density="compact"
      variant="outlined"
      style="max-width: 300px"
      class="mr-3"
      @update:model-value="
        () => {
          updateDay();
        }
      "
    ></v-text-field>
    <v-text-field
      v-model="displayToDay"
      v-if="todoTab == 'week'"
      type="date"
      label="終了日"
      density="compact"
      variant="outlined"
      style="max-width: 300px"
      class="mr-3"
      @update:model-value="
        () => {
          updateDay();
        }
      "
    ></v-text-field>
    <v-btn icon color="green" class="mr-3">
      <v-menu activator="parent" location="end" :close-on-content-click="false">
        <v-card style="width: 350px">
          <v-card-title class="text-center"
            ><span>SE日報CSV</span></v-card-title
          >
          <v-card-text>
            <v-text-field
              v-model="csvRangeDate.fromDay"
              type="date"
              label="開始日"
            ></v-text-field>
            <v-text-field
              v-model="csvRangeDate.toDay"
              type="date"
              label="終了日"
            ></v-text-field>
            <div class="text-center">
              <v-btn icon color="green" @click="outputSEDailyReportCSV">
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >出力</v-tooltip
                ></v-btn
              >
            </div>
          </v-card-text>
        </v-card></v-menu
      >
      <v-icon>mdi-microsoft-excel</v-icon>
      <v-tooltip activator="parent" location="bottom"
        >SE日報CSV</v-tooltip
      ></v-btn
    >
  </div>
  <v-combobox
    v-model="displayTodo"
    :items="users.map((item) => item.name)"
    label="ToDoを表示しているユーザー"
    class="mb-3 mr-3"
    density="compact"
    variant="outlined"
    multiple
    chips
    @update:model-value="
      () => {
        saveDisplayTodo();
      }
    "
  ></v-combobox>
  <v-alert
    v-if="displayTodoUsers.length == 0"
    class="mb-5"
    color="info"
    icon="$info"
    text="ToDoを表示するユーザーが選択されていません。"
  ></v-alert>
  <v-card>
    <v-tabs v-model="todoTab" bg-color="#F5F5F5" @click="switchToDoTab">
      <v-tab value="day">日</v-tab>
      <v-tab value="week">期間</v-tab>
    </v-tabs>
    <v-window v-model="todoTab">
      <v-window-item value="day">
        <div class="d-flex parent-todo">
          <v-card
            v-for="user of displayTodoUsers"
            class="todo mr-3"
            :style="{ maxHeight: windowHeight * 0.75 + 'px' }"
          >
            <v-card-title class="d-flex mb-1"
              ><v-avatar class="mr-2" size="small" v-if="user.icon">
                <v-img
                  :src="baseURL + '/public/uploads/' + user.icon"
                  :alt="user.name"
                ></v-img></v-avatar
              ><v-avatar class="mr-2 mb-1" size="small" color="grey" v-else
                >{{ String(user.name).charAt(0)
                }}<v-tooltip activator="parent" location="bottom"
                  >アカウント編集（{{ userInfo.name }}）</v-tooltip
                ></v-avatar
              >
              <div>{{ user.name }}</div>
            </v-card-title>
            <v-card-text class="new-line memo"
              ><p
                class="mb-1"
                @click="editMemo(user)"
                :class="{ 'point-cursor': user.id === userInfo.id }"
              >
                <v-icon>mdi-note-edit-outline</v-icon> メモ
              </p>
              <v-textarea
                v-if="user.isEditedMemo"
                v-model="user.memo"
                rows="5"
                variant="outlined"
                @blur="saveMemo(user)"
              ></v-textarea>
              <p v-else>{{ user.memo }}</p></v-card-text
            >
            <memoDialog />
            <v-table class="mb-2 mx-2">
              <thead>
                <tr>
                  <th v-if="user.id === userInfo.id" class="a">編集</th>
                  <th>仕事内容</th>
                  <th>目標進捗</th>
                  <th>現在進捗</th>
                  <th>作業時間</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="work of user.detail_todo" :key="work.id">
                  <td v-if="user.id === userInfo.id">
                    <v-btn
                      icon
                      size="x-small"
                      color="light-blue"
                      class="mr-3"
                      @click="openTodo(work)"
                    >
                      <v-menu
                        activator="parent"
                        location="end"
                        :close-on-content-click="false"
                      >
                        <v-card style="min-width: 350px">
                          <div class="d-flex justify-space-between">
                            <v-card-title class="text-center"
                              ><span class="mr-3"
                                >「<span v-if="work.work_id" class="mr-2"
                                  ><v-chip
                                    size="small"
                                    prepend-icon="mdi-car-child-seat"
                                  >
                                    {{ work.children_title }}
                                  </v-chip></span
                                >{{ omittedText(work.title, 6) }}」を編集</span
                              ></v-card-title
                            ><v-btn
                              icon
                              size="small"
                              color="red"
                              class="mt-1 mr-1"
                              @click="
                                deleteContent = 'todo';
                                deleteTarget = '';
                                isDeleteDialogOpen = true;
                              "
                            >
                              <v-icon>mdi-delete</v-icon>
                              <v-tooltip activator="parent" location="bottom"
                                >削除</v-tooltip
                              ></v-btn
                            >
                          </div>
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
                              <v-btn icon color="blue">
                                <v-icon>mdi-check</v-icon>
                                <v-tooltip activator="parent" location="bottom"
                                  >編集完了</v-tooltip
                                ><v-menu
                                  activator="parent"
                                  location="end"
                                  :close-on-content-click="false"
                                >
                                  <v-list>
                                    <v-list-item>
                                      <v-list-item-title
                                        class="tr-data point-cursor py-4"
                                        @click="updateTodo(work.day)"
                                        >上書き</v-list-item-title
                                      >
                                      <v-divider></v-divider>
                                      <v-list-item-title
                                        class="tr-data point-cursor py-4"
                                        @click="addCopyTodo"
                                        >複製</v-list-item-title
                                      >
                                    </v-list-item>
                                  </v-list>
                                </v-menu></v-btn
                              >
                            </div>
                          </v-card-text>
                        </v-card></v-menu
                      >
                      <v-icon>mdi-checkbox-outline</v-icon>
                      <v-tooltip activator="parent" location="bottom"
                        >編集</v-tooltip
                      ></v-btn
                    >
                  </td>
                  <td
                    @click="openWorkDetailsModal(work)"
                    color="blue"
                    hide-details
                    class="point-cursor tr-data py-2"
                  >
                    <v-icon
                      color="yellow"
                      class="mr-2"
                      v-if="work.current_progress == 100"
                      >mdi-crown</v-icon
                    >
                    <v-icon
                      color="red"
                      class="mr-2"
                      v-if="work.progress != 100 && deadlineIsPasted(work.to)"
                      >mdi-fire</v-icon
                    >
                    <span v-if="work.work_id"
                      ><v-chip size="small" prepend-icon="mdi-car-child-seat">
                        {{ work.children_title }}
                      </v-chip></span
                    >
                    {{ `【${work.project_name}】${work.title}` }}
                  </td>
                  <td>{{ work.target_progress }}%</td>
                  <td>{{ work.current_progress }}%</td>
                  <td>
                    {{ Number(work.required_time) + Number(work.overtime) }}H
                  </td>
                </tr>
                <tr v-if="user.detail_todo.length > 0">
                  <td v-if="user.id === userInfo.id"></td>
                  <td></td>
                  <td></td>
                  <td>合計</td>
                  <td>{{ arraySum(user.detail_todo) }}H</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>
      </v-window-item>

      <v-window-item value="week">
        <div
          style="overflow-y: scroll; overflow-x: scroll"
          :style="{ maxHeight: windowHeight * 0.75 + 'px' }"
        >
          <table class="week-table">
            <thead>
              <tr>
                <th class="week-th top-td"></th>
                <th v-for="date of displayTodoTerm" class="week-th">
                  {{ date }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user of displayTodoUsers">
                <td class="pa-3 week-td top-td">
                  <div class="d-flex mb-1 text-h6">
                    <v-avatar class="mr-2" size="small" v-if="user.icon">
                      <v-img
                        :src="baseURL + '/public/uploads/' + user.icon"
                        :alt="user.name"
                      ></v-img></v-avatar
                    ><v-avatar
                      class="mr-2 mb-1"
                      size="small"
                      color="grey"
                      v-else
                      >{{ String(user.name).charAt(0)
                      }}<v-tooltip activator="parent" location="bottom"
                        >アカウント編集（{{ userInfo.name }}）</v-tooltip
                      ></v-avatar
                    >
                    <div>{{ user.name }}</div>
                  </div>
                  <div class="new-line memo">
                    <p
                      class="mb-1"
                      @click="editMemo(user)"
                      :class="{ 'point-cursor': user.id === userInfo.id }"
                    >
                      <v-icon>mdi-note-edit-outline</v-icon> メモ
                    </p>
                    <v-textarea
                      v-if="user.isEditedMemo"
                      v-model="user.memo"
                      rows="5"
                      variant="outlined"
                      @blur="saveMemo(user)"
                    ></v-textarea>
                    <p v-else>{{ user.memo }}</p>
                  </div>
                  <memoDialog />
                </td>
                <td v-for="date of displayTodoTerm" width="300" class="week-td">
                  <ul>
                    <li
                      @click="openWorkDetailsModal(work)"
                      v-for="work of user.detail_todo[date]"
                      class="week-task point-cursor tr-data mb-2"
                    >
                      <v-icon
                        color="yellow"
                        class="mr-2"
                        v-if="work.current_progress == 100"
                        >mdi-crown</v-icon
                      >
                      <v-icon
                        color="red"
                        class="mr-2"
                        v-if="work.progress != 100 && deadlineIsPasted(work.to)"
                        >mdi-fire</v-icon
                      >
                      <span v-if="work.work_id"
                        ><v-chip size="small" prepend-icon="mdi-car-child-seat">
                          {{ work.children_title }}
                        </v-chip></span
                      >
                      {{ `【${work.project_name}】${work.title}` }}（{{
                        Number(work.required_time) + Number(work.overtime)
                      }}H）
                      <v-btn
                        icon
                        v-if="user.id === userInfo.id"
                        size="x-small"
                        color="light-blue"
                        @click="openTodo(work)"
                      >
                        <v-menu
                          activator="parent"
                          location="end"
                          :close-on-content-click="false"
                        >
                          <v-card style="min-width: 350px">
                            <div class="d-flex justify-space-between">
                              <v-card-title class="text-center"
                                ><span class="mr-3"
                                  >「<span v-if="work.work_id" class="mr-2"
                                    ><v-chip
                                      size="small"
                                      prepend-icon="mdi-car-child-seat"
                                    >
                                      {{ work.children_title }}
                                    </v-chip></span
                                  >{{
                                    omittedText(work.title, 6)
                                  }}」を編集</span
                                ></v-card-title
                              ><v-btn
                                icon
                                size="small"
                                color="red"
                                class="mt-1 mr-1"
                                @click="
                                  deleteContent = 'todo';
                                  deleteTarget = '';
                                  previousToDoDay = work.day;
                                  isDeleteDialogOpen = true;
                                "
                              >
                                <v-icon>mdi-delete</v-icon>
                                <v-tooltip activator="parent" location="bottom"
                                  >削除</v-tooltip
                                ></v-btn
                              >
                            </div>
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
                                <v-btn icon color="blue">
                                  <v-icon>mdi-check</v-icon>
                                  <v-tooltip
                                    activator="parent"
                                    location="bottom"
                                    >編集完了</v-tooltip
                                  ><v-menu
                                    activator="parent"
                                    location="end"
                                    :close-on-content-click="false"
                                  >
                                    <v-list>
                                      <v-list-item>
                                        <v-list-item-title
                                          class="tr-data point-cursor py-4"
                                          @click="updateTodo(work.day)"
                                          >上書き</v-list-item-title
                                        >
                                        <v-divider></v-divider>
                                        <v-list-item-title
                                          class="tr-data point-cursor py-4"
                                          @click="addCopyTodo(work.day)"
                                          >複製</v-list-item-title
                                        >
                                      </v-list-item>
                                    </v-list>
                                  </v-menu></v-btn
                                >
                              </div>
                            </v-card-text>
                          </v-card></v-menu
                        >
                        <v-icon>mdi-checkbox-outline</v-icon>
                        <v-tooltip activator="parent" location="bottom"
                          >編集</v-tooltip
                        ></v-btn
                      >
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-window-item>
    </v-window>
  </v-card>
  <workDetailDialog />
  <deleteDialog :content="deleteContent" />
</template>

<script setup>
import { onBeforeMount, ref, nextTick } from "vue";
import {
  getWork,
  isWorkDetailsDialogOpen,
  selectedWork,
  openDetailsModal,
  deadlineIsPasted,
  setWork,
  resetWork,
} from "../store/work.js";
import {
  projects,
  getParticipatingProjectIds,
  getProject,
  getProjectAll,
} from "../store/project.js";
import {
  users,
  isOpenUserMemoDialog,
  userInfo,
  addTodo,
  putUser,
  inputUserInfo,
  convertUserNameToId,
  convertIdToUserName,
  getUser,
  boardContent,
  getBoard,
  updateBoard,
} from "../store/user.js";
import {
  getTodoWithDayAndUserId,
  displayTodoUsers,
  editTodo,
  putTodo,
  postTodo,
  outputSEDailyReportCSV,
  csvRangeDate,
  displayTodoTerm,
  todoTab,
  previousToDoDay,
} from "../store/todo.js";
import { getCurrentDate, omittedText } from "../store/common.js";
import workDetailDialog from "./dialogs/workDetailDialog.vue";
import memoDialog from "./dialogs/memoDialog.vue";
import {
  baseURL,
  markDownColor,
  isDeleteDialogOpen,
  deleteContent,
  deleteTarget,
  snackbar,
  getFutureDate,
} from "../store/common.js";
import { getNotification } from "../store/notification.js";
import { useRoute, useRouter } from "vue-router";
import MarkDownViewer from "./dialogs/MarkDownViewer.vue";
import deleteDialog from "./dialogs/deleteDialog.vue";

const router = useRouter();
markDownColor.value = "#E0E0E0";
const editMemo = (user) => {
  if (userInfo.value.id == user.id) {
    user.isEditedMemo = !user.isEditedMemo;
  }
};
if (!userInfo.value.id) {
  router.push("/login");
}
onBeforeMount(async () => {
  await getProjectAll();
  await getWork(0);
  // await getProject(userInfo.value.id);
  getParticipatingProjectIds(projects.value);
  await getUser(0);
  await getBoard(1);
  displayTodo.value = convertIdToUserName(userInfo.value.display_todo);
  displayDay.value = getCurrentDate();
  displayToDay.value = getFutureDate(7);
  //getDetailTodo();
  updateDay();
  getNotification();
});

const displayTodo = ref([]);
const displayDay = ref("");
const displayToDay = ref("");

const windowHeight = window.innerHeight;
const saveDisplayTodo = async () => {
  inputUserInfo.value = userInfo.value;
  inputUserInfo.value.display_todo = convertUserNameToId(displayTodo.value);
  await putUser();
  updateDay();
};

const updateDay = () => {
  nextTick(async () => {
    if (todoTab.value == "week") {
      await getTodoWithDayAndUserId(
        displayDay.value,
        displayToDay.value,
        userInfo.value.display_todo.join(",")
      );
    } else {
      await getTodoWithDayAndUserId(
        displayDay.value,
        null,
        userInfo.value.display_todo.join(",")
      );
    }
  });
};

const openTodo = (work) => {
  editTodo.value.id = work.todo_id;
  editTodo.value.day = work.day;
  editTodo.value.work_id = work.id;
  editTodo.value.user_id = userInfo.value.id;
  editTodo.value.target_progress = work.target_progress;
  editTodo.value.current_progress = work.current_progress;
  editTodo.value.required_time = work.required_time;
  editTodo.value.overtime = work.overtime;
};

const updateTodo = async (day) => {
  await putTodo(day);
  for (const user of displayTodoUsers.value) {
    if ((user.id = userInfo.value.id)) {
      if (todoTab.value == "day") {
        for (const [index, work] of Object.entries(user.detail_todo)) {
          if (work.todo_id == editTodo.value.id) {
            work.day = editTodo.value.day;
            work.target_progress = editTodo.value.target_progress;
            work.current_progress = editTodo.value.current_progress;
            work.required_time = editTodo.value.required_time;
            work.overtime = editTodo.value.overtime;
            if (editTodo.value.day != displayDay.value) {
              user.detail_todo.splice(index, 1);
            }
          }
        }
        break;
      } else {
        let isExistence = false;

        for (const [index, work] of Object.entries(user.detail_todo[day])) {
          if (work.todo_id == editTodo.value.id) {
            work.day = editTodo.value.day;
            work.target_progress = editTodo.value.target_progress;
            work.current_progress = editTodo.value.current_progress;
            work.required_time = editTodo.value.required_time;
            work.overtime = editTodo.value.overtime;
            if (editTodo.value.day != day) {
              for (const work2 of user.detail_todo[editTodo.value.day]) {
                if (work2.work_id_of_todo == work.work_id_of_todo) {
                  isExistence = true;
                  break;
                }
              }
              if (!isExistence) {
                user.detail_todo[editTodo.value.day].push(
                  Object.assign({}, work)
                );
                user.detail_todo[day].splice(index, 1);
              }
            }
          }
        }
        break;
      }
    }
  }
};

const addCopyTodo = async (day = getCurrentDate()) => {
  await postTodo();
  let isExistence = false;
  if (todoTab.value == "week") {
    for (const user of displayTodoUsers.value) {
      if ((user.id = userInfo.value.id)) {
        for (const [index, work] of Object.entries(user.detail_todo[day])) {
          if (work.todo_id == editTodo.value.id) {
            let editTodoWork = Object.assign({}, work);
            editTodoWork.day = editTodo.value.day;
            editTodoWork.target_progress = editTodo.value.target_progress;
            editTodoWork.current_progress = editTodo.value.current_progress;
            editTodoWork.required_time = editTodo.value.required_time;
            editTodoWork.overtime = editTodo.value.overtime;
            if (editTodo.value.day != day) {
              for (const work2 of user.detail_todo[editTodo.value.day]) {
                if (work2.work_id_of_todo == work.work_id_of_todo) {
                  isExistence = true;
                  break;
                }
              }
              if (!isExistence) {
                user.detail_todo[editTodo.value.day].push(
                  Object.assign({}, editTodoWork)
                );
              }
            }
          }
        }
        break;
      }
    }
  }
};

const isEditedBoard = ref(false);
const isEditedMemo = ref(false);

const saveMemo = async (user) => {
  userInfo.value = user;
  inputUserInfo.value = userInfo.value;
  user.isEditedMemo = false;
  await putUser();
};

const arraySum = (items) => {
  return items.reduce(
    (sum, item) => sum + Number(item.required_time) + Number(item.overtime),
    0
  );
};

const openWorkDetailsModal = (work) => {
  resetWork();
  openDetailsModal(setWork(selectedWork.value, work));
};

const switchToDoTab = () => {
  displayToDay.value = getFutureDate(7, new Date(displayDay.value));
  updateDay();
};
</script>

<style scoped>
.parent-todo {
  overflow-x: scroll;
}
.todo {
  min-width: 600px;
  overflow-y: scroll;
}
.top-td {
  min-width: 500px;
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  background-color: white;
  z-index: 10;
}

.week-th,
.week-td {
  border: #f5f5f5 solid 1px; /* 枠線指定 */
  min-width: 300px;
  padding: 10px; /* 余白指定 */
}
.week-th {
  font-weight: normal; /* 文字の太さ指定 */
  /* tbody内のセルより手前に表示する */
  z-index: 1;
}
.week-table thead {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: white;
  /* ヘッダー行内の他のセルより手前に表示する */
  z-index: 10;
}

.week-table {
  border-collapse: collapse; /* セルの線を重ねる */
}
.week-task {
  margin-left: 15px;
}
.memo {
  font-size: 1rem;
}
</style>

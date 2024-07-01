<template>
  <div class="text-h4 mb-5">ToDo</div>
  <v-card class="mb-5">
    <v-card-title class="d-flex justify-space-between"
      ><v-menu location="end">
        <template v-slot:activator="{ props }">
          <div
            class="font-italic text-caption point-cursor tr-data"
            v-bind="props"
          >
            {{ boardContent.department_name }}のボード
          </div>
        </template>
        <v-list style="max-height: 500px">
          <v-list-item
            v-for="(item, index) in departmentsForInput.filter(
              (item) => item.name != '--'
            )"
            :key="index"
            :value="index"
            @click="getBoard(item.id)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <div>
        <v-icon
          class="point-cursor tr-data"
          @click="isEditedBoard = !isEditedBoard"
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
          updateToDoDay();
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
          updateToDoDay();
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
  <div class="d-flex">
    <v-combobox
      v-model="displayTodo"
      :items="usersForInput.map((item) => item.name)"
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
    <v-menu
      v-model="filterStaffMenu"
      :close-on-content-click="false"
      location="end"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="grey" v-bind="props" icon size="small">
          <v-icon>mdi-filter-outline</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >部署でユーザーを絞り込む</v-tooltip
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
  </div>
  <v-alert
    v-if="displayTodoUsers.length == 0"
    class="mb-5"
    color="blue"
    icon="$info"
    text="ToDoを表示するユーザーが選択されていません。"
  ></v-alert>
  <v-card>
    <v-tabs v-model="todoTab" bg-color="grey-lighten-4" @click="switchToDoTab">
      <v-tab value="day">日</v-tab>
      <v-tab value="week">期間</v-tab>
    </v-tabs>
    <v-window v-model="todoTab">
      <v-window-item value="day">
        <div
          class="d-flex parent-todo"
          :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }"
        >
          <v-card
            v-for="user of displayTodoUsers"
            class="todo mr-3"
            :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }"
            :style="{ maxHeight: windowHeight * 0.75 + 'px' }"
          >
            <v-card-subtitle class="mt-2 mb-n2">{{
              user.department_name
            }}</v-card-subtitle>
            <v-card-title class="d-flex mb-1"
              ><v-avatar class="mr-2" size="small" v-if="user.icon">
                <v-img
                  :src="baseURL + '/public/uploads/' + user.icon"
                  :alt="user.name"
                ></v-img></v-avatar
              ><v-avatar class="mr-2 mb-1" size="small" color="grey" v-else>{{
                String(user.name).charAt(0)
              }}</v-avatar>
              <div>{{ user.name }}</div>
            </v-card-title>
            <div v-if="user.id == userInfo.id" class="todo-register">
              <v-btn
                icon
                size="small"
                color="yellow"
                class="mr-3"
                @click="
                  resetTodo();
                  todoRegistrationDialog = true;
                "
                ><v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >ToDo追加</v-tooltip
                ></v-btn
              >
            </div>
            <v-card-text class="new-line memo"
              ><p
                class="mb-1"
                @click="editMemo(user)"
                :class="{ 'point-cursor tr-data': user.id === userInfo.id }"
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
                              ><span class="mr-3" v-if="work.work_id_of_todo"
                                >「<span v-if="work.work_id" class="mr-2"
                                  ><v-chip
                                    size="small"
                                    prepend-icon="mdi-car-child-seat"
                                  >
                                    {{ work.children_title }}
                                  </v-chip></span
                                >{{ omittedText(work.title, 6) }}」を編集</span
                              ><span v-else
                                >「{{
                                  omittedText(work.todo_title, 6)
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
                              v-if="!work.work_id_of_todo"
                              v-model="editTodo.title"
                              label="タイトル"
                              required
                            ></v-text-field>
                            <v-select
                              v-if="!work.work_id_of_todo"
                              v-model="editTodo.project"
                              :items="
                                projects
                                  .filter((item) =>
                                    item.staff_ids.includes(userInfo.id)
                                  )
                                  .map(
                                    (item) =>
                                      `${item.title}(${item.project_no})`
                                  )
                              "
                              label="プロジェクト"
                            ></v-select>
                            <v-select
                              v-if="!work.work_id_of_todo"
                              v-model="editTodo.se_daily_report_process_name"
                              :items="
                                seDailyReportProcesses.map(
                                  (item) => `${item.no}.${item.name}`
                                )
                              "
                              label="SE日報工程"
                            ></v-select>
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
                            <v-checkbox
                              v-if="work.work_id_of_todo"
                              v-model="reflectionWorkFlg"
                              label="課題に作業時間と現在進捗を加算"
                              color="blue"
                              class="my-n4"
                            ></v-checkbox>
                            <div class="text-center">
                              <v-btn
                                icon
                                color="blue"
                                v-if="reflectionWorkFlg"
                                @click="updateTodo(work.day)"
                              >
                                <v-icon>mdi-check</v-icon>
                                <v-tooltip activator="parent" location="bottom"
                                  >上書き</v-tooltip
                                ></v-btn
                              >
                              <v-btn icon color="blue" v-else>
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
                    v-if="work.work_id_of_todo"
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
                  <td v-else>
                    <v-icon
                      color="yellow"
                      class="mr-2"
                      v-if="work.current_progress == 100"
                      >mdi-crown</v-icon
                    >{{ work.todo_title }}
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
          :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }"
        >
          <table class="week-table">
            <thead>
              <tr>
                <th class="top-td week-th bg-grey-lighten-4"></th>
                <th
                  v-for="date of displayTodoTerm"
                  class="week-th"
                  :class="{
                    'bg-blue-lighten-4': getWeekDay(date) == '土',
                    'bg-red-lighten-4': getWeekDay(date) == '日',
                    'bg-grey-lighten-4':
                      getWeekDay(date) != '土' && getWeekDay(date) != '日',
                  }"
                >
                  {{ date }}（{{ getWeekDay(date) }}）
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user of displayTodoUsers">
                <td class="pa-3 week-td top-td bg-grey-lighten-4">
                  <div class="text-medium-emphasis text-subtitle-1">
                    {{ user.department_name }}
                  </div>
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
                      >{{ String(user.name).charAt(0) }}</v-avatar
                    >
                    <div>{{ user.name }}</div>
                  </div>
                  <div v-if="user.id == userInfo.id" class="todo-register">
                    <v-btn
                      icon
                      size="small"
                      color="yellow"
                      class="mr-3"
                      @click="
                        resetTodo();
                        todoRegistrationDialog = true;
                      "
                      ><v-icon>mdi-plus</v-icon>
                      <v-tooltip activator="parent" location="bottom"
                        >ToDo追加</v-tooltip
                      ></v-btn
                    >
                  </div>
                  <div class="new-line memo">
                    <p
                      class="mb-1"
                      @click="editMemo(user)"
                      :class="{
                        'point-cursor tr-data': user.id === userInfo.id,
                      }"
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
                      v-for="work of user.detail_todo[date]"
                      class="week-task mb-2"
                    >
                      <span
                        v-if="work.work_id_of_todo"
                        class="point-cursor tr-data"
                        @click="openWorkDetailsModal(work)"
                        ><v-icon
                          color="yellow"
                          class="mr-2"
                          v-if="work.current_progress == 100"
                          >mdi-crown</v-icon
                        >
                        <v-icon
                          color="red"
                          class="mr-2"
                          v-if="
                            work.progress != 100 && deadlineIsPasted(work.to)
                          "
                          >mdi-fire</v-icon
                        >
                        <span v-if="work.work_id"
                          ><v-chip
                            size="small"
                            prepend-icon="mdi-car-child-seat"
                          >
                            {{ work.children_title }}
                          </v-chip></span
                        >
                        {{ `【${work.project_name}】${work.title}` }}（{{
                          Number(work.required_time) + Number(work.overtime)
                        }}H）</span
                      >
                      <span v-else
                        ><v-icon
                          color="yellow"
                          class="mr-2"
                          v-if="work.current_progress == 100"
                          >mdi-crown</v-icon
                        >{{ work.todo_title }}（{{
                          Number(work.required_time) + Number(work.overtime)
                        }}H）
                      </span>
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
                                ><span class="mr-3" v-if="work.work_id_of_todo"
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
                                ><span v-else
                                  >「{{
                                    omittedText(work.todo_title, 6)
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
                                v-if="!work.work_id_of_todo"
                                v-model="editTodo.title"
                                label="タイトル"
                                required
                              ></v-text-field>
                              <v-select
                                v-if="!work.work_id_of_todo"
                                v-model="editTodo.project"
                                :items="
                                  projects
                                    .filter((item) =>
                                      item.staff_ids.includes(userInfo.id)
                                    )
                                    .map(
                                      (item) =>
                                        `${item.title}(${item.project_no})`
                                    )
                                "
                                label="プロジェクト"
                              ></v-select>
                              <v-select
                                v-if="!work.work_id_of_todo"
                                v-model="editTodo.se_daily_report_process_name"
                                :items="
                                  seDailyReportProcesses.map(
                                    (item) => `${item.no}.${item.name}`
                                  )
                                "
                                label="SE日報工程"
                              ></v-select>
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
                              <v-checkbox
                                v-if="work.work_id_of_todo"
                                v-model="reflectionWorkFlg"
                                label="課題に作業時間と現在進捗を加算"
                                color="blue"
                                class="my-n4"
                              ></v-checkbox>

                              <div class="text-center">
                                <v-btn
                                  icon
                                  color="blue"
                                  v-if="reflectionWorkFlg"
                                  @click="updateTodo(work.day)"
                                >
                                  <v-icon>mdi-check</v-icon>
                                  <v-tooltip
                                    activator="parent"
                                    location="bottom"
                                    >上書き</v-tooltip
                                  ></v-btn
                                >
                                <v-btn icon color="blue" v-else>
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
  <todoRegistration />
  <wikiDetailDialog />
  <deleteDialog :content="deleteContent" />
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import {
  getWork,
  isWorkDetailsDialogOpen,
  selectedWork,
  openDetailsModal,
  deadlineIsPasted,
  setWork,
  resetWork,
  seDailyReportProcesses,
  convertSeDailyReportProcessIdToName,
  convertSeDailyReportProcessNameToId,
  postOnlyWorkProgressAndTime,
  getStatus,
  statuses,
} from "../store/work.js";
import {
  projects,
  getParticipatingProjectIds,
  getProject,
  getProjectAll,
  convertProjectProjectNoToName,
  convertProjectNameToProjectNo,
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
  usersForInput,
  filterStaffs,
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
  todoRegistrationDialog,
  resetTodo,
  displayDay,
  displayToDay,
  updateToDoDay,
} from "../store/todo.js";
import {
  getCurrentDate,
  omittedText,
  departmentsForInput,
  getDepartments,
  baseThemeColor,
} from "../store/common.js";
import workDetailDialog from "./dialogs/workDetailDialog.vue";
import memoDialog from "./dialogs/memoDialog.vue";
import {
  baseURL,
  markDownColor,
  isDeleteDialogOpen,
  deleteContent,
  deleteTarget,
  getFutureDate,
} from "../store/common.js";
import { useRoute, useRouter } from "vue-router";
import MarkDownViewer from "./dialogs/MarkDownViewer.vue";
import deleteDialog from "./dialogs/deleteDialog.vue";
import todoRegistration from "./dialogs/todoRegistrarionDialog.vue";
import wikiDetailDialog from "./dialogs/wiki/wikiDetailDialog.vue";

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

const filterStaffMenu = ref(false);
const filterDepartment = ref("");
onBeforeMount(async () => {
  await getProjectAll();
  await getWork(0);
  getParticipatingProjectIds(projects.value);
  await getDepartments();
  await getUser(0);
  await getBoard(userInfo.value.department);
  displayTodo.value = convertIdToUserName(userInfo.value.display_todo);
  displayDay.value = getCurrentDate();
  displayToDay.value = getFutureDate(7);
  updateToDoDay();
});

const displayTodo = ref([]);
const reflectionWorkFlg = ref(false);

const windowHeight = window.innerHeight;
const saveDisplayTodo = async () => {
  inputUserInfo.value = userInfo.value;
  inputUserInfo.value.display_todo = convertUserNameToId(displayTodo.value);
  await putUser();
  updateToDoDay();
};

const openTodo = (work) => {
  editTodo.value.id = work.todo_id;
  if (!work.work_id_of_todo) {
    editTodo.value.title = work.todo_title;
    editTodo.value.se_daily_report_process = work.todo_se_daily_report_process;
    editTodo.value.se_daily_report_process_name =
      convertSeDailyReportProcessIdToName(work.todo_se_daily_report_process);
    editTodo.value.project_no = work.todo_project_no;
    editTodo.value.project = convertProjectProjectNoToName(
      work.todo_project_no
    );
  }
  editTodo.value.day = work.day;
  editTodo.value.work_id = work.id;
  editTodo.value.user_id = userInfo.value.id;
  editTodo.value.target_progress = work.target_progress;
  editTodo.value.current_progress = work.current_progress;
  editTodo.value.required_time = work.required_time;
  editTodo.value.overtime = work.overtime;
  reflectionWorkFlg.value = false;
};

const updateTodo = async (day) => {
  if (!editTodo.value.work_id) {
    editTodo.value.se_daily_report_process =
      convertSeDailyReportProcessNameToId(
        editTodo.value.se_daily_report_process_name
      );
    editTodo.value.project_no = convertProjectNameToProjectNo(
      editTodo.value.project
    );
  }
  await putTodo(day);
  for (const user of displayTodoUsers.value) {
    if (user.id == userInfo.value.id) {
      if (todoTab.value == "day") {
        for (const [index, work] of Object.entries(user.detail_todo)) {
          if (work.todo_id == editTodo.value.id) {
            if (!work.work_id_of_todo) {
              work.todo_title = editTodo.value.title;
              work.todo_se_daily_report_process =
                editTodo.value.se_daily_report_process;
              work.todo_project_no = editTodo.value.project_no;
            }
            work.day = editTodo.value.day;
            work.target_progress = editTodo.value.target_progress;
            work.current_progress = editTodo.value.current_progress;
            work.required_time = editTodo.value.required_time;
            work.overtime = editTodo.value.overtime;

            if (reflectionWorkFlg.value) {
              work.progress = editTodo.value.current_progress;
              work.actual_time =
                Number(editTodo.value.required_time) +
                Number(editTodo.value.overtime) +
                Number(work.actual_time);
              if (editTodo.value.current_progress == 100) {
                await getStatus(work.project);
                for (const state of statuses.value) {
                  if (state.name == "完了") {
                    work.state = state.id;
                    work.stateName.name = state.name;
                    work.stateName.color = state.color;
                    break;
                  }
                }
              }
              await postOnlyWorkProgressAndTime(
                editTodo.value.work_id,
                work.actual_time,
                work.progress,
                work.state
              );
            }
            if (editTodo.value.day != displayDay.value) {
              user.detail_todo.splice(index, 1);
            }
          }
        }
      } else {
        let isExistence = false;

        for (const [index, work] of Object.entries(user.detail_todo[day])) {
          if (work.todo_id == editTodo.value.id) {
            if (!work.work_id_of_todo) {
              work.todo_title = editTodo.value.title;
              work.todo_se_daily_report_process =
                editTodo.value.se_daily_report_process;
              work.todo_project_no = editTodo.value.project_no;
            }
            work.day = editTodo.value.day;
            work.target_progress = editTodo.value.target_progress;
            work.current_progress = editTodo.value.current_progress;
            work.required_time = editTodo.value.required_time;
            work.overtime = editTodo.value.overtime;

            if (reflectionWorkFlg.value) {
              work.progress = editTodo.value.current_progress;
              work.actual_time =
                Number(editTodo.value.required_time) +
                Number(editTodo.value.overtime) +
                Number(work.actual_time);
              if (editTodo.value.current_progress == 100) {
                await getStatus(work.project);
                for (const state of statuses.value) {
                  if (state.name == "完了") {
                    work.state = state.id;
                    work.stateName.name = state.name;
                    work.stateName.color = state.color;
                    break;
                  }
                }
              }
              await postOnlyWorkProgressAndTime(
                editTodo.value.work_id,
                work.actual_time,
                work.progress,
                work.state
              );
            }

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
  if (!editTodo.value.work_id) {
    editTodo.value.se_daily_report_process =
      convertSeDailyReportProcessNameToId(
        editTodo.value.se_daily_report_process_name
      );
    editTodo.value.project_no = convertProjectNameToProjectNo(
      editTodo.value.project
    );
  }
  await postTodo();
  let isExistence = false;
  if (todoTab.value == "week") {
    for (const user of displayTodoUsers.value) {
      if (user.id == userInfo.value.id) {
        for (const [index, work] of Object.entries(user.detail_todo[day])) {
          if (work.todo_id == editTodo.value.id) {
            let editTodoWork = Object.assign({}, work);
            if (!work.work_id_of_todo) {
              editTodoWork.todo_title = editTodo.value.title;
              editTodoWork.todo_se_daily_report_process =
                editTodo.value.se_daily_report_process;
              editTodoWork.todo_project_no = editTodo.value.project_no;
            }
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
  updateToDoDay();
};

const getWeekDay = (date) => {
  var weekDay = ["日", "月", "火", "水", "木", "金", "土"];
  return weekDay[new Date(date).getDay()];
};
</script>

<style scoped>
.parent-todo {
  overflow-x: scroll;
  position: relative;
}
.todo-register {
  position: absolute;
  top: 8px;
  right: 2px;
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
  z-index: 10;
}
.top-td:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-left: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  z-index: 10;
}
.week-table thead:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  z-index: -1;
}
.front-day {
  min-width: 500px;
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 20;
}
.week-td {
  border: #eeeeee solid 1px; /* 枠線指定 */
  min-width: 300px;
  padding: 10px; /* 余白指定 */
}
.week-th {
  border: #eeeeee solid 1px; /* 枠線指定 */
  min-width: 300px;
  padding: 10px; /* 余白指定 */
  font-weight: normal; /* 文字の太さ指定 */
}
.week-table thead {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 100;
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
.bg-blue {
  background-color: #1976d2;
}
.bg-red {
  background-color: #d32f2f;
}
.bg-grey {
  background-color: #fafafa;
}
</style>

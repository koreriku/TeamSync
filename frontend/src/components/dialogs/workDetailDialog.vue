<template>
  <v-dialog v-model="isWorkDetailsDialogOpen" max-width="1250px">
    <v-card id="main" :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }">
      <v-card-text>
        <v-card class="mb-5">
          <v-card-text>
            <div class="d-flex justify-space-between ma-3">
              <div class="pt-2">
                <p class="text-medium-emphasis">
                  <span class="mr-2">{{ selectedWork.project_name }}</span
                  ><v-icon
                    color="yellow"
                    class="mr-2"
                    v-if="selectedWork.progress == 100"
                    >mdi-crown</v-icon
                  ><v-icon
                    color="red"
                    class="mr-2"
                    v-if="
                      selectedWork.progress != 100 &&
                      deadlineIsPasted(selectedWork.to)
                    "
                    >mdi-fire</v-icon
                  ><v-icon v-if="selectedWork.work_id"
                    >mdi-car-child-seat</v-icon
                  >
                </p>
                <p class="text-h4">
                  {{ selectedWork.id }}.
                  <span v-if="selectedWork.work_id"
                    >【{{ selectedWork.children_title }}】</span
                  >{{ selectedWork.title }}
                </p>
              </div>
              <div>
                <v-btn
                  icon
                  color="grey"
                  @click="
                    getLink(`${baseURL}/TeamSync/?work_id=${selectedWork.id}`)
                  "
                  class="mr-3 mb-2"
                >
                  <v-icon> mdi-link</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >URLをクリップボードにコピー</v-tooltip
                  ></v-btn
                >
                <v-btn
                  icon
                  color="light-blue"
                  class="mr-3 mb-2"
                  @click="openTodo(selectedWork)"
                >
                  <v-menu
                    activator="parent"
                    location="end"
                    :close-on-content-click="false"
                  >
                    <v-card style="width: 350px">
                      <v-card-title class="text-center"
                        >「<span v-if="selectedWork.work_id" class="mr-2"
                          ><v-chip
                            size="small"
                            prepend-icon="mdi-car-child-seat"
                          >
                            {{ selectedWork.children_title }}
                          </v-chip></span
                        >{{
                          omittedText(selectedWork.title, 6)
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
                          <v-btn
                            icon
                            color="blue"
                            @click="postTodo(selectedWork)"
                          >
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
                <v-btn
                  v-if="hiddenEditAndDeleteBtn()"
                  icon
                  color="blue"
                  class="mr-3 mb-2"
                  @click="openEditDialog"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >編集</v-tooltip
                  ></v-btn
                >
                <workRegistration />
                <v-btn
                  v-if="hiddenEditAndDeleteBtn()"
                  icon
                  color="red"
                  class="mr-3 mb-2"
                  @click="
                    deleteContent = 'work';
                    deleteTarget = '';
                    isDeleteDialogOpen = true;
                  "
                >
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >削除</v-tooltip
                  ></v-btn
                >
                <deleteDialog :content="deleteContent" :target="deleteTarget" />

                <v-btn
                  icon
                  color="gray"
                  @click="closeDetailsModal"
                  class="mb-2"
                >
                  <v-icon>mdi-arrow-u-left-top</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >閉じる</v-tooltip
                  ></v-btn
                >
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mb-5">
          <div
            class="ml-3 my-4 d-flex"
            style="font-size: 0.92rem"
            v-if="selectedWork.registered_staff"
          >
            <div>
              <v-avatar
                class="mr-2 mb-1"
                v-if="selectedWork.registered_staff.icon"
              >
                <v-img
                  :src="
                    baseURL +
                    '/public/uploads/' +
                    selectedWork.registered_staff.icon
                  "
                  :alt="selectedWork.registered_staff.name"
                ></v-img
              ></v-avatar>
              <v-avatar class="mr-2 mb-1" v-else>{{
                String(selectedWork.registered_staff.name).charAt(0)
              }}</v-avatar>
            </div>
            <div>
              <p class="text-medium-emphasis">
                {{ selectedWork.registered_staff.name }}
              </p>
              <p class="text-medium-emphasis">
                登録日： {{ selectedWork.registration_date }}
              </p>
            </div>
          </div>
          <v-card-text>
            <MarkDownViewer :source="selectedWork.detail" class="mb-5" />
            <v-row class="mb-2">
              <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                <v-list-item prepend-icon="mdi-account-outline"
                  ><v-list-item-subtitle>担当者</v-list-item-subtitle>
                  <v-list-item-title
                    ><span
                      v-for="(user, index) in addIconBasedOnUserId(
                        selectedWork.staffs
                      )"
                    >
                      <v-avatar
                        class="mr-2 mb-1"
                        size="x-small"
                        v-if="user.icon"
                      >
                        <v-img
                          :src="baseURL + '/public/uploads/' + user.icon"
                          :alt="user.name"
                        ></v-img
                      ></v-avatar>
                      <v-avatar class="mr-2 mb-1" size="x-small" v-else>{{
                        String(user.name).charAt(0)
                      }}</v-avatar>
                      {{ user.name }}
                      <span v-if="index != selectedWork.staffs.length - 1">
                        ,
                      </span>
                    </span></v-list-item-title
                  ></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                <v-list-item prepend-icon="mdi-head-sync-outline"
                  ><v-list-item-subtitle>状況</v-list-item-subtitle>
                  <v-list-item-title
                    ><v-chip
                      v-if="selectedWork.stateName.name"
                      :color="selectedWork.stateName.color"
                    >
                      {{ selectedWork.stateName.name }}
                    </v-chip></v-list-item-title
                  ></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                <v-list-item prepend-icon="mdi-toolbox-outline"
                  ><v-list-item-subtitle>SE日報工程</v-list-item-subtitle>
                  <v-list-item-title>{{
                    selectedWork.seDailyReportProcessName
                  }}</v-list-item-title></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                <v-list-item prepend-icon="mdi-ray-start">
                  <v-list-item-subtitle>開始日</v-list-item-subtitle>
                  <v-list-item-title>{{ selectedWork.from }}</v-list-item-title>
                </v-list-item>
                <v-divider inset></v-divider>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
                <v-list-item prepend-icon="mdi-ray-end"
                  ><v-list-item-subtitle>終了日</v-list-item-subtitle>
                  <v-list-item-title>{{
                    selectedWork.to
                  }}</v-list-item-title></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col cols="6" xs="6" sm="6" md="4" lg="4" xl="4" xxl="4">
                <v-list-item prepend-icon="mdi-scale-balance">
                  <v-list-item-subtitle>優先度</v-list-item-subtitle>
                  <v-list-item-title
                    ><span v-if="selectedWork.priority == 2"
                      ><v-icon color="red">mdi-arrow-up-thin</v-icon>
                      {{ selectedWork.priorityName }}
                    </span>
                    <span v-else-if="selectedWork.priority == 3"
                      ><v-icon color="green">mdi-arrow-right-thin</v-icon>
                      {{ selectedWork.priorityName }}
                    </span>
                    <span v-else-if="selectedWork.priority == 4"
                      ><v-icon color="blue">mdi-arrow-down-thin</v-icon>
                      {{ selectedWork.priorityName }}
                    </span>
                    <span v-else></span
                  ></v-list-item-title>
                </v-list-item>
                <v-divider inset></v-divider>
              </v-col>
              <v-col cols="6" xs="6" sm="6" md="4" lg="4" xl="4" xxl="4">
                <v-list-item prepend-icon="mdi-text-box-multiple-outline"
                  ><v-list-item-subtitle>バージョン</v-list-item-subtitle>
                  <v-list-item-title>{{
                    selectedWork.version
                  }}</v-list-item-title></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4" xxl="4">
                <v-list-item prepend-icon="mdi-shape-plus-outline"
                  ><v-list-item-subtitle>カテゴリー</v-list-item-subtitle>
                  <v-list-item-title>{{
                    convertArrayToText(selectedWork.categoryName)
                  }}</v-list-item-title></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
            </v-row>

            <v-row class="mb-2">
              <v-col cols="6" xs="6" sm="6" md="4" lg="4" xl="4" xxl="4">
                <v-list-item prepend-icon="mdi-clock-start">
                  <v-list-item-subtitle>予定時間</v-list-item-subtitle>
                  <v-list-item-title>{{
                    selectedWork.estimate_time
                  }}</v-list-item-title>
                </v-list-item>
                <v-divider inset></v-divider>
              </v-col>
              <v-col cols="6" xs="6" sm="6" md="4" lg="4" xl="4" xxl="4">
                <v-list-item prepend-icon="mdi-clock-end"
                  ><v-list-item-subtitle>実績時間</v-list-item-subtitle>
                  <v-list-item-title>{{
                    selectedWork.actual_time
                  }}</v-list-item-title></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4" xxl="4">
                <v-list-item prepend-icon="mdi-call-made"
                  ><v-list-item-subtitle>進捗度</v-list-item-subtitle>
                  <v-list-item-title
                    >{{ selectedWork.progress }}%</v-list-item-title
                  ></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
            </v-row>

            <v-row
              class="mb-2"
              v-if="childrenWorks.length > 0 && !selectedWork.work_id"
            >
              <v-col cols="6" xs="6" sm="6" md="4" lg="4" xl="4" xxl="4">
                <v-list-item prepend-icon="mdi-clock-start">
                  <v-list-item-subtitle>総予定時間</v-list-item-subtitle>
                  <v-list-item-title>{{
                    selectedWork.gross_estimate_time
                  }}</v-list-item-title>
                </v-list-item>
                <v-divider inset></v-divider>
              </v-col>
              <v-col cols="6" xs="6" sm="6" md="4" lg="4" xl="4" xxl="4">
                <v-list-item prepend-icon="mdi-clock-end"
                  ><v-list-item-subtitle>総実績時間</v-list-item-subtitle>
                  <v-list-item-title>{{
                    selectedWork.gross_actual_time
                  }}</v-list-item-title></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4" xxl="4">
                <v-list-item prepend-icon="mdi-call-made"
                  ><v-list-item-subtitle>総進捗度</v-list-item-subtitle>
                  <v-list-item-title
                    >{{ selectedWork.gross_progress }}%</v-list-item-title
                  ></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
            </v-row>

            <v-row
              v-if="
                Array.isArray(selectedWork.files) &&
                selectedWork.files.length > 0
              "
            >
              <v-col>
                <v-list-item prepend-icon="mdi-call-made"
                  ><v-list-item-subtitle>添付ファイル</v-list-item-subtitle>
                  <v-list-item-title v-for="file of selectedWork.files"
                    ><a
                      :href="baseURL + '/public/uploads/' + file.name"
                      target="_blank"
                      >{{ file.name.replace(/^(\d+)_/, "") }}</a
                    ><Button
                      variant="flat"
                      class="text-disabled ml-3"
                      @click="
                        newAttachedFile = file.name;
                        deleteContent = 'files';
                        deleteTarget = file.name.replace(/^(\d+)_/, '');
                        isDeleteDialogOpen = true;
                      "
                      >削除</Button
                    ></v-list-item-title
                  ></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mt-5" v-if="!selectedWork.work_id">
          <v-card-title class="d-flex align-center mt-3 justify-space-between">
            <div class="mr-5">
              <v-icon class="mr-3">mdi-car-child-seat</v-icon>子課題
            </div>

            <v-btn
              v-if="hiddenEditAndDeleteBtn()"
              icon
              class="mr-3 mb-2 text-end"
              size="small"
            >
              <v-menu
                activator="parent"
                location="start"
                :close-on-content-click="false"
              >
                <v-card style="width: 350px">
                  <v-card-title class="text-center">子課題を追加</v-card-title>
                  <v-card-text>
                    <v-text-field v-model="editWork.children_title"
                      ><template v-slot:label>
                        子課題タイトル <span class="red-asterisk ml-1">*</span>
                      </template></v-text-field
                    >

                    <v-select
                      v-model="editWork.stateName.name"
                      :items="statuses.map((item) => item.name)"
                      ><template v-slot:label>
                        状況 <span class="red-asterisk ml-1">*</span>
                      </template></v-select
                    >
                    <v-select
                      v-model="editWork.seDailyReportProcessName"
                      :items="
                        seDailyReportProcesses.map(
                          (item) => `${item.no}.${item.name}`
                        )
                      "
                      ><template v-slot:label>
                        SE日報工程 <span class="red-asterisk ml-1">*</span>
                      </template></v-select
                    >
                    <div class="d-flex">
                      <v-combobox
                        v-model="editWork.staffsName"
                        :items="projectUsers.map((item) => item.name)"
                        label="担当者"
                        multiple
                        chips
                        class="mr-2"
                      ></v-combobox>

                      <v-btn
                        icon
                        color="gray"
                        size="small"
                        class="mt-2"
                        @click="pushMyself"
                      >
                        <v-icon>mdi-account</v-icon>
                        <v-tooltip activator="parent" location="bottom"
                          >自身を追加</v-tooltip
                        ></v-btn
                      >
                    </div>
                    <div class="text-center">
                      <v-btn icon color="yellow" @click="registerChildrenWork">
                        <v-icon>mdi-check</v-icon>
                        <v-tooltip activator="parent" location="bottom"
                          >登録</v-tooltip
                        ></v-btn
                      >
                    </div>
                  </v-card-text>
                </v-card></v-menu
              >
              <v-icon>mdi-plus</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >子課題を追加</v-tooltip
              ></v-btn
            >
          </v-card-title>
          <v-card-item v-if="childrenWorks.length > 0">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">タイトル</th>
                  <th class="text-left">担当者</th>
                  <th class="text-left">状況</th>
                  <th class="text-left">予想時間</th>
                  <th class="text-left">実績時間</th>
                  <th class="text-left">進捗度</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in childrenWorks"
                  :key="item.id"
                  @click="openLinkDetailsModal(item)"
                  class="tr-data point-cursor"
                >
                  <td>{{ item.children_title }}</td>
                  <td>
                    <span
                      v-for="(user, index) of addIconBasedOnUserId(item.staffs)"
                      ><v-avatar
                        class="mr-2 mb-1"
                        size="x-small"
                        v-if="user.icon"
                      >
                        <v-img
                          :src="baseURL + '/public/uploads/' + user.icon"
                          :alt="user.name"
                        ></v-img
                      ></v-avatar>
                      <v-avatar class="mr-2 mb-1" size="x-small" v-else>{{
                        String(user.name).charAt(0)
                      }}</v-avatar>
                      {{ user.name }}
                      <span v-if="index != item.staffs.length - 1">
                        ,
                      </span></span
                    >
                  </td>
                  <td>{{ item.stateName.name }}</td>
                  <td>{{ item.estimate_time }}</td>
                  <td>{{ item.actual_time }}</td>
                  <td>{{ item.progress }}%</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-item>
        </v-card>

        <v-card class="mt-5" v-else>
          <v-card-title class="align-center mt-3">
            <div class="mr-5">
              <v-icon class="mr-3">mdi-account-child</v-icon>親課題
            </div>
          </v-card-title>
          <v-card-item>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">タイトル</th>
                  <th class="text-left">担当者</th>
                  <th class="text-left">状況</th>
                  <th class="text-left">予想時間</th>
                  <th class="text-left">実績時間</th>
                  <th class="text-left">進捗度</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  @click="openLinkDetailsModal(parentWork)"
                  class="tr-data point-cursor"
                >
                  <td>{{ parentWork.title }}</td>
                  <td>
                    <span
                      v-for="(user, index) of addIconBasedOnUserId(
                        parentWork.staffs
                      )"
                      ><v-avatar
                        class="mr-2 mb-1"
                        size="x-small"
                        v-if="user.icon"
                      >
                        <v-img
                          :src="baseURL + '/public/uploads/' + user.icon"
                          :alt="user.name"
                        ></v-img
                      ></v-avatar>
                      <v-avatar class="mr-2 mb-1" size="x-small" v-else>{{
                        String(user.name).charAt(0)
                      }}</v-avatar>
                      {{ user.name }}
                      <span v-if="index != parentWork.staffs.length - 1">
                        ,
                      </span></span
                    >
                  </td>
                  <td>{{ parentWork.stateName.name }}</td>
                  <td>{{ parentWork.estimate_time }}</td>
                  <td>{{ parentWork.actual_time }}</td>
                  <td>{{ parentWork.progress }}%</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-item>
        </v-card>

        <v-row class="mt-5">
          <v-col lg="8" md="9" sm="10">
            <v-combobox
              v-model="sendCommentStaffs"
              :items="projectUsers.map((item) => item.name)"
              label="コメントを送信するユーザー"
              multiple
              variant="outlined"
              density="compact"
              chips
            ></v-combobox>
            <v-textarea
              label="コメント"
              variant="outlined"
              v-model="comment.content"
            ></v-textarea>
          </v-col>
          <v-col class="d-flex align-end mb-5" cols="2">
            <Button icon color="gray" @click="saveComment"
              ><v-icon>mdi-comment-plus-outline</v-icon>
              <v-tooltip activator="parent" location="end"
                >コメント挿入</v-tooltip
              >
            </Button>
          </v-col>
        </v-row>

        <v-card v-if="selectedWork.comment.length > 0">
          <v-card-title>コメント一覧</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(comment, index) in selectedWork.comment"
                class="mb-3"
              >
                <v-list-item-subtitle class="mb-2">
                  <v-avatar
                    class="mr-2 mb-1"
                    size="x-small"
                    v-if="comment.icon"
                  >
                    <v-img
                      :src="baseURL + '/public/uploads/' + comment.icon"
                      :alt="comment.user"
                    ></v-img
                  ></v-avatar>
                  <v-avatar class="mr-2 mb-1" size="x-small" v-else>{{
                    String(comment.user).charAt(0)
                  }}</v-avatar>
                  <span class="mr-5">{{ comment.user }}</span>
                  {{ comment.registration_date }}</v-list-item-subtitle
                >
                <div
                  class="d-flex justify-space-between comment mb-n5"
                  style="white-space: pre-wrap"
                >
                  <div>
                    <p>
                      <MarkDownViewer :source="comment.content" />
                    </p>
                  </div>
                  <v-btn
                    v-if="comment.user == userInfo.name"
                    variant="plain"
                    class="comment-delete"
                    @click="deleteComment(index)"
                    >削除</v-btn
                  >
                </div>
                <v-divider></v-divider>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import {
  selectedWork,
  editWork,
  editedWork,
  isWorkDetailsDialogOpen,
  selectedChildrenWork,
  cmbChildrenWorks,
  resetChildrenWork,
  postChildrenWork,
  postWork,
  getChildrenWork,
  getWork,
  childrenWorks,
  workRegistrationDialog,
  comment,
  resetComment,
  putWorkComment,
  statuses,
  getStatus,
  editChildrenWork,
  editedChildrenWork,
  selectedTemplateName,
  previousChildrenWorkEstimateTime,
  previousChildrenWorkActualTime,
  previousChildrenWorkStaffs,
  previousChildrenWorkProgress,
  resetEditedWork,
  previousWork,
  deadlineIsPasted,
  getParentWork,
  parentWork,
  getLink,
  getSeDailyReportProcess,
  seDailyReportProcesses,
  pushMyself,
  convertSeDailyReportProcessNameToId,
  convertStatusNameToId,
} from "../../store/work.js";
import { participatingProjectIds, projects } from "../../store/project.js";
import {
  editTodo,
  resetTodo,
  addTodo,
  updateToDoDay,
} from "../../store/todo.js";
import {
  convertArrayToText,
  isDeleteDialogOpen,
  getCurrentDateTime,
  baseURL,
  newAttachedFile,
  markDownColor,
  omittedText,
  displaySnackbar,
  baseThemeColor,
} from "../../store/common.js";
import {
  userInfo,
  convertIdToUserName,
  convertUserNameToId,
  projectUsers,
  addIconBasedOnUserId,
  getProjectUsers,
} from "../../store/user.js";
import {
  setEditNotification,
  addNormalNotification,
} from "../../store/notification.js";
import workRegistration from "./workRegistration.vue";
import deleteDialog from "./deleteDialog.vue";
import MarkDownViewer from "./MarkDownViewer.vue";

const route = useRoute();

const deleteContent = ref("");
const deleteTarget = ref("");

markDownColor.value = "#E0E0E0";

onBeforeMount(async () => {
  await getStatus(selectedWork.value.project);
  await getSeDailyReportProcess();
  if (route.path != "/work") {
    for (const project of projects.value) {
      if (project.id == selectedWork.value.project) {
        getProjectUsers(project.staff_ids);
        break;
      }
    }
  }
});

const hiddenEditAndDeleteBtn = () => {
  if (
    route.path == "/todo" &&
    !participatingProjectIds.value.includes(selectedWork.value.project)
  ) {
    return false;
  }
  return true;
};

const closeDetailsModal = () => {
  isWorkDetailsDialogOpen.value = false;
};

const requiredIsNull = ref(false);

const validateName = () => {
  if (
    editWork.value.children_title.replace(/ /g, "") &&
    editWork.value.children_title.replace(/　/g, "") &&
    editWork.value.seDailyReportProcessName.replace(/ /g, "") &&
    editWork.value.seDailyReportProcessName.replace(/　/g, "") &&
    editWork.value.stateName.name.replace(/ /g, "") &&
    editWork.value.stateName.name.replace(/　/g, "")
  ) {
    requiredIsNull.value = false;
  } else {
    requiredIsNull.value = true;
  }
};

const registerChildrenWork = async () => {
  validateName();
  if (requiredIsNull.value) {
    displaySnackbar("red", "必須項目が入力されていません。");
    return;
  }
  resetEditedWork();
  editedWork.value.work_id = selectedWork.value.id;
  editedWork.value.children_title = editWork.value.children_title;
  editedWork.value.state = convertStatusNameToId(editWork.value.stateName.name);
  editedWork.value.se_daily_report_process =
    convertSeDailyReportProcessNameToId(
      editWork.value.seDailyReportProcessName
    );
  editedWork.value.staffs = convertUserNameToId(editWork.value.staffsName);
  editedWork.value.project = selectedWork.value.project;
  editedWork.value.title = selectedWork.value.title;
  editedWork.value.from = selectedWork.value.from;
  editedWork.value.to = selectedWork.value.to;
  editedWork.value.priority = selectedWork.value.priority;
  editedWork.value.version = selectedWork.value.version;
  editedWork.value.category = selectedWork.value.category;
  editedWork.value.registered_staff = userInfo.value.id;
  let now = getCurrentDateTime();
  editedWork.value.registration_date = now;
  editedWork.value.update_date = now;
  await postWork();
  await getWork();
  await getChildrenWork(selectedWork.value.id);
  editWork.value.children_title = "";
  editWork.value.stateName.name = "";
  editWork.value.seDailyReportProcessName = "";
  editWork.value.staffsName = [];
};

const openLinkDetailsModal = (row) => {
  selectedWork.value = row;
  if (selectedWork.value.work_id) {
    parentWork.value = getParentWork(selectedWork.value.work_id);
  } else {
    getChildrenWork(selectedWork.value.id);
  }
};

const saveComment = async () => {
  if (!comment.value.content) {
    return;
  }
  let currentDate = getCurrentDateTime();
  comment.value.user = userInfo.value.name;
  comment.value.icon = userInfo.value.icon;
  comment.value.registration_date = currentDate;
  for (const staff of convertUserNameToId(sendCommentStaffs.value)) {
    setEditNotification(
      `${userInfo.value.name}より「${comment.value.content}」とコメントが届きました。`,
      "",
      selectedWork.value.id,
      staff,
      false,
      getCurrentDateTime(),
      false
    );
    await addNormalNotification();
  }
  let commentContentStaff = "";
  for (const staff of sendCommentStaffs.value) {
    if (commentContentStaff) {
      commentContentStaff += ` ,@${staff}`;
    } else {
      commentContentStaff = `@${staff}`;
    }
  }
  comment.value.content = commentContentStaff + "\n" + comment.value.content;

  selectedWork.value.comment.unshift(comment.value);
  selectedWork.value.update_date = currentDate;
  editedWork.value = selectedWork.value;

  resetComment();
  await putWorkComment();
};

const deleteComment = async (index) => {
  editedWork.value = selectedWork.value;
  editedWork.value.comment.splice(index, 1);
  await putWorkComment();
};

const postTodo = async (work) => {
  await addTodo(work);
  if (route.path == "/todo") {
    updateToDoDay();
  }
};

const openEditDialog = () => {
  selectedTemplateName.value = "";
  editWork.value = Object.assign({}, selectedWork.value);
  previousWork.value = Object.assign({}, selectedWork.value);
  if (selectedWork.value.work_id) {
    previousChildrenWorkEstimateTime.value = selectedWork.value.estimate_time;
    previousChildrenWorkActualTime.value = selectedWork.value.actual_time;
    previousChildrenWorkProgress.value = selectedWork.value.progress;
  }
  workRegistrationDialog.value = true;
};

const openTodo = (work) => {
  resetTodo();
  editTodo.value.target_progress = 100;
  editTodo.value.current_progress = work.progress;
};

const sendCommentStaffs = ref([]);
</script>

<style scoped>
.comment {
  position: relative;
}
.comment-delete {
  position: absolute;
  right: 5px;
  bottom: 17px;
}
</style>

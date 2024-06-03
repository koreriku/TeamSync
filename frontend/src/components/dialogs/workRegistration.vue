<template>
  <v-dialog v-model="workRegistrationDialog" max-width="1000px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <div class="headline">新規登録</div>
        <v-btn
          icon
          color="gray"
          class="mb-3"
          @click="workRegistrationDialog = false"
        >
          <v-icon>mdi-arrow-u-left-top</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >閉じる</v-tooltip
          ></v-btn
        >
      </v-card-title>
      <v-card-text>
        <v-form>
          <div class="d-flex mb-3">
            <v-select
              v-model="selectedTemplateName"
              :items="templates.map((item) => item.name)"
              label="テンプレート"
              style="max-width: 400px"
              class="mr-3"
              variant="outlined"
              @update:model-value="
                () => {
                  changeTemplate();
                }
              "
            ></v-select>
            <v-btn
              icon
              color="gray"
              class="mr-3"
              @click="
                resetTemplate();
                isTemplateRegistrationDialog = true;
              "
            >
              <v-icon>mdi-text-box-outline</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >テンプレート追加</v-tooltip
              ></v-btn
            >
            <v-btn icon color="gray" @click="deleteSelectedTemplate()">
              <v-icon>mdi-delete-outline</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >選択中のテンプレートを削除</v-tooltip
              ></v-btn
            >
          </div>
          <templateRegistration />
          <v-text-field
            v-if="editWork.work_id"
            v-model="editWork.children_title"
            label="子課題タイトル"
            required
            style="width: 50%"
          ></v-text-field>
          <v-text-field v-model="editWork.title" required
            ><template v-slot:label>
              タイトル <span class="red-asterisk ml-1">*</span>
            </template></v-text-field
          >
          <v-textarea
            v-model="editWork.detail"
            label="詳細"
            rows="8"
          ></v-textarea>
          <v-btn
            @click="isPreview = !isPreview"
            class="mb-5"
            size="small"
            variant="outlined"
          >
            <span v-if="!isPreview">プレビューを開く</span
            ><span v-else>プレビューを閉じる</span>
          </v-btn>
          <div v-if="isPreview">
            <MarkDownViewer :source="editWork.detail" class="mb-5" />
          </div>
          <v-row>
            <v-col
              cols="10"
              xs="10"
              sm="10"
              md="11"
              lg="11"
              xl="11"
              xxl="11"
              class="d-flex"
            >
              <v-combobox
                v-model="editWork.staffsName"
                :items="projectUsers.map((item) => item.name)"
                label="担当者"
                multiple
                chips
              ></v-combobox>
            </v-col>
            <v-col cols="2" xs="2" sm="2" md="1" lg="1" xl="1" xxl="1">
              <v-btn icon color="gray" size="small" @click="pushMyself">
                <v-icon>mdi-account</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >自身を追加</v-tooltip
                ></v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10" xs="10" sm="10" md="5" lg="5" xl="5" xxl="5">
              <v-select
                v-model="editWork.stateName.name"
                :items="statuses.map((item) => item.name)"
                ><template v-slot:label>
                  状況 <span class="red-asterisk ml-1">*</span>
                </template></v-select
              >
            </v-col>
            <v-col cols="2" xs="2" sm="2" md="1" lg="1" xl="1" xxl="1">
              <v-btn
                icon
                color="gray"
                class="mb-3"
                size="small"
                @click="isStatusRegistrationDialog = true"
              >
                <v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >状況追加</v-tooltip
                ></v-btn
              >
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
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
            </v-col>
            <statusRegistration />
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="editWork.from"
                type="date"
                label="開始日"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="editWork.to"
                type="date"
                label="終了日"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" xs="6" sm="6" md="3" lg="3" xl="3" xxl="3"
              ><v-select
                v-model="editWork.priorityName"
                :items="priorities.map((item) => item.name)"
                label="優先度"
              ></v-select
            ></v-col>
            <v-col cols="6" xs="6" sm="6" md="4" lg="4" xl="4" xxl="4"
              ><v-text-field
                v-model="editWork.version"
                label="バージョン"
              ></v-text-field
            ></v-col>
            <v-col cols="10" xs="10" sm="10" md="4" lg="4" xl="4" xxl="4"
              ><v-select
                v-model="editWork.categoryName"
                :items="categories.map((item) => item.name)"
                label="カテゴリー"
                multiple
                chips
              ></v-select
            ></v-col>
            <v-col cols="2" xs="2" sm="2" md="1" lg="1" xl="1" xxl="1">
              <v-btn
                icon
                color="gray"
                class="mb-3"
                size="small"
                @click="isCategoryRegistrationDialog = true"
              >
                <v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >カテゴリー追加</v-tooltip
                ></v-btn
              >
              <categoryRegistration />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              ><v-text-field
                type="number"
                v-model="editWork.estimate_time"
                :disabled="
                  editWork.id != 0 &&
                  childrenWorks.length > 0 &&
                  !editWork.work_id
                "
                label="予定時間"
              ></v-text-field
            ></v-col>
            <v-col
              ><v-text-field
                type="number"
                v-model="editWork.actual_time"
                :disabled="
                  editWork.id != 0 &&
                  childrenWorks.length > 0 &&
                  !editWork.work_id
                "
                label="実績時間"
              ></v-text-field
            ></v-col>
            <v-col
              ><v-text-field
                type="number"
                v-model="editWork.progress"
                :disabled="
                  editWork.id != 0 &&
                  childrenWorks.length > 0 &&
                  !editWork.work_id
                "
                label="進捗（%）"
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-file-input
                multiple
                chips
                v-model="newAttachedFiles"
                label="添付ファイル"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-btn
          icon
          color="yellow"
          class="mb-3"
          @click="saveWork"
          v-if="editWork.id == 0"
        >
          <v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >登録</v-tooltip
          ></v-btn
        >
        <v-btn icon color="blue" class="mb-3" @click="saveWork" v-else>
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
import { useRoute } from "vue-router";
import {
  workRegistrationDialog,
  isStatusRegistrationDialog,
  editWork,
  editedWork,
  selectedWork,
  postWork,
  getWork,
  putWork,
  statuses,
  getStatus,
  getPriority,
  getCategory,
  priorities,
  convertPriorityNameToId,
  categories,
  isCategoryRegistrationDialog,
  convertCategoryNameToId,
  convertStatusNameToId,
  isTemplateRegistrationDialog,
  templates,
  template,
  selectedTemplateName,
  resetTemplate,
  getTemplate,
  deleteTemplate,
  commentDifferenceWork,
  resetComment,
  getRecentUpdateWorks,
  childrenWorks,
  getSeDailyReportProcess,
  seDailyReportProcesses,
  convertSeDailyReportProcessNameToId,
  updateParentWorkByChildrenWork,
  setWork,
  convertStatusIdToName,
} from "../../store/work.js";
import {
  currentProject,
  participatingProjectIds,
  projects,
} from "../../store/project.js";
import {
  projectUsers,
  userInfo,
  getProjectUsers,
  convertUserNameToId,
  convertOnlyUserNameToId,
} from "../../store//user.js";
import { displayTodoUsers, editTodo } from "../../store/todo.js";
import {
  getCurrentDateTime,
  newAttachedFiles,
  postFiles,
  markDownColor,
  isPreview,
  displaySnackbar,
} from "../../store/common.js";
import { onBeforeMount } from "vue";
import statusRegistration from "./statusRegistration.vue";
import categoryRegistration from "./categoryRegistration.vue";
import MarkDownViewer from "./MarkDownViewer.vue";
import templateRegistration from "./templateRegistration.vue";

const route = useRoute();

onBeforeMount(async () => {
  newAttachedFiles.value = [];
  if (participatingProjectIds.value.includes(selectedWork.value.project)) {
    await getStatus(selectedWork.value.project);
    await getCategory();
    await getPriority();
    await getSeDailyReportProcess();
    template.value.project_id = selectedWork.value.project;
    await getTemplate(selectedWork.value.project);
    for (const project of projects.value) {
      if (project.id == selectedWork.value.project) {
        getProjectUsers(project.staff_ids);
        break;
      }
    }
  }
});

markDownColor.value = "#E0E0E0";
const requiredIsNull = ref(false);

const validateName = () => {
  if (
    editWork.value.title.replace(/ /g, "") &&
    editWork.value.title.replace(/　/g, "") &&
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

const pushMyself = () => {
  if (!editWork.value.staffsName.includes(userInfo.value.name))
    editWork.value.staffsName.push(userInfo.value.name);
};

const saveWork = async () => {
  validateName();
  if (requiredIsNull.value) {
    displaySnackbar("red", "必須項目が入力されていません。");
    return;
  }
  workRegistrationDialog.value = false;
  editWork.value.staffs = convertUserNameToId(editWork.value.staffsName);
  editWork.value.priority = convertPriorityNameToId(
    editWork.value.priorityName
  );
  editWork.value.se_daily_report_process = convertSeDailyReportProcessNameToId(
    editWork.value.seDailyReportProcessName
  );
  let newFiles = [];
  if (newAttachedFiles.value.length > 0) {
    let files = await postFiles();
    newFiles = [...editWork.value.files, ...files];
    selectedWork.value.files = [...editWork.value.files, ...files];
    editWork.value.files = JSON.stringify([...editWork.value.files, ...files]);
  } else {
    editWork.value.files = "[]";
  }
  editWork.value.project = currentProject.value.id;
  editWork.value.state = convertStatusNameToId(editWork.value.stateName.name);
  editWork.value.category = convertCategoryNameToId(
    editWork.value.categoryName
  );
  editWork.value.update_date = getCurrentDateTime();
  editedWork.value = Object.assign({}, editWork.value);
  commentDifferenceWork();
  if (editedWork.value.id == 0) {
    editedWork.value.registration_date = getCurrentDateTime();
    editedWork.value.registered_staff = userInfo.value.id;
    await postWork();
  } else {
    if (selectedWork.value.work_id == editedWork.value.work_id) {
      selectedWork.value = Object.assign({}, editWork.value);
      selectedWork.value.stateName = convertStatusIdToName(
        editedWork.value.state
      );
      selectedWork.value.files = newFiles;
    }
    await putWork();
  }
  if (route.path == "/todo") {
    for (const user of displayTodoUsers.value) {
      if ((user.id = userInfo.value.id)) {
        for (let work of user.detail_todo) {
          if (work.id == editWork.value.id) {
            // work.title = editWork.value.title;
            // work.progress = editWork.value.progress;
            // work.se_daily_report_process =
            //   editWork.value.se_daily_report_process;
            // work.seDailyReportProcessName =
            //   editWork.value.seDailyReportProcessName;
            // work.staffsName = editWork.value.staffsName;
            // work.staffs = editWork.value.staffs;
            // work.stateName = editWork.value.stateName;
            // work.priorityName = editWork.value.priorityName;
            // work.version = editWork.value.version;
            // work.categoryName = editWork.value.categoryName;
            // work.estimate_time = editWork.value.estimate_time;
            // work.actual_time = editWork.value.actual_time;
            // work.from = editWork.value.from;
            // work.to = editWork.value.to;
            work = setWork(work, selectedWork.value);
            break;
          }
        }
      }
    }
  } else if (route.path == "/") {
    await getRecentUpdateWorks();
  } else {
    await getWork();
  }
  if (editedWork.value.work_id) {
    let parentWork = await updateParentWorkByChildrenWork();
    if (selectedWork.value.work_id != editedWork.value.work_id) {
      selectedWork.value = parentWork;
    }
  }
  resetComment();
};

const changeTemplate = () => {
  if (selectedTemplateName.value.length == 0) {
    editWork.value.title = "";
    editWork.value.detail = "";
    return;
  }
  for (const item of templates.value) {
    if (item.name == selectedTemplateName.value) {
      editWork.value.title = item.title;
      editWork.value.detail = item.detail;
      break;
    }
  }
};
const deleteSelectedTemplate = async () => {
  if (selectedTemplateName.value.length == 0) {
    return;
  }
  for (const item of templates.value) {
    if (item.name == selectedTemplateName.value) {
      await deleteTemplate(item.id);
      await getTemplate();
      break;
    }
  }
  selectedTemplateName.value = "";
};
</script>

<style>
.red-asterisk {
  color: red;
}
</style>

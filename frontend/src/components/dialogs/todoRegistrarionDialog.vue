<template>
  <v-dialog v-model="todoRegistrationDialog" max-width="1000px">
    <v-card :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }">
      <v-card-title class="d-flex justify-space-between">
        <div class="headline">ToDo登録</div>
        <v-btn
          icon
          color="gray"
          class="mb-3"
          @click="todoRegistrationDialog = false"
        >
          <v-icon>mdi-arrow-u-left-top</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >閉じる</v-tooltip
          ></v-btn
        >
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="editTodo.title" required
              ><template v-slot:label>
                タイトル <span class="red-asterisk ml-1">*</span>
              </template></v-text-field
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
            <v-select
              v-model="editTodo.project"
              :items="
                projects
                  .filter((item) => item.staff_ids.includes(userInfo.id))
                  .map((item) => `${item.title}(${item.project_no})`)
              "
              ><template v-slot:label>
                プロジェクト <span class="red-asterisk ml-1">*</span>
              </template></v-select
            >
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
            <v-select
              v-model="editTodo.se_daily_report_process_name"
              :items="
                seDailyReportProcesses.map((item) => `${item.no}.${item.name}`)
              "
              ><template v-slot:label>
                SE日報工程 <span class="red-asterisk ml-1">*</span>
              </template></v-select
            >
          </v-col>
          <statusRegistration />
        </v-row>

        <v-row>
          <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4" xxl="4"
            ><v-text-field
              v-model="editTodo.day"
              type="date"
              label="実施日"
            ></v-text-field
          ></v-col>
          <v-col cols="6" xs="6" sm="6" md="4" lg="4" xl="4" xxl="4"
            ><v-text-field
              type="number"
              v-model="editTodo.required_time"
              label="作業時間"
            ></v-text-field
          ></v-col>
          <v-col cols="6" xs="6" sm="6" md="4" lg="4" xl="4" xxl="4"
            ><v-text-field
              type="number"
              v-model="editTodo.overtime"
              label="残業時間"
            ></v-text-field
          ></v-col>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6"
            ><v-text-field
              type="number"
              v-model="editTodo.target_progress"
              label="目標進捗（%）"
            ></v-text-field
          ></v-col>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6"
            ><v-text-field
              type="number"
              v-model="editTodo.current_progress"
              label="現在進捗（%）"
            ></v-text-field
          ></v-col>
        </v-row>
      </v-card-text>
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-btn icon color="yellow" class="mb-3" @click="saveTodo">
          <v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >登録</v-tooltip
          ></v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import {
  todoRegistrationDialog,
  editTodo,
  postOnlyTodo,
} from "../../store/todo.js";
import { seDailyReportProcesses } from "../../store/work.js";
import { displaySnackbar, baseThemeColor } from "../../store/common.js";
import {
  projects,
  convertProjectNameToProjectNo,
} from "../../store/project.js";
import { userInfo } from "../../store/user";

const requiredIsNull = ref(false);

const validateName = () => {
  if (
    editTodo.value.title.replace(/ /g, "") &&
    editTodo.value.title.replace(/　/g, "") &&
    editTodo.value.project.replace(/ /g, "") &&
    editTodo.value.project.replace(/　/g, "") &&
    editTodo.value.se_daily_report_process_name.replace(/ /g, "") &&
    editTodo.value.se_daily_report_process_name.replace(/　/g, "")
  ) {
    requiredIsNull.value = false;
  } else {
    requiredIsNull.value = true;
  }
};
const saveTodo = () => {
  validateName();
  if (requiredIsNull.value) {
    displaySnackbar("red", "必須項目が入力されていません。");
    return;
  }
  postOnlyTodo();
};
</script>

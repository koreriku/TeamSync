<template>
  <v-dialog v-model="todoRegistrationDialog" max-width="1000px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <div class="headline">新規登録</div>
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
            <v-text-field
              v-model="editTodo.title"
              label="タイトル"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
            <v-select
              v-model="editTodo.seDailyReportProcessName"
              :items="
                seDailyReportProcesses.map((item) => `${item.no}.${item.name}`)
              "
              label="プロジェクト"
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
            <v-select
              v-model="editTodo.seDailyReportProcessName"
              :items="
                seDailyReportProcesses.map((item) => `${item.no}.${item.name}`)
              "
              label="SE日報工程"
            ></v-select>
          </v-col>
          <statusRegistration />
        </v-row>

        <v-row>
          <v-col
            ><v-text-field
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
              label="作業予定時間"
            ></v-text-field
          ></v-col>
        </v-row>
      </v-card-text>
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-btn icon color="yellow" class="mb-3" @click="saveWork">
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
import { todoRegistrationDialog, editTodo } from "../../store/todo.js";
import { seDailyReportProcesses } from "../../store/work.js";
</script>

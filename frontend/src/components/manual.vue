<template>
  <v-row>
    <v-col cols="12" xs="12" sm="12" md="12" lg="2" xl="2" xxl="2"
      ><v-navigation-drawer width="300">
        <v-list>
          <v-list-item title="目次"></v-list-item>
          <v-divider></v-divider>
          <v-list-group value="Admin">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                title="ホーム（プロジェクト一覧）"
              ></v-list-item>
            </template>
            <v-list-item
              title="プロジェクト登録"
              value="プロジェクト登録"
            ></v-list-item>
            <v-list-item title="List Item 2" value="List Item 1"></v-list-item>
            <v-list-item title="List Item 3" value="List Item 1"></v-list-item>
          </v-list-group>

          <v-list-item link title="List Item 1"></v-list-item>
          <v-list-item link title="List Item 2"></v-list-item>
          <v-list-item link title="List Item 3"></v-list-item
        ></v-list> </v-navigation-drawer
    ></v-col>
    <v-col cols="12" xs="12" sm="12" md="12" lg="9" xl="9" xxl="9"
      ><div class="ml-15">
        <section id="manual-home">
          <h1
            class="mb-10 text-h4 title"
            :style="{
              'border-color': baseThemeColor === 'light' ? 'black' : 'white',
            }"
          >
            <v-icon>mdi-home</v-icon> ホーム（プロジェクト一覧）
          </h1>
          <div class="mb-5">
            <p>
              この画面では、プロジェクトの選択・作成・編集・削除や、加入しているプロジェクトの課題の一覧が確認できます。
            </p>
            <p>
              プロジェクトはSE日報で入力するプロジェクトNOごとに作成します。課題についてはプロジェクト内で作成します。
            </p>
            <p>複数のユーザーでプロジェクトを共有することが可能です。</p>
          </div>
          <div class="item">
            <h2 class="text-h5 mb-3 item-title">プロジェクト作成</h2>
            <div class="item-description">
              <v-btn icon color="yellow" class="mb-3">
                <v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >新規</v-tooltip
                ></v-btn
              >
              <p>
                新規ボタンを押すとダイアログが開き、プロジェクトの作成ができます。
              </p>
              <p>
                <span style="color: red">*</span
                >マークがついているフォームは必須入力です。
              </p>
              <p>
                プロジェクトNOはSE日報で登録するプロジェクトNOを登録してください。
              </p>

              <v-btn color="grey" class="mt-2 mb-3" icon size="small">
                <v-icon>mdi-filter-outline</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >部署で担当者を絞り込む</v-tooltip
                >
              </v-btn>
              <p>
                部署で担当者を絞り込むボタンを押すと、選択した部署で担当者を絞り込むことができます。
              </p>
              <v-btn icon color="yellow" class="mb-3">
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >登録</v-tooltip
                ></v-btn
              >
              <p>内容を入力し終えたら、登録ボタンを押します。</p>
            </div>
          </div>
          <div class="item">
            <h2 class="text-h5 mb-3 item-title">プロジェクト選択</h2>
            <div class="item-description">
              <div class="project mb-3" style="max-width: 500px">
                <v-card class="point-cursor">
                  <v-card-title
                    ><div
                      class="text-medium-emphasis mb-2"
                      style="font-size: 0.9rem"
                    >
                      <span class="mr-3">2024-04-01～2025-03-31</span>
                      <v-chip color="#03A9F4"> 対応中 </v-chip>
                    </div>
                    <div class="pre-wrap">
                      TeamSyncマニュアル作成プロジェクト
                    </div>
                  </v-card-title>
                </v-card>

                <v-btn
                  icon
                  color="blue"
                  class="project-edit mr-2 mt-1"
                  size="small"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent" location="top"
                    >編集</v-tooltip
                  ></v-btn
                >
              </div>
              <p>プロジェクトを選択するとプロジェクト内に遷移します。</p>
            </div>
          </div>
          <div class="item">
            <h2 class="text-h5 mb-3 item-title">プロジェクト編集</h2>
            <div class="item-description">
              <v-btn icon color="blue" class="mr-3 mb-2" size="small">
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top"
                  >編集</v-tooltip
                ></v-btn
              >
              <p>
                編集ボタンを押すとダイアログが表示され、プロジェクトの内容を編集できます。
              </p>
              <v-btn icon color="blue" class="mb-3">
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >編集完了</v-tooltip
                ></v-btn
              >
              <p>編集完了ボタンを押すと、入力した内容で登録されます。</p>
            </div>
          </div>
          <div class="item">
            <h2 class="text-h5 mb-3 item-title">プロジェクト削除</h2>
            <div class="item-description">
              <v-btn icon color="red" class="mb-3 mr-3">
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >削除</v-tooltip
                ></v-btn
              >
              <p>
                プロジェクト編集ダイアログの右上の削除ボタンを押すとプロジェクトを削除できます。
              </p>
            </div>
          </div>
          <div class="item">
            <h2 class="text-h5 mb-3 item-title">課題一覧</h2>
            <div class="item-description">
              <v-card class="mb-3">
                <v-tabs v-model="workTab" bg-color="grey-lighten-4">
                  <v-tab value="recent">最近の更新</v-tab>
                  <v-tab value="myWork">自分の課題</v-tab>
                </v-tabs>

                <v-card-text>
                  <v-list lines="four" style="max-height: 700px">
                    <v-list-item
                      v-for="(item, i) in showRecentUpdateWorks"
                      :key="i"
                      :value="item"
                      :active="false"
                      style="border-bottom: 1px solid #e0e0e0"
                    >
                      <v-list-item-title class="mb-2"
                        ><div
                          class="text-medium-emphasis mb-2"
                          style="font-size: 0.9rem"
                        >
                          <span class="mr-3">{{ item.update_date }}</span>
                          <v-chip
                            class="mr-3"
                            v-if="item.stateName.name"
                            :color="item.stateName.color"
                          >
                            {{ item.stateName.name }}
                          </v-chip>
                          <span class="mr-3" v-if="item.priority"
                            ><span v-if="item.priority == 2"
                              ><v-icon color="red">mdi-arrow-up-thin</v-icon>
                              {{ item.priorityName }}
                            </span>
                            <span v-else-if="item.priority == 3"
                              ><v-icon color="green"
                                >mdi-arrow-right-thin</v-icon
                              >
                              {{ item.priorityName }}
                            </span>
                            <span v-else-if="item.priority == 4"
                              ><v-icon color="blue">mdi-arrow-down-thin</v-icon>
                              {{ item.priorityName }}
                            </span>
                            <span v-else></span
                          ></span>
                          <span>
                            <v-avatar class="mr-2" size="x-small">{{
                              String(item.staffs).charAt(0)
                            }}</v-avatar>
                            {{ item.staffs }}
                          </span>
                        </div>
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
                            v-if="item.progress != 100"
                            >mdi-fire</v-icon
                          >
                          {{ `【${item.project_name}】${item.title}` }}
                        </p>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
              <p>
                最近の更新タブを選択すると、加入しているプロジェクトの課題が更新日順に表示されます。
              </p>
              <p>
                自分の課題タブを選択すると、進捗度が100％もしくは状況が完了に達していない加入しているプロジェクトの課題が優先度、終了日順に表示されます。
              </p>
              <p>
                表示している課題の1行目は更新日、状況、優先度、担当者が表示され、2行目はタイトルが表示されます。※課題に値が入力されていない場合は表示されません。
              </p>
              <p>課題を押すと課題の詳細を確認できます。</p>
            </div>
          </div>
        </section>
      </div></v-col
    >
  </v-row>
</template>

<script setup>
import { ref } from "vue";
import { baseThemeColor } from "../store/common.js";
import { workTab } from "../store/work.js";

const showRecentUpdateWorks = ref([
  {
    id: 1,
    project: 1,
    detail: "",
    state: 3,
    category: [],
    categoryName: [],
    version: "",
    from: "2024-04-01",
    to: "2024-04-07",
    estimate_time: 10,
    actual_time: 2,
    progress: 20,
    comment: [],
    todo: false,
    se_daily_report_process: 0,
    seDailyReportProcessName: "",
    registration_date: "",
    files: [],
    children_title: "",
    work_id: 0,
    registered_staff: 0,
    gross_estimate_time: 0,
    gross_actual_time: 0,
    gross_progress: 0,
    update_date: "2024-04-01 12:00:30",
    stateName: { name: "対応中", color: "#03A9F4" },
    priorityName: "中",
    priority: 3,
    staffs: "田中",
    progress: 50,
    project_name: "TeamSyncマニュアル作成プロジェクト",
    title: "レイアウト作成",
  },
]);
</script>

<style scoped>
.title {
  border-bottom: solid 1px;
  border-top: solid 1px;
  padding: 1rem;
}
.item {
  margin-bottom: 2rem;
}
.item-title {
  display: block;
  padding-top: 100px;
  margin-top: -100px;
  position: relative; /*相対位置*/
  padding-left: 2.5rem; /*アイコン分のスペース*/
}
.item-title:before {
  content: "";
  position: absolute; /*絶対位置*/
  left: 12px;
  bottom: 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #9e9e9e;
}
p {
  margin-bottom: 0.25rem;
}
.item-description {
  margin-left: 2rem;
}
</style>

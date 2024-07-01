<template>
  <div id="app">
    <v-app>
      <v-app-bar app color="primary">
        <v-app-bar-title @click="judgmentLogin('/')">
          <span class="title"> TeamSync</span></v-app-bar-title
        >

        <v-spacer></v-spacer>
        <v-toolbar-items active class="toolbar">
          <v-btn icon @click="judgmentLogin('/')" v-if="userInfo.id">
            <v-icon>mdi-home</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >ホーム</v-tooltip
            ></v-btn
          >
          <v-btn icon @click="" v-if="userInfo.id">
            <v-menu
              activator="parent"
              location="end"
              :close-on-content-click="false"
            >
              <v-card
                style="width: 400px; max-height: 500px"
                :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }"
              >
                <v-card-text>
                  <v-table>
                    <v-list>
                      <v-list-item
                        v-for="(item, i) in notifications"
                        :key="i"
                        :value="item"
                        style="
                          border-bottom: 1px solid #e0e0e0;
                          white-space: pre-wrap;
                        "
                        :base-color="item.is_read ? '' : '#D0A080'"
                        @click="clickNotification(item)"
                      >
                        <v-list-item--sub-title class="pre-wrap">{{
                          item.registration_date
                        }}</v-list-item--sub-title>
                        <v-list-item-title class="pre-wrap">{{
                          item.title
                        }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-table>
                </v-card-text>
              </v-card></v-menu
            >

            <v-badge
              v-if="notificationsCount > 0"
              color="error"
              :content="notificationsCount"
            >
              <v-icon>mdi-bell</v-icon>
            </v-badge>
            <v-icon v-else>mdi-bell</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >通知</v-tooltip
            ></v-btn
          >
          <v-btn
            icon
            @click="judgmentLogin('/work')"
            v-if="currentProject.id && userInfo.id"
          >
            <v-icon>mdi-rocket</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >選択中のプロジェクト</v-tooltip
            ></v-btn
          >
          <v-btn icon @click="judgmentLogin('/todo')" v-if="userInfo.id">
            <v-icon>mdi-checkbox-outline</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >ToDo</v-tooltip
            ></v-btn
          >
          <v-btn icon @click="judgmentLogin('/wiki')" v-if="userInfo.id">
            <v-icon>mdi-wikipedia</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >Wiki</v-tooltip
            ></v-btn
          >
          <v-btn icon @click="goTo('/login')" v-if="!userInfo.id">
            <v-icon>mdi-login</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >ログイン</v-tooltip
            ></v-btn
          >
          <v-btn icon class="mr-2" @click="logout()" v-else>
            <v-icon>mdi-logout</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >ログアウト</v-tooltip
            ></v-btn
          >
        </v-toolbar-items>

        <div class="nav">
          <!--ハンバーガーリスト表示-->
          <v-app-bar-nav-icon
            @click="drawer = !drawer"
            v-if="!drawer"
          ></v-app-bar-nav-icon>
          <v-app-bar-nav-icon
            v-else
            @click="drawer = !drawer"
            icon="mdi-close"
          ></v-app-bar-nav-icon>
        </div>

        <v-btn
          icon
          class="mr-2"
          @click="goTo('/userRegister')"
          v-if="!userInfo.id"
        >
          <v-icon>mdi-account-plus</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >アカウント登録</v-tooltip
          ></v-btn
        >
        <v-menu v-else :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <span class="point-cursor" v-bind="props">
              <v-avatar class="mr-2 mb-1" size="small" v-if="userInfo.icon">
                <v-img
                  :src="baseURL + '/public/uploads/' + userInfo.icon"
                  :alt="userInfo.name"
                ></v-img
                ><v-tooltip activator="parent" location="bottom"
                  >アカウント設定（{{ userInfo.name }}）</v-tooltip
                ></v-avatar
              >
              <v-avatar class="mr-2 mb-1" size="small" v-else
                ><span style="color: white">{{
                  String(userInfo.name).charAt(0)
                }}</span
                ><v-tooltip activator="parent" location="bottom"
                  >アカウント設定（{{ userInfo.name }}）</v-tooltip
                ></v-avatar
              >
            </span>
          </template>

          <v-list width="300">
            <v-list-item @click="goTo('/userRegister')">
              <v-list-item-title>アカウント編集</v-list-item-title>
            </v-list-item>
            <v-list-group value="Admin">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" title="テーマカラー"></v-list-item>
              </template>

              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col cols="3" v-for="item of baseThemeColors">
                      <v-btn
                        icon
                        :color="item.btnColor"
                        @click="
                          baseThemeColor = item.theme;
                          changeTheme();
                        "
                      >
                        <v-tooltip activator="parent" location="bottom">{{
                          item.name
                        }}</v-tooltip></v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3" v-for="item of themeColors">
                      <v-btn
                        icon
                        :color="item.btnColor"
                        @click="
                          themeColor = item.theme;
                          changeTheme();
                        "
                      >
                        <v-tooltip activator="parent" location="bottom">{{
                          item.name
                        }}</v-tooltip></v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-list-group>
          </v-list>
        </v-menu>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" fixed temporary>
        <v-list nav dense>
          <v-list-item
            v-if="userInfo.id"
            prepend-icon="mdi-home"
            title="ホーム"
            @click="judgmentLogin('/')"
            class="hamburger_font"
          >
          </v-list-item>
          <v-list-item
            v-if="currentProject.id && userInfo.id"
            prepend-icon="mdi-rocket"
            title="選択中のプロジェクト"
            @click="judgmentLogin('/work')"
            class="hamburger_font"
          ></v-list-item>
          <!--Todo outside設定-->
          <v-list-item
            v-if="userInfo.id"
            prepend-icon="mdi-checkbox-outline"
            title="ToDo"
            @click="judgmentLogin('/todo')"
            class="hamburger_font"
          ></v-list-item>
          <v-list-item
            v-if="userInfo.id"
            prepend-icon="mdi-wikipedia"
            title="Wiki"
            @click="judgmentLogin('/wiki')"
            class="hamburger_font"
          ></v-list-item>
          <v-list-item
            v-if="!userInfo.id"
            @click="goTo('/login')"
            prepend-icon="mdi-login"
            title="ログイン"
            class="hamburger_font"
          ></v-list-item>
          <v-list-item
            v-else
            prepend-icon="mdi-logout"
            title="ログアウト"
            @click="logout()"
            class="hamburger-font"
          >
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-snackbar
        v-model="snackbar.isOpened"
        :color="snackbar.color"
        :multi-line="true"
        :timeout="3000"
        location="top"
        style="white-space: pre-line"
      >
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            icon
            color="white"
            variant="text"
            @click="snackbar.isOpened = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <!-- style="
        background-image: url('../public/uploads/backgroundImage/1847538.jpg');
        background-size: cover;
        background-position: center;
      " -->
      <v-main class="px-3 mt-n8">
        <router-view></router-view>
      </v-main>

      <v-footer class="custom-footer mt-10">
        <div class="text-center">
          2023<span v-if="2023 != year"> - {{ year }}</span> TeamSync
        </div></v-footer
      >
    </v-app>
  </div>
  <workDetailDialog />
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { useTheme } from "vuetify";
import {
  currentProject,
  currentProjectUserIds,
  resetProject,
} from "./store/project.js";
import {
  getWorkWithId,
  selectedWork,
  isWorkDetailsDialogOpen,
} from "./store/work.js";
import {
  notifications,
  putNotificationIsRead,
  editNotification,
  notificationsCount,
  deleteNotification,
} from "./store/notification.js";
import { getWikiWithId, isOpenedWikiDetailDialog } from "./store/wiki.js";
import { userInfo, inputUserInfo } from "./store/user.js";
import {
  baseURL,
  snackbar,
  baseThemeColor,
  themeColor,
} from "./store/common.js";
import workDetailDialog from "./components/dialogs/workDetailDialog.vue";

const route = useRoute();
const router = useRouter();
const theme = useTheme();

const year = new Date().getFullYear();

deleteNotification();

const goTo = (path) => {
  router.push(path);
};

if (localStorage.getItem("currentProject")) {
  currentProject.value = JSON.parse(localStorage.getItem("currentProject"));
}
if (localStorage.getItem("currentProjectUserIds")) {
  currentProjectUserIds.value = localStorage.getItem("currentProjectUserIds");
}
if (localStorage.getItem("userInfo")) {
  userInfo.value = JSON.parse(localStorage.getItem("userInfo"));
}
const judgmentLogin = (path) => {
  if (Object.keys(userInfo.value).length != 0) {
    currentProject.value = JSON.parse(localStorage.getItem("currentProject"));
    goTo(path);
  } else {
    router.push("/login");
  }
};
const logout = () => {
  userInfo.value = {};
  inputUserInfo.value = {};
  resetProject();
  currentProject.value = {
    id: 0,
    title: "",
    detail: "",
    state: "--",
    staff_ids: [],
    from: "",
    to: "",
    estimate_time: null,
    actual_time: null,
    progress: null,
  };
  localStorage.setItem("userInfo", JSON.stringify({}));
  localStorage.setItem("currentProjectUserIds", JSON.stringify({}));
  localStorage.setItem("currentProject", JSON.stringify({}));
  goTo("/login");
};
const drawer = ref(false);

const clickNotification = async (item) => {
  if (item.is_wiki) {
    await getWikiWithId(item.work_id);
    isOpenedWikiDetailDialog.value = true;
  } else {
    await getWorkWithId(item.work_id);
    isWorkDetailsDialogOpen.value = true;
  }
  item.is_read = true;
  putNotificationIsRead(item.id);
};

const baseThemeColors = [
  { theme: "light", name: "ライト", btnColor: "white" },
  { theme: "dark", name: "ダーク", btnColor: "black" },
];
const themeColors = [
  { theme: "blue", name: "ブルー", btnColor: "#2196F3" },
  { theme: "cyan", name: "シアン", btnColor: "#00BCD4" },
  { theme: "teal", name: "ティール", btnColor: "#009688" },
  { theme: "purple", name: "パープル", btnColor: "#9C27B0" },
  { theme: "deepPurple", name: "ディープパープル", btnColor: "#673AB7" },
  { theme: "pink", name: "ピンク", btnColor: "#E91E63" },
  { theme: "orange", name: "オレンジ", btnColor: "#FF9800" },
  { theme: "green", name: "グリーン", btnColor: "#4CAF50" },
  { theme: "lightGreen", name: "ライトグリーン", btnColor: "#8BC34A" },
  { theme: "lime", name: "ライム", btnColor: "#CDDC39" },
  { theme: "brown", name: "ブラウン", btnColor: "#795548" },
  { theme: "blueGrey", name: "ブルーグレー", btnColor: "#607D8B" },
];
const changeTheme = () => {
  let selectedTheme = theme.themes.value[themeColor.value].colors;
  if (baseThemeColor.value == "light") {
    selectedTheme.background = "#FFFFFF";
    selectedTheme.surface = "#FFFFFF";
    selectedTheme["grey-lighten-4"] = "#F5F5F5";
    theme.themes.value[themeColor.value].dark = false;
  } else {
    selectedTheme.background = "#000000";
    selectedTheme.surface = "#212121";
    selectedTheme["grey-lighten-4"] = "#424242";
    theme.themes.value[themeColor.value].dark = true;
  }
  theme.global.name.value = themeColor.value;
  localStorage.setItem("themeColor", themeColor.value);
  localStorage.setItem("baseThemeColor", baseThemeColor.value);
};
if (localStorage.getItem("themeColor")) {
  themeColor.value = localStorage.getItem("themeColor");
}
if (localStorage.getItem("baseThemeColor")) {
  baseThemeColor.value = localStorage.getItem("baseThemeColor");
}
changeTheme();
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
  margin-top: 60px;
}
.title {
  align-items: center;
  cursor: pointer;
  border-bottom: none;
  font-family: "Shantell Sans", cursive;
  height: 50px;
  font-weight: 100;
  font-size: 1.5rem;
  font-style: normal;
}
.toolbar {
  display: none;
}
.text-center {
  margin: 0 auto;
}
.custom-footer {
  position: static !important;
  border-top: 1px solid #ccc;
}
.nav {
  display: block;
}
.is-not-read {
  background-color: rgb(210, 137, 41);
}
.pre-wrap {
  white-space: pre-wrap;
}
@media screen and (min-width: 650px) {
  .nav {
    display: none;
  }
  .toolbar {
    display: flex;
  }
}
</style>

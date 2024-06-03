<template>
  <div id="app">
    <v-app>
      <v-app-bar app color="primary">
        <v-app-bar-title @click="judgmentLogin('/')">
          <span class="title">
            <img
              src="../public/typescript.png"
              class="mr-2"
              style="width: 50px"
            />
            <h1 class="text-h6">TeamSync</h1></span
          ></v-app-bar-title
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
              <v-card style="width: 400px; max-height: 500px">
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
        <span v-else class="point-cursor" @click="goTo('/userRegister')">
          <v-avatar class="mr-2 mb-1" size="small" v-if="userInfo.icon">
            <v-img
              :src="baseURL + '/public/uploads/' + userInfo.icon"
              :alt="userInfo.name"
            ></v-img
            ><v-tooltip activator="parent" location="bottom"
              >アカウント編集（{{ userInfo.name }}）</v-tooltip
            ></v-avatar
          >
          <v-avatar class="mr-2 mb-1" size="small" v-else
            ><span style="color: white">{{
              String(userInfo.name).charAt(0)
            }}</span
            ><v-tooltip activator="parent" location="bottom"
              >アカウント編集（{{ userInfo.name }}）</v-tooltip
            ></v-avatar
          >
        </span>
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

      <v-footer class="custom-footer" app>
        <div class="text-center my-2">
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
import { userInfo, inputUserInfo } from "./store/user.js";
import { baseURL, snackbar } from "./store/common.js";
import workDetailDialog from "./components/dialogs/workDetailDialog.vue";

const route = useRoute();
const router = useRouter();

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
  await getWorkWithId(item.work_id);
  isWorkDetailsDialogOpen.value = true;
  item.is_read = true;
  putNotificationIsRead(item.id);
};
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
  display: flex;
  align-items: center;
  width: 100px;
  cursor: pointer;
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
  height: 10px;
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

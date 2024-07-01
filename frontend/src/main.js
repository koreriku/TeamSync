import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router.js";
// Vuetify のインポートを追加 **********/
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const greenColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#43A047", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#2E7D32",
  "light-blue": "#8BC34A",
  "grey-lighten-4": "#F5F5F5",
};

const lightGreenColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#8BC34A", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#558B2F",
  "light-blue": "#CCFF90",
  "grey-lighten-4": "#F5F5F5",
};

const limeColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#CDDC39", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#9E9D24",
  "light-blue": "#F4FF81",
  "grey-lighten-4": "#F5F5F5",
};

const pinkColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#EC407A", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#E91E63",
  "light-blue": "#FF80AB",
  "grey-lighten-4": "#F5F5F5",
};

const blueColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#2196F3", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#1867C0",
  "light-blue": "#03A9F4",
  "grey-lighten-4": "#F5F5F5",
};

const purpleColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#9C27B0", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#6A1B9A",
  "light-blue": "#AA00FF",
  "grey-lighten-4": "#F5F5F5",
};

const deepPurpleColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#673AB7", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#4527A0",
  "light-blue": "#B388FF",
  "grey-lighten-4": "#F5F5F5",
};

const tealColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#009688", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#00695C",
  "light-blue": "#00BFA5",
  "grey-lighten-4": "#F5F5F5",
};

const orangeColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#FF9800", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#E65100",
  "light-blue": "#FF6D00",
  "grey-lighten-4": "#F5F5F5",
};

const cyanColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#00BCD4", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#00838F",
  "light-blue": "#B2EBF2",
  "grey-lighten-4": "#F5F5F5",
};

const brownColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#795548", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#4E342E",
  "light-blue": "#A1887F",
  "grey-lighten-4": "#F5F5F5",
};

const blueGreyColor = {
  green: "#4CAF50", // エクセル
  yellow: "#FFEB3B", // 新規登録
  red: "#F44336", // 削除
  blue: "#607D8B", // 編集
  grey: "#9E9E9E", // 戻る
  primary: "#37474F",
  "light-blue": "#90A4AE",
  "grey-lighten-4": "#F5F5F5",
};
// 以下を追加 **********/
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "blue",
    themes: {
      blue: {
        colors: blueColor,
      },
      green: {
        colors: greenColor,
      },
      lightGreen: {
        colors: lightGreenColor,
      },
      lime: {
        colors: limeColor,
      },
      pink: {
        colors: pinkColor,
      },
      purple: {
        colors: purpleColor,
      },
      deepPurple: {
        colors: deepPurpleColor,
      },
      orange: {
        colors: orangeColor,
      },
      cyan: {
        colors: cyanColor,
      },
      teal: {
        colors: tealColor,
      },
      brown: {
        colors: brownColor,
      },
      blueGrey: {
        colors: blueGreyColor,
      },
    },
  },
});

createApp(App).use(vuetify).use(router).mount("#app");

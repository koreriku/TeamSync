import { ref } from "vue";
import axios from "axios";

const commonBASE_URL = "http://localhost:3000/common";

const baseURL = new URL(window.location.href).origin;
console.log(baseURL);

const markDownColor = ref("#E0E0E0");

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentTime() {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  const hh = ("00" + h).slice(-2);
  const mm = ("00" + m).slice(-2);
  const ss = ("00" + s).slice(-2);

  return `${hh}:${mm}:${ss}`;
}

function getCurrentDateTime() {
  return getCurrentDate() + " " + getCurrentTime();
}

const emailRules = [
  (v) => !!v || "メールアドレスは必須です",
  (v) => /.+@.+\..+/.test(v) || "有効なメールアドレスを入力してください",
];

const isDeleteDialogOpen = ref(false);

function getFutureDate(days, today = new Date()) {
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);

  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, "0");
  const day = String(futureDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const convertArrayToText = (array) => {
  let text = "";
  if (!array) {
    return "";
  }
  for (const data of array) {
    if (text === "") {
      text = data;
    } else {
      text = text + "、" + data;
    }
  }
  return text;
};

// 前回の添付ファイルを格納
const newAttachedFile = ref([]);
const newAttachedFiles = ref([]);

//　添付ファイルをバックエンドでアップロード
const postFiles = async (isTimeStamp = true) => {
  const attachedFiles = [];
  if (newAttachedFiles.value.length > 0) {
    for (const file of newAttachedFiles.value) {
      const formData = new FormData();
      const timeStamp = Date.now();
      let uniqueFileName = file.name;
      if (isTimeStamp) {
        uniqueFileName = timeStamp + "_" + file.name;
      }
      formData.append("file", file, uniqueFileName);
      await axios
        .post(commonBASE_URL + `/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("ファイルのアップロードが成功しました");
        })
        .catch((error) => {
          console.error(
            "ファイルのアップロード中にエラーが発生しました",
            error
          );
        });
      attachedFiles.push({
        name: uniqueFileName,
        size: file.size,
      });
    }
    // editDxItem.value.attached_file.push(...attachedFiles);
    return attachedFiles;
  }
};

// 削除する項目名
const deleteContent = ref("");
// 削除するファイル名
const deleteTarget = ref("");
// 添付ファイルを削除
const deleteFile = async (fileName) => {
  await axios.put(commonBASE_URL + "/deleteFile", {
    fileName: fileName,
  });
};
const isPreview = ref(true);

const showAllWord = ref(false);
const omittedText = (text, max_length) => {
  if (!showAllWord.value && text) {
    return String(text).replace(/\r?\n/g, "").length > max_length
      ? String(text).replace(/\r?\n/g, "").slice(0, max_length) + "…"
      : String(text).replace(/\r?\n/g, "");
  } else {
    return text;
  }
};

const displaySnackbar = (color, text) => {
  snackbar.value.color = color;
  snackbar.value.text = text;
  snackbar.value.isOpened = true;
};

const snackbar = ref({
  isOpened: false,
  color: "blue",
  text: "",
});

export {
  emailRules,
  isDeleteDialogOpen,
  newAttachedFile,
  newAttachedFiles,
  baseURL,
  markDownColor,
  deleteContent,
  deleteTarget,
  isPreview,
  snackbar,
  getCurrentDate,
  getFutureDate,
  getCurrentDateTime,
  convertArrayToText,
  postFiles,
  deleteFile,
  omittedText,
  displaySnackbar,
};

<template>
  <v-dialog v-model="isOpenedWikiRegistrationDialog" max-width="1000px">
    <v-card :class="{ 'dark-scroll-bar': baseThemeColor == 'dark' }">
      <v-card-title class="d-flex justify-space-between">
        <div class="headline">新規登録</div>
        <v-btn
          icon
          color="gray"
          variant="outlined"
          class="mb-3"
          @click="isOpenedWikiRegistrationDialog = false"
        >
          <v-icon>mdi-arrow-u-left-top</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >閉じる</v-tooltip
          ></v-btn
        >
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="editedWiki.title"
          label="タイトル"
          required
          variant="outlined"
        ></v-text-field>
        <v-btn
          id="attached-url"
          icon
          variant="outlined"
          color="gray"
          class="mb-3"
          @click="isImageUrls = true"
        >
          <v-icon>mdi-image-area</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >添付ファイルURL</v-tooltip
          ></v-btn
        >
        <v-menu
          activator="#attached-url"
          v-model="isImageUrls"
          :close-on-content-click="false"
          location="end"
        >
          <v-list>
            <v-list-item
              v-for="(file, i) in editedWiki.files"
              :key="i"
              style="border-bottom: 1px solid #e0e0e0"
            >
              <v-list-item-title>
                <span>{{ file.name.replace(/^(\d+)_/, "") }}</span>

                <v-btn
                  icon
                  color="gray"
                  variant="outlined"
                  class="ml-3 my-1"
                  @click="copyLink(baseURL + '/public/uploads/' + file.name)"
                  size="small"
                >
                  <v-icon>mdi-link</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >リンクをコピー</v-tooltip
                  ></v-btn
                >
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-textarea
          v-model="editedWiki.detail"
          variant="outlined"
          label="詳細"
          rows="10"
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
          <MarkDownViewer :source="editedWiki.detail" class="mb-5" />
        </div>
        <v-row>
          <v-col cols="10" xs="10" sm="10" md="5" lg="5" xl="5" xxl="5"
            ><v-select
              variant="outlined"
              v-model="editedWiki.categoryName"
              :items="categories.map((item) => item.name)"
              label="カテゴリー"
              multiple
              chips
            ></v-select
          ></v-col>
          <v-col cols="2" xs="2" sm="2" md="1" lg="1" xl="1" xxl="1">
            <v-btn
              icon
              variant="outlined"
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
            <categoryRegistration projectId="0" />
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6"
            ><v-select
              variant="outlined"
              v-model="editedWiki.department_name"
              :items="
                [
                  { name: '' },
                  ...departmentsForInput.filter((item) => item.name != '--'),
                ].map((item) => item.name)
              "
              label="部署"
            ></v-select
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p class="ml-4 text-medium-emphasis text-caption">タイトルカラー</p>
            <div class="d-flex">
              <v-color-picker
                v-model="editedWiki.color"
                hide-canvas
                hide-sliders
              ></v-color-picker>
              <v-btn
                icon
                variant="outlined"
                id="palette"
                color="gray"
                class="mx-3 mt-9"
                size="small"
                @click="isColorPalette = true"
              >
                <v-icon>mdi-palette-outline</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >パレットを開く</v-tooltip
                ></v-btn
              >
              <v-menu
                activator="#palette"
                v-model="isColorPalette"
                :close-on-content-click="false"
                location="end"
              >
                <v-color-picker
                  v-model="editedWiki.color"
                  hide-inputs
                  show-swatches
                ></v-color-picker>
              </v-menu>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input
              chips
              variant="outlined"
              v-model="wikiImage"
              label="アイキャッチ画像"
            ></v-file-input>
            <div v-if="editedWiki.image">
              アイキャッチ画像に「{{
                editedWiki.image.replace(/^(\d+)_/, "")
              }}」が設定されています。
              <v-btn
                icon
                variant="outlined"
                class="mr-3 mb-2"
                size="small"
                @click="
                  newAttachedFile = editedWiki.image;
                  deleteContent = 'wikiImage';
                  deleteTarget = editedWiki.image.replace(/^(\d+)_/, '');
                  isDeleteDialogOpen = true;
                "
              >
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >アイキャッチ画像を削除</v-tooltip
                ></v-btn
              >
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input
              multiple
              chips
              variant="outlined"
              v-model="attachedFiles"
              label="添付ファイル"
            ></v-file-input>
          </v-col>
        </v-row>
      </v-card-text>
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-btn
          icon
          color="yellow"
          class="mb-3"
          @click="saveWork"
          v-if="editedWiki.id == 0"
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
  <deleteDialog :content="deleteContent" :target="deleteTarget" />
</template>

<script setup>
import { useRoute } from "vue-router";
import {
  isOpenedWikiRegistrationDialog,
  editedWiki,
  selectedWiki,
  getWiki,
  postWiki,
  putWiki,
} from "../../../store/wiki.js";
import {
  getCategory,
  categories,
  isCategoryRegistrationDialog,
  convertCategoryNameToId,
} from "../../../store/work.js";
import { userInfo } from "../../../store/user.js";
import {
  getCurrentDateTime,
  newAttachedFiles,
  postFiles,
  baseURL,
  deleteFile,
  newAttachedFile,
  deleteContent,
  deleteTarget,
  isDeleteDialogOpen,
  isPreview,
  displaySnackbar,
  departmentsForInput,
  getDepartments,
  convertDepartmentNameToId,
  baseThemeColor,
} from "../../../store/common.js";
import { onBeforeMount, ref } from "vue";
import categoryRegistration from "../categoryRegistration.vue";
import MarkDownViewer from "../MarkDownViewer.vue";
import deleteDialog from "../deleteDialog.vue";

onBeforeMount(async () => {
  await getCategory(0);
  await getDepartments();
  newAttachedFiles.value = [];
});

const isColorPalette = ref(false);
const isImageUrls = ref(false);
const wikiImage = ref([]);
const attachedFiles = ref([]);

const saveWork = async () => {
  isOpenedWikiRegistrationDialog.value = false;

  if (wikiImage.value.length > 0) {
    if (editedWiki.value.image) {
      deleteFile(editedWiki.value.image);
    }
    newAttachedFiles.value = wikiImage.value;
    let files = await postFiles();
    selectedWiki.value.image = files[0].name;
    editedWiki.value.image = files[0].name;
  }

  editedWiki.value.staff = {
    name: userInfo.value.name,
    icon: userInfo.value.icon,
  };
  editedWiki.value.category = convertCategoryNameToId(
    editedWiki.value.categoryName
  );
  editedWiki.value.department = convertDepartmentNameToId(
    editedWiki.value.department_name
  );
  editedWiki.value.update_date = getCurrentDateTime();

  selectedWiki.value = Object.assign({}, editedWiki.value);

  let newFiles = [];
  if (attachedFiles.value.length > 0) {
    newAttachedFiles.value = attachedFiles.value;
    let files = await postFiles();
    newFiles = [...editedWiki.value.files, ...files];
    selectedWiki.value.files = [...editedWiki.value.files, ...files];
    editedWiki.value.files = JSON.stringify([
      ...editedWiki.value.files,
      ...files,
    ]);
  } else if (editedWiki.value.files.length > 0) {
    editedWiki.value.files = JSON.stringify([...editedWiki.value.files]);
  } else {
    editedWiki.value.files = JSON.stringify(editedWiki.value.files);
  }
  if (editedWiki.value.id == 0) {
    editedWiki.value.registration_date = getCurrentDateTime();
    await postWiki();
  } else {
    await putWiki();
  }
  selectedWiki.value.files = JSON.parse(editedWiki.value.files);
  await getWiki();
};

const copyLink = (text) => {
  // http環境で動くコピーコード
  const copyTextFallback = (str) => {
    if (!str || typeof str !== "string") {
      return "";
    }
    // 空div 生成
    var tmp = document.createElement("div");
    // 選択用のタグ生成
    var pre = document.createElement("pre");

    // 親要素のCSSで user-select: none だとコピーできないので書き換える
    pre.style.webkitUserSelect = "auto";
    pre.style.userSelect = "auto";

    tmp.appendChild(pre).textContent = str;

    // 要素を画面外へ
    var s = tmp.style;
    s.position = "fixed";
    s.right = "200%";

    // body に追加
    document.body.appendChild(tmp);
    // 要素を選択
    document.getSelection().selectAllChildren(tmp);

    // クリップボードにコピー
    var result = document.execCommand("copy");

    // 要素削除
    document.body.removeChild(tmp);
    return;
  };

  if (!navigator.clipboard) {
    // navigator.clipboardが利用的出来ない場合は、フォールバックなコードを実行
    copyTextFallback(text);
    displaySnackbar("grey", "URLをクリップボードにコピーしました");
    return;
  }
  // https環境で動作するコード
  navigator.clipboard.writeText(text);
  displaySnackbar("grey", "URLをクリップボードにコピーしました");
};
</script>

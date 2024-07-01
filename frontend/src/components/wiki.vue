<template>
  <div class="mb-8 d-flex">
    <span class="text-h4 mr-5">Wiki</span>
    <v-btn
      icon
      color="yellow"
      class="mr-3"
      @click="
        resetWiki();
        isOpenedWikiRegistrationDialog = true;
      "
    >
      <v-icon>mdi-plus</v-icon>
      <v-tooltip activator="parent" location="bottom">新規</v-tooltip></v-btn
    >
    <v-btn
      icon
      color="gray"
      class="mb-3 mr-3"
      @click="reset"
      v-if="isSearchedWiki"
    >
      <v-icon>mdi-restore</v-icon>
      <v-tooltip activator="parent" location="bottom"
        >リセット</v-tooltip
      ></v-btn
    >
  </div>
  <v-row>
    <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3" xxl="3">
      <v-select
        v-model="searchWikiCondition.category"
        :items="[{ name: '' }, ...categories].map((item) => item.name)"
        density="compact"
        variant="outlined"
        label="カテゴリー"
        @update:model-value="
          () => {
            searchWiki();
          }
        "
      ></v-select>
    </v-col>
    <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3" xxl="3">
      <v-select
        v-model="searchWikiCondition.department_name"
        :items="
          [
            { name: '' },
            ...departmentsForInput.filter((item) => item.name != '--'),
          ].map((item) => item.name)
        "
        density="compact"
        variant="outlined"
        label="部署"
        @update:model-value="
          () => {
            searchWiki();
          }
        "
      ></v-select>
    </v-col>
    <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6" xxl="6">
      <v-text-field
        label="キーワード検索"
        prepend-inner-icon="mdi-magnify"
        v-model="searchWikiCondition.word"
        density="compact"
        variant="outlined"
        @keyup.enter="searchWiki"
      ></v-text-field>
    </v-col>
  </v-row>

  <v-alert
    v-if="wikis.length == 0"
    color="blue"
    icon="$info"
    text="Wikiが投稿されていません。"
  ></v-alert>
  <div>
    <v-row>
      <v-col
        v-for="wiki in searchedWikis.slice(
          (page - 1) * displayWikiCount,
          (page - 1) * displayWikiCount + displayWikiCount
        )"
        :key="wiki.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="point-cursor"
          @click="
            markDownColor = wiki.color;
            isOpenedWikiDetailDialog = true;
            selectedWiki = wiki;
          "
        >
          <v-img
            :src="baseURL + '/public/uploads/' + wiki.image"
            height="250px"
            cover
          ></v-img>
          <v-card-subtitle class="mt-2 mb-n1"
            ><div>{{ wiki.department_name }}</div>
          </v-card-subtitle>
          <v-card-title
            ><div>{{ wiki.title }}</div>
          </v-card-title>
          <v-card-text>
            <span v-for="category of wiki.categoryName"
              ><v-chip class="mr-2" variant="flat">{{ category }}</v-chip></span
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <v-pagination v-model="page" :length="pageCount" class="mt-8"></v-pagination>
  <wikiRegistrationDialog :isEdited="isEdited" />
  <wikiDetailDialog />
  <workDetailDialog />
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import {
  isOpenedWikiRegistrationDialog,
  isOpenedWikiDetailDialog,
  getWiki,
  wikis,
  selectedWiki,
  searchWiki,
  isSearchedWiki,
  searchWikiCondition,
  searchedWikis,
  resetSearchedWikis,
  resetWiki,
} from "../store/wiki.js";

import { getCategory, categories } from "../store/work.js";
import {
  baseURL,
  markDownColor,
  getDepartments,
  departmentsForInput,
} from "../store/common.js";
import { userInfo, getUser } from "../store/user.js";
import wikiDetailDialog from "./dialogs/wiki/wikiDetailDialog.vue";
import workDetailDialog from "./dialogs/workDetailDialog.vue";
import wikiRegistrationDialog from "./dialogs/wiki/wikiRegistrationDialog.vue";

const router = useRouter();
const page = ref(1);
const pageCount = ref(1);
const displayWikiCount = ref(12);

if (!userInfo.value.id) {
  router.push("/login");
}
onBeforeMount(async () => {
  await getDepartments();
  await getCategory(0);
  await getWiki();
  await getUser(0);
  pageCount.value = Math.ceil(
    searchedWikis.value.length / displayWikiCount.value
  );
});

const isEdited = ref(false);

const reset = () => {
  isSearchedWiki.value = false;
  resetSearchedWikis();
  searchedWikis.value = wikis.value.concat();
};
</script>

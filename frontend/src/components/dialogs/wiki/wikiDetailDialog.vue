<template>
  <v-dialog v-model="isOpenedWikiDetailDialog" max-width="1250px">
    <v-card>
      <v-card-text>
        <v-card
          class="mb-5 title"
          :image="baseURL + '/public/uploads/' + selectedWiki.image"
          height="250px"
        >
          <v-card-text class="d-flex justify-space-between">
            <div :style="{ color: selectedWiki.color }">
              {{ selectedWiki.update_date.substr(0, 10) }}
            </div>
            <div>
              <v-btn
                icon
                color="blue"
                class="mr-3 mb-2"
                @click="
                  editedWiki = Object.assign({}, selectedWiki);
                  isOpenedWikiRegistrationDialog = true;
                "
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >編集</v-tooltip
                ></v-btn
              >
              <wikiRegistrationDialog />
              <v-btn
                icon
                color="red"
                class="mr-3 mb-2"
                @click="
                  deleteContent = 'wiki';
                  deleteTarget = '';
                  isDeleteDialogOpen = true;
                "
              >
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >削除</v-tooltip
                ></v-btn
              >
              <deleteDialog :content="deleteContent" :target="deleteTarget" />

              <v-btn
                icon
                color="gray"
                @click="isOpenedWikiDetailDialog = false"
              >
                <v-icon>mdi-arrow-u-left-top</v-icon>
                <v-tooltip activator="parent" location="bottom"
                  >閉じる</v-tooltip
                ></v-btn
              >
            </div>
          </v-card-text>
          <div class="text-center">
            <v-card-title
              class="text-h3"
              :style="{ color: selectedWiki.color }"
              >{{ selectedWiki.title }}</v-card-title
            >
          </div>
          <div class="category">
            <span v-for="category of selectedWiki.categoryName"
              ><v-chip class="mr-2" variant="flat">{{ category }}</v-chip></span
            >
          </div>
          <div class="staff">
            <v-avatar
              class="mr-2 mb-1"
              size="small"
              v-if="selectedWiki.staff.icon"
            >
              <v-img
                :src="baseURL + '/public/uploads/' + selectedWiki.staff.icon"
                :alt="selectedWiki.staff.name"
              ></v-img
            ></v-avatar>
            <v-avatar class="mr-2 mb-1" size="small" v-else
              ><span style="color: white">{{
                String(selectedWiki.staff.name).charAt(0)
              }}</span></v-avatar
            ><span :style="{ color: selectedWiki.color }">{{
              selectedWiki.staff.name
            }}</span>
          </div>
        </v-card>
        <v-card class="mb-5">
          <v-card-text>
            <MarkDownViewer :source="selectedWiki.detail" class="mb-5" />
            <v-row v-if="selectedWiki.files.length > 0">
              <v-col>
                <v-list-item prepend-icon="mdi-call-made"
                  ><v-list-item-subtitle>添付ファイル</v-list-item-subtitle>
                  <v-list-item-title v-for="file of selectedWiki.files"
                    ><a
                      :href="baseURL + '/public/uploads/' + file.name"
                      target="_blank"
                      >{{ file.name.replace(/^(\d+)_/, "") }}</a
                    ><Button
                      variant="flat"
                      class="text-disabled ml-3"
                      @click="
                        newAttachedFile = file.name;
                        deleteContent = 'wikiFiles';
                        deleteTarget = file.name.replace(/^(\d+)_/, '');
                        isDeleteDialogOpen = true;
                      "
                      >削除</Button
                    ></v-list-item-title
                  ></v-list-item
                >
                <v-divider inset></v-divider>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-row class="mt-5">
          <v-col lg="8" md="9" sm="10">
            <v-textarea
              label="コメント"
              variant="outlined"
              v-model="comment.content"
            ></v-textarea>
          </v-col>
          <v-col class="d-flex align-end mb-5" cols="2">
            <Button icon color="gray" @click="saveComment"
              ><v-icon>mdi-comment-plus-outline</v-icon>
              <v-tooltip activator="parent" location="end"
                >コメント挿入</v-tooltip
              >
            </Button>
          </v-col>
        </v-row>

        <v-card v-if="selectedWiki.comment.length > 0">
          <v-card-title>コメント一覧</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(comment, index) in selectedWiki.comment.reverse()"
                class="mb-3"
              >
                <v-list-item-subtitle class="mb-2">
                  <v-avatar
                    class="mr-2 mb-1"
                    size="x-small"
                    v-if="comment.icon"
                  >
                    <v-img
                      :src="baseURL + '/public/uploads/' + comment.icon"
                      :alt="comment.user"
                    ></v-img
                  ></v-avatar>
                  <v-avatar class="mr-2 mb-1" size="x-small" v-else>{{
                    String(comment.user).charAt(0)
                  }}</v-avatar>
                  <span class="mr-5">{{ comment.user }}</span>
                  {{ comment.registration_date }}</v-list-item-subtitle
                >
                <div
                  class="d-flex justify-space-between"
                  style="white-space: pre-wrap"
                >
                  <div>
                    <p>{{ comment.content }}</p>
                  </div>
                  <v-btn
                    v-if="comment.user == userInfo.name"
                    variant="plain"
                    @click="deleteComment(index)"
                    >削除</v-btn
                  >
                </div>
                <v-divider></v-divider>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import {
  isOpenedWikiRegistrationDialog,
  isOpenedWikiDetailDialog,
  editedWiki,
  selectedWiki,
  putWikiComment,
} from "../../../store/wiki.js";
import { comment, resetComment } from "../../../store/work.js";
import { participatingProjectIds } from "../../../store/project.js";
import {
  convertArrayToText,
  isDeleteDialogOpen,
  getCurrentDateTime,
  baseURL,
  newAttachedFile,
  deleteContent,
  deleteTarget,
} from "../../../store/common.js";
import { userInfo } from "../../../store/user.js";
import wikiRegistrationDialog from "./wikiRegistrationDialog.vue";
import deleteDialog from "../deleteDialog.vue";
import MarkDownViewer from "../MarkDownViewer.vue";

const route = useRoute();

const saveComment = async () => {
  let currentDate = getCurrentDateTime();
  comment.value.user = userInfo.value.name;
  comment.value.icon = userInfo.value.icon;
  comment.value.registration_date = currentDate;
  selectedWiki.value.comment.unshift(comment.value);
  selectedWiki.value.update_date = currentDate;
  editedWiki.value = selectedWiki.value;
  resetComment();
  await putWikiComment();
};

const deleteComment = async (index) => {
  editedWiki.value = selectedWiki.value;
  editedWiki.value.comment.splice(index, 1);
  await putWikiComment();
};
</script>

<style scoped>
.title {
  position: relative;
}
.staff {
  position: absolute;
  right: 20px;
  bottom: 5px;
}
.category {
  position: absolute;
  left: 20px;
  bottom: 5px;
}
</style>

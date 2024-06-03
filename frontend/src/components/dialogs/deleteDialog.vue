<template>
  <v-dialog v-model="isDeleteDialogOpen" max-width="400">
    <v-card>
      <v-card-title>削除確認</v-card-title>
      <v-divider></v-divider>
      <v-card-text
        ><span v-if="props.target">「{{ props.target }}」を</span
        >本当に削除してよろしいですか？</v-card-text
      >
      <v-divider></v-divider>
      <div class="d-flex justify-end my-3">
        <v-btn
          color="gray"
          text
          class="mr-3"
          prepend-icon="mdi-close"
          variant="outlined"
          @click="isDeleteDialogOpen = false"
          >キャンセル</v-btn
        >
        <v-btn
          color="red"
          class="mr-3"
          text
          prepend-icon="mdi-circle-outline"
          @click="yesMethod"
          variant="outlined"
          >削除</v-btn
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {
  isWorkDetailsDialogOpen,
  deleteWork,
  getWork,
  selectedWork,
  deleteChildrenWork,
  getChildrenWork,
  isChildrenWorkEditDialogOpen,
  selectedChildrenWork,
  getRecentUpdateWorks,
  putWorkFiles,
  editedWork,
} from "../../store/work.js";
import {
  getWiki,
  putWiki,
  deleteWiki,
  selectedWiki,
  isOpenedWikiDetailDialog,
  editedWiki,
  putWikiImage,
} from "../../store/wiki.js";
import { useRoute, useRouter } from "vue-router";

import {
  deleteProject,
  isProjectRegistrationDialogOpen,
  currentProject,
  getProject,
  editProject,
} from "../../store/project.js";
import { deleteTodo } from "../../store/todo.js";
import {
  isDeleteDialogOpen,
  deleteFile,
  newAttachedFile,
  getCurrentDateTime,
} from "../../store/common.js";
import { userInfo } from "../../store/user.js";
import { defineProps } from "vue";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  content: String,
  target: {
    type: String,
    default: "",
  },
});

const yesMethod = async () => {
  if (props.content == "work") {
    await deleteWork(selectedWork.value.id);
    if (route.path == "/") {
      await getRecentUpdateWorks();
    } else if (route.path == "/work") {
      await getWork();
    } else if (route.path == "/todo") {
      await getWork(null);
      getDetailTodo();
    }
    isWorkDetailsDialogOpen.value = false;
  } else if (props.content == "project") {
    await deleteProject(editProject.value.id);
    await getProject(userInfo.value.id);
    await getRecentUpdateWorks();
    router.push("/");
    isProjectRegistrationDialogOpen.value = false;
  } else if (props.content == "todo") {
    await deleteTodo();
  } else if (props.content == "childWork") {
    await deleteChildrenWork(selectedChildrenWork.value.id);
    await getChildrenWork(selectedWork.value.id);
    isChildrenWorkEditDialogOpen.value = false;
  } else if (props.content == "files") {
    for (const [index, file] of selectedWork.value.files.entries()) {
      if (file.name == newAttachedFile.value) {
        selectedWork.value.files.splice(index, 1);
        editedWork.value.files = JSON.stringify(selectedWork.value.files);
        editedWork.value.update_date = getCurrentDateTime();
        editedWork.value.id = selectedWork.value.id;
        putWorkFiles(editedWork.value);
        deleteFile(newAttachedFile.value);
        break;
      }
    }
  } else if (props.content == "wikiFiles") {
    for (const [index, file] of selectedWiki.value.files.entries()) {
      if (file.name == newAttachedFile.value) {
        selectedWiki.value.files.splice(index, 1);
        editedWiki.value = Object.assign({}, selectedWiki.value);
        editedWiki.value.files = JSON.stringify(selectedWiki.value.files);
        editedWiki.value.update_date = getCurrentDateTime();
        putWiki();
        deleteFile(newAttachedFile.value);
        break;
      }
    }
  } else if (props.content == "wikiImage") {
    selectedWiki.value.image = "";
    editedWiki.value.image = "";
    editedWiki.value.update_date = getCurrentDateTime();
    putWikiImage(editedWiki.value);
    deleteFile(newAttachedFile.value);
    getWiki();
  } else if (props.content == "wiki") {
    await deleteWiki(selectedWiki.value.id);
    await getWiki();
    isOpenedWikiDetailDialog.value = false;
  }
  isDeleteDialogOpen.value = false;
};
</script>

<template>
  <v-dialog v-model="isCategoryRegistrationDialog" max-width="400px">
    <v-card>
      <v-card-title> 新しいカテゴリーを追加 </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="newCategory.name"
          label="カテゴリー名"
          @keyup.enter="
            postCategory();
            newCategory.name = '';
            isCategoryRegistrationDialog = false;
          "
          required
        ></v-text-field>

        <div class="text-center">
          <v-btn icon color="yellow" @click="saveCategory">
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >登録</v-tooltip
            ></v-btn
          >
        </div>

        <v-table>
          <v-list>
            <v-list-subheader
              ><v-chip
                v-if="!isEdited"
                prepend-icon="mdi-sort"
                @click="isEdited = !isEdited"
                >並べ替え</v-chip
              ><v-chip
                v-else
                prepend-icon="mdi-pencil"
                @click="isEdited = !isEdited"
                >編集</v-chip
              ></v-list-subheader
            >
            <v-list-item
              v-if="!isEdited"
              v-for="(item, i) in categories"
              :key="i"
              :value="item"
              :active="false"
              style="border-bottom: 1px solid #e0e0e0"
              @click="inputDepartment(item)"
            >
              <v-list-item-title
                :style="{
                  color: selectedItem.name === item.name ? '#2196F3' : '',
                }"
                >{{ item.name }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              v-else
              v-for="(item, i) in categories"
              :value="item"
              :active="false"
              style="border-bottom: 1px solid #e0e0e0"
            >
              <v-list-item-title class="d-flex"
                ><v-text-field
                  variant="outlined"
                  v-model="item.name"
                  density="compact"
                  single-line
                  hide-details
                  class="mr-2"
                ></v-text-field>
                <v-btn
                  icon
                  color="blue"
                  class="mr-2"
                  size="small"
                  @click="putCategory(item)"
                >
                  <v-icon>mdi-check</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >登録</v-tooltip
                  ></v-btn
                >
                <v-btn icon color="red" size="small" @click="deleteItem(item)">
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >削除</v-tooltip
                  ></v-btn
                >
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineProps } from "vue";
import {
  isCategoryRegistrationDialog,
  newCategory,
  postCategory,
  selectedItem,
  puttedItem,
  sortCategory,
  categories,
  putCategory,
  deleteCategory,
} from "../../store/work.js";

const props = defineProps({
  projectId: Number,
});

const isSelectedCategory = ref(true);

const isEdited = ref(false);
selectedItem.value = {};
puttedItem.value = {};
const saveCategory = () => {
  if (!newCategory.value.name) {
    return;
  }
  if (props.projectId == 0) {
    postCategory(0);
  } else {
    postCategory();
  }
  newCategory.value.name = "";
  isCategoryRegistrationDialog.value = false;
};

const inputDepartment = (item) => {
  if (isSelectedCategory.value) {
    selectedItem.value = item;
    isSelectedCategory.value = false;
  } else {
    puttedItem.value = item;
    isSelectedCategory.value = true;
  }
  if (selectedItem.value.id > 0 && puttedItem.value.id > 0) {
    sortCategory();
    selectedItem.value = {};
    puttedItem.value = {};
  }
};

const deleteItem = (item) => {
  deleteCategory(item.id);
  categories.value = categories.value.filter(
    (category) => item.id != category.id
  );
};
</script>

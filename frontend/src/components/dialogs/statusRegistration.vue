<template>
  <v-dialog v-model="isStatusRegistrationDialog" max-width="500px">
    <v-card>
      <v-card-title>状況を追加</v-card-title>
      <v-card-text>
        <div class="d-flex">
          <v-text-field
            v-model="newStatus.name"
            label="状況名"
            required
            class="mr-3"
          ></v-text-field>
          <v-btn icon class="mr-3" :color="newStatus.color">
            <v-menu
              activator="parent"
              location="end"
              :close-on-content-click="false"
            >
              <v-card style="min-width: 350px">
                <v-card-title class="text-center"></v-card-title>
                <v-card-text
                  ><v-color-picker
                    class="ma-2"
                    v-model="newStatus.color"
                    swatches-max-height="400px"
                    show-swatches
                  ></v-color-picker>
                </v-card-text> </v-card
            ></v-menu>
            <v-icon>mdi-palette</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >カラー選択</v-tooltip
            ></v-btn
          >
          <v-btn
            icon
            color="yellow"
            @click="
              postStatus();
              newStatus.name = '';
              newStatus.color = '';
              isStatusRegistrationDialog = false;
            "
          >
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
              v-for="(item, i) in statuses.slice(1)"
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
              v-for="(item, i) in statuses.slice(1)"
              :value="item"
              :active="false"
              style="border-bottom: 1px solid #e0e0e0"
            >
              <v-list-item-title class="d-flex"
                ><v-text-field
                  class="mr-2"
                  variant="outlined"
                  v-model="item.name"
                  density="compact"
                  single-line
                  hide-details
                ></v-text-field
                ><v-btn icon class="mr-2" size="small" :color="item.color">
                  <v-menu
                    activator="parent"
                    location="end"
                    :close-on-content-click="false"
                  >
                    <v-card style="min-width: 350px">
                      <v-card-title class="text-center"></v-card-title>
                      <v-card-text
                        ><v-color-picker
                          class="ma-2"
                          v-model="item.color"
                          swatches-max-height="400px"
                          show-swatches
                        ></v-color-picker>
                      </v-card-text> </v-card
                  ></v-menu>
                  <v-icon>mdi-palette</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                    >カラー選択</v-tooltip
                  ></v-btn
                ><v-btn
                  icon
                  color="blue"
                  class="mr-2"
                  size="small"
                  @click="putStatus(item)"
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
                ></v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import {
  isStatusRegistrationDialog,
  newStatus,
  postStatus,
  statuses,
  sortStatues,
  putStatus,
  selectedItem,
  puttedItem,
  deleteStatus,
} from "../../store/work.js";

const isSelectedStatus = ref(true);

const isEdited = ref(false);

selectedItem.value = {};
puttedItem.value = {};

const inputDepartment = (item) => {
  if (isSelectedStatus.value) {
    selectedItem.value = item;
    isSelectedStatus.value = false;
  } else {
    puttedItem.value = item;
    isSelectedStatus.value = true;
  }
  if (selectedItem.value.id > 0 && puttedItem.value.id > 0) {
    sortStatues();
    selectedItem.value = {};
    puttedItem.value = {};
  }
};
const deleteItem = (item) => {
  deleteStatus(item.id);
  statuses.value = statuses.value.filter((status) => item.id != status.id);
};
</script>

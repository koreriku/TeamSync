import { ref } from "vue";
import { convertCategoryIdToName } from "./work.js";
import { users, userInfo } from "./user.js";
import {
  setEditNotification,
  addNotification,
  deleteNotificationWithWorkID,
} from "./notification.js";
import {
  departments,
  getCurrentDateTime,
  convertDepartmentIdToName,
} from "./common.js";
import axios from "axios";

const wikiBASE_URL = "http://localhost:3000/wiki";

const isOpenedWikiRegistrationDialog = ref(false);
const isOpenedWikiDetailDialog = ref(false);

const wikis = ref([]);

const selectedWiki = ref({
  id: 0,
  title: "",
  detail: "",
  update_date: "",
  registration_date: "",
  staff: {},
  category: [],
  categoryName: [],
  comment: [],
  image: "",
  color: "#000000",
  files: [],
  department: 0,
  department_name: null,
});

const editedWiki = ref({
  id: 0,
  title: "",
  detail: "",
  update_date: "",
  registration_date: "",
  staff: {},
  category: [],
  categoryName: [],
  comment: [],
  image: "",
  color: "#000000",
  files: [],
  department: 0,
  department_name: null,
});

const resetWiki = () => {
  selectedWiki.value = {
    id: 0,
    title: "",
    detail: "",
    update_date: "",
    registration_date: "",
    staff: {},
    category: [],
    categoryName: [],
    comment: [],
    image: "",
    color: "#000000",
    files: [],
    department: 0,
    department_name: null,
  };
  editedWiki.value = {
    id: 0,
    title: "",
    detail: "",
    update_date: "",
    registration_date: "",
    staff: {},
    category: [],
    categoryName: [],
    comment: [],
    image: "",
    color: "#000000",
    files: [],
    department: 0,
    department_name: null,
  };
};

const getWiki = async () => {
  wikis.value = [];
  await axios.get(wikiBASE_URL).then((res) => {
    if (res.data.length == 0) return;
    for (const wiki of res.data) {
      wiki.department_name = convertDepartmentIdToName(wiki.department);
      wiki.categoryName = convertCategoryIdToName(wiki.category);
    }
    wikis.value = res.data;
    searchWiki();
  });
};

const getWikiWithId = async (id) => {
  await axios.get(wikiBASE_URL + "/id?id=" + id).then((res) => {
    res.data[0].department_name = convertDepartmentIdToName(
      res.data[0].department
    );
    res.data[0].categoryName = convertCategoryIdToName(res.data[0].category);
    selectedWiki.value = res.data[0];
    return selectedWiki.value;
  });
};

const postWiki = async () => {
  await axios.post(wikiBASE_URL, editedWiki.value).then(async (res) => {
    for (const staff of users.value) {
      if (staff.id == userInfo.value.id) {
        continue;
      }
      setEditNotification(
        `Wiki「${editedWiki.value.title}」が投稿されました。`,
        "",
        res.data[0].id,
        staff.id,
        false,
        getCurrentDateTime(),
        true
      );
      await addNotification();
    }
  });
  await getWiki();
};

const putWikiImage = async (wiki) => {
  await axios.put(wikiBASE_URL + "/image", wiki);
};

const putWiki = async () => {
  await axios.put(wikiBASE_URL, editedWiki.value);
  for (const staff of users.value) {
    if (staff.id == userInfo.value.id) {
      continue;
    }
    setEditNotification(
      `Wiki「${editedWiki.value.title}」が更新されました。`,
      "",
      editedWiki.value.id,
      staff.id,
      false,
      getCurrentDateTime(),
      true
    );
    await addNotification();
  }
};

const deleteWiki = async (id) => {
  await axios.delete(wikiBASE_URL + "?id=" + id);
  await deleteNotificationWithWorkID(id, true);
};

const putWikiComment = async () => {
  await axios.put(wikiBASE_URL + "/comment", editedWiki.value);
};

const searchWikiCondition = ref({
  category: "",
  department_name: "",
  ward: "",
});
const resetSearchedWikis = () => {
  searchWikiCondition.value = {
    category: "",
    department_name: "",
    ward: "",
  };
};
const searchedWikis = ref([]);
const isSearchedWiki = ref(false);
const searchWiki = () => {
  searchedWikis.value = [];
  isSearchedWiki.value = true;
  const useSearchWikiConditions = [];
  let judge = false;
  if (
    !searchWikiCondition.value.category &&
    !searchWikiCondition.value.department_name &&
    !searchWikiCondition.value.word
  ) {
    isSearchedWiki.value = false;
    searchedWikis.value = wikis.value.concat();
    return;
  } else {
    for (const key in searchWikiCondition.value) {
      if (searchWikiCondition.value[key]) {
        useSearchWikiConditions.push(key);
      }
    }
  }
  for (const wiki of wikis.value) {
    judge = false;
    for (const key of useSearchWikiConditions) {
      if (key == "category") {
        let judgeCategory = false;
        for (const category of wiki.categoryName) {
          if (category == searchWikiCondition.value.category) {
            judgeCategory = true;
            break;
          }
        }
        if (judgeCategory) {
          judge = true;
        } else {
          judge = false;
          break;
        }
      } else if (key == "department_name") {
        if (wiki.department_name == searchWikiCondition.value.department_name) {
          judge = true;
        } else {
          judge = false;
          break;
        }
      } else if (key == "word") {
        let judgeWord = false;
        for (const wikiKey in wiki) {
          let text = String(wiki[wikiKey]);
          if (text.includes(searchWikiCondition.value[key])) {
            judgeWord = true;
            break;
          }
        }
        if (judgeWord) {
          judge = true;
        } else {
          judge = false;
          break;
        }
      }
    }
    if (judge) {
      searchedWikis.value.push(wiki);
    }
  }
};

export {
  isOpenedWikiRegistrationDialog,
  selectedWiki,
  editedWiki,
  wikis,
  isOpenedWikiDetailDialog,
  isSearchedWiki,
  searchedWikis,
  searchWikiCondition,
  getWiki,
  postWiki,
  putWiki,
  deleteWiki,
  putWikiComment,
  searchWiki,
  resetSearchedWikis,
  resetWiki,
  putWikiImage,
  getWikiWithId,
};

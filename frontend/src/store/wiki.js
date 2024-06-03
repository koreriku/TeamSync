import { ref } from "vue";
import { convertCategoryIdToName } from "./work.js";
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
  comment: [],
  image: "",
  color: "#000000",
  files: [],
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
  };
};

const getWiki = async () => {
  wikis.value = [];
  await axios.get(wikiBASE_URL).then((res) => {
    if (res.data.length == 0) return;
    for (const wiki of res.data) {
      if (wiki.category.length > 0) {
        wiki.categoryName = convertCategoryIdToName(wiki.category);
      }
    }
    wikis.value = res.data;
    searchWiki();
  });
};

const postWiki = async () => {
  await axios.post(wikiBASE_URL, editedWiki.value);
  await getWiki();
};

const putWikiImage = async (wiki) => {
  await axios.put(wikiBASE_URL + "/image", wiki);
};

const putWiki = async () => {
  await axios.put(wikiBASE_URL, editedWiki.value);
};

const deleteWiki = async (id) => {
  await axios.delete(wikiBASE_URL + "?id=" + id);
};

const putWikiComment = async () => {
  await axios.put(wikiBASE_URL + "/comment", editedWiki.value);
};

const searchWikiCondition = ref({
  category: "",
  ward: "",
});
const resetSearchedWikis = () => {
  searchWikiCondition.value = {
    category: "",
  };
};
const searchedWikis = ref([]);
const isSearchedWiki = ref(false);
const searchWiki = () => {
  searchedWikis.value = [];
  isSearchedWiki.value = true;
  const useSearchWikiConditions = [];
  let judge = false;
  if (!searchWikiCondition.value.category && !searchWikiCondition.value.word) {
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
};

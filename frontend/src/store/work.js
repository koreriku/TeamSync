import { ref } from "vue";
import router from "../router/router.js";
import axios from "axios";
import {
  currentProject,
  searchedProjects,
  convertProjectIdToName,
  projects,
  getProject,
  getParticipatingProjectIds,
  participatingProjectIds,
  getLocalProject,
  convertProjectIdsToNames,
  searchProjectCondition,
  convertProjectNamesToIds,
} from "./project.js";
import {
  convertIdToUserName,
  userInfo,
  users,
  getProjectUsers,
  projectUsers,
  getUser,
  convertOnlyIdToUserName,
  searchOnlyUser,
} from "./user.js";
import {
  postFiles,
  getCurrentDateTime,
  convertArrayToText,
  getCurrentDate,
  displaySnackbar,
  getDepartments,
} from "./common.js";
import {
  setEditNotification,
  addNotification,
  editNotification,
  deleteNotificationWithWorkID,
} from "./notification.js";
import ExcelJS from "exceljs";

const workBASE_URL = "http://localhost:3000/work";
const statusBASE_URL = "http://localhost:3000/status";
const categoryBASE_URL = "http://localhost:3000/category";
const templateBASE_URL = "http://localhost:3000/template";

const workRegistrationDialog = ref(false);
const isWorkDetailsDialogOpen = ref(false);
const isStatusRegistrationDialog = ref(false);
const isCategoryRegistrationDialog = ref(false);
const isTemplateRegistrationDialog = ref(false);

const newStatus = ref({
  project_id: [],
  project_name: [],
  name: "",
  sort_key: 0,
  color: "",
});
const statuses = ref([]);

const priorities = ref([]);

const categories = ref([]);
const seDailyReportProcesses = ref([]);
const newCategory = ref({
  project_id: [],
  project_name: [],
  name: "",
  sort_key: 0,
});
const editWork = ref({
  id: 0,
  title: "",
  project: 0,
  project_name: "",
  detail: "",
  state: "",
  stateName: { name: "", color: "" },
  staffs: [],
  staffsName: [],
  priority: 1,
  priorityName: "--",
  category: [],
  categoryName: [],
  version: "",
  from: "",
  to: "",
  estimate_time: 0,
  actual_time: 0,
  progress: 0,
  comment: [],
  todo: false,
  se_daily_report_process: 0,
  seDailyReportProcessName: "",
  registration_date: "",
  update_date: "",
  files: [],
  children_title: "",
  work_id: 0,
  registered_staff: 0,
  gross_estimate_time: 0,
  gross_actual_time: 0,
  gross_progress: 0,
});
const editedWork = ref({
  id: 0,
  title: "",
  project: 0,
  project_name: "",
  detail: "",
  state: "",
  stateName: { name: "", color: "" },
  staffs: [],
  staffsName: [],
  priority: 1,
  priorityName: "--",
  category: [],
  categoryName: [],
  version: "",
  from: "",
  to: "",
  estimate_time: 0,
  actual_time: 0,
  progress: 0,
  comment: [],
  todo: false,
  se_daily_report_process: 0,
  seDailyReportProcessName: "",
  registration_date: "",
  update_date: "",
  files: [],
  children_title: "",
  work_id: 0,
  registered_staff: 0,
  gross_estimate_time: 0,
  gross_actual_time: 0,
  gross_progress: 0,
});

let selectedWork = ref({});

const resetWork = () => {
  editWork.value = {
    id: 0,
    title: "",
    project: currentProject.value.id,
    project_name: "",
    detail: "",
    state: "",
    stateName: { name: "", color: "" },
    staffs: [],
    staffsName: [],
    priority: 1,
    priorityName: "--",
    category: [],
    categoryName: [],
    version: "",
    from: "",
    to: "",
    estimate_time: 0,
    actual_time: 0,
    progress: 0,
    comment: [],
    todo: false,
    se_daily_report_process: 0,
    seDailyReportProcessName: "",
    registration_date: "",
    update_date: "",
    files: [],
    children_title: "",
    work_id: 0,
    registered_staff: 0,
    gross_estimate_time: 0,
    gross_actual_time: 0,
    gross_progress: 0,
  };
  resetEditedWork();
  selectedWork.value = {
    id: 0,
    title: "",
    project: currentProject.value.id,
    project_name: "",
    detail: "",
    state: "",
    stateName: { name: "", color: "" },
    staffs: [],
    staffsName: [],
    priority: 1,
    priorityName: "--",
    category: [],
    categoryName: [],
    version: "",
    from: "",
    to: "",
    estimate_time: 0,
    actual_time: 0,
    progress: 0,
    comment: [],
    todo: false,
    se_daily_report_process: 0,
    seDailyReportProcessName: "",
    registration_date: "",
    update_date: "",
    files: [],
    children_title: "",
    work_id: 0,
    registered_staff: 0,
    gross_estimate_time: 0,
    gross_actual_time: 0,
    gross_progress: 0,
  };
};
const resetEditedWork = () => {
  editedWork.value = {
    id: 0,
    title: "",
    project: currentProject.value.id,
    project_name: "",
    detail: "",
    state: 0,
    stateName: { name: "", color: "" },
    staffs: [],
    staffsName: [],
    priority: 1,
    priorityName: "--",
    category: [],
    categoryName: [],
    version: "",
    from: "",
    to: "",
    estimate_time: 0,
    actual_time: 0,
    progress: 0,
    comment: [],
    todo: false,
    se_daily_report_process: 0,
    seDailyReportProcessName: "",
    registration_date: "",
    update_date: "",
    files: [],
    children_title: "",
    work_id: 0,
    registered_staff: 0,
    gross_estimate_time: 0,
    gross_actual_time: 0,
    gross_progress: 0,
  };
};
const works = ref([]);

const childrenWorks = ref([]);
const cmbChildrenWorks = ["設計", "開発", "検証"];
const selectedChildrenWork = ref({
  id: 0,
  work_id: 0,
  title: "",
  detail: "",
  state: "",
  staffs: [],
  estimate_time: 0,
  actual_time: 0,
  progress: 0,
  registration_date: "",
  update_date: "",
});
const editChildrenWork = ref({
  id: 0,
  work_id: 0,
  title: "",
  detail: "",
  state: "",
  staffs: [],
  estimate_time: 0,
  actual_time: 0,
  progress: 0,
});
const editedChildrenWork = ref({
  id: 0,
  work_id: 0,
  title: "",
  detail: "",
  state: "",
  staffs: [],
  estimate_time: 0,
  actual_time: 0,
  progress: 0,
});
const resetChildrenWork = () => {
  editChildrenWork.value = {
    id: 0,
    work_id: 0,
    title: "",
    detail: "",
    state: "",
    staffs: [],
    estimate_time: 0,
    actual_time: 0,
    progress: 0,
  };
  selectedChildrenWork.value = {
    id: 0,
    work_id: 0,
    title: "",
    detail: "",
    state: "",
    staffs: [],
    estimate_time: 0,
    actual_time: 0,
    progress: 0,
  };
  editedChildrenWork.value = {
    id: 0,
    work_id: 0,
    title: "",
    detail: "",
    state: "",
    staffs: [],
    estimate_time: 0,
    actual_time: 0,
    progress: 0,
  };
};

const postWork = async () => {
  await axios.post(workBASE_URL, editedWork.value).then(async (res) => {
    for (const staff of editedWork.value.staffs) {
      if (staff == userInfo.value.id) {
        continue;
      }
      setEditNotification(
        `「${editedWork.value.title}」の担当者に設定されました。`,
        "",
        res.data[0].id,
        staff,
        false,
        getCurrentDateTime(),
        false
      );
      await addNotification();
    }
  });
  await getWork();
};

const postOnlyWorkProgressAndTime = async (
  id,
  actual_time,
  progress,
  state
) => {
  await axios.put(workBASE_URL + "/progressAndTime", {
    id: id,
    actual_time: actual_time,
    progress: progress,
    state: state,
  });
};

const putWork = async (work = editedWork.value, notice = true) => {
  await axios.put(workBASE_URL, work);
  if (notice) {
    for (const staff of editedWork.value.staffs) {
      if (staff == userInfo.value.id) {
        continue;
      }
      setEditNotification(
        `「${editedWork.value.title}」が変更されました。`,
        "",
        editedWork.value.id,
        staff,
        false,
        getCurrentDateTime(),
        false
      );
      await addNotification();
    }
  }
};

const putParentWorkProgressAndTime = async (work) => {
  await axios.put(workBASE_URL + "/parentProgressAndTime", work);
};

const putWorkFiles = async (work) => {
  await axios.put(workBASE_URL + "/files", work);
};

const putWorkComment = async () => {
  await axios.put(workBASE_URL + "/comment", editedWork.value);
};

const deleteWork = async (id) => {
  await axios.delete(workBASE_URL + "?id=" + id);
  await deleteNotificationWithWorkID(id, false);
};

const getWork = async (id = currentProject.value.id) => {
  works.value = [];
  await axios
    .get(workBASE_URL, {
      params: {
        projectId: id,
      },
    })
    .then((res) => {
      if (res.data.length == 0) return;
      if (projects.value.length == 0) {
        getProject(userInfo.value.id);
      }
      for (let work of res.data) {
        work = convertWork(work);
        //work.comment = JSON.parse(work.comment);
      }
      works.value = res.data;
      searchedWorks.value = res.data;
      search();
    });
};

const convertWork = (work) => {
  work.stateName = convertStatusIdToName(work.state);
  if (work.se_daily_report_process) {
    work.seDailyReportProcessName = convertSeDailyReportProcessIdToName(
      work.se_daily_report_process
    );
  } else {
    work.seDailyReportProcessName = "";
  }
  work.staffsName = convertIdToUserName(work.staffs);
  if (work.priority) {
    work.priorityName = convertPriorityIdToName(work.priority);
  } else {
    work.priorityName = "";
  }
  work.categoryName = convertCategoryIdToName(work.category);
  if (work.project) {
    work["project_name"] = convertProjectIdToName(work.project);
  }
  if (work.registered_staff) {
    work.registered_staff = searchOnlyUser(work.registered_staff);
  }
  if (userInfo.value.todo.includes(work.id)) {
    work["todo"] = true;
  } else {
    work["todo"] = false;
  }
  return work;
};

const deadlineIsPasted = (deadline) => {
  if (!deadline) {
    return false;
  }
  const now = getCurrentDate();
  if (Number(deadline.replaceAll("-", "")) < Number(now.replaceAll("-", ""))) {
    return true;
  }
  return false;
};

const getWorkWithId = async (id) => {
  await axios.get(workBASE_URL + "/id?id=" + id).then((res) => {
    selectedWork.value = convertWork(res.data[0]);
    return selectedWork.value;
  });
};

const openDetailsModal = (row) => {
  selectedWork.value = row;
  currentProject.value.id = selectedWork.value.project;
  getProjectUsers(getLocalProject(selectedWork.value.project).staff_ids);
  if (selectedWork.value.work_id) {
    parentWork.value = getParentWork(selectedWork.value.work_id);
    getChildrenWork(selectedWork.value.work_id);
  } else {
    getChildrenWork(selectedWork.value.id);
  }
  isWorkDetailsDialogOpen.value = true;
};

const previousChildrenWorkEstimateTime = ref(0);
const previousChildrenWorkActualTime = ref(0);
const previousChildrenWorkStaffs = ref([]);
const previousChildrenWorkProgress = ref(0);

const parentWork = ref({});

const getParentWork = (work_id) => {
  for (const work of works.value) {
    if (work_id == work.id) {
      return work;
    }
  }
};
const updateParentWorkByChildrenWork = async () => {
  let parentWork = getParentWork(editedWork.value.work_id);
  parentWork.estimate_time = 0;
  parentWork.actual_time = 0;
  parentWork.progress = 0;
  let sumProgress = 0;
  childrenWorks.value = [];
  for (const work of works.value) {
    if (work.work_id == editedWork.value.work_id) {
      if (work.id == editedWork.value.id) {
        childrenWorks.value.push(editedWork.value);
        continue;
      }
      childrenWorks.value.push(work);
    }
  }
  for (const childrenWork of childrenWorks.value) {
    parentWork.estimate_time += childrenWork.estimate_time
      ? Number(childrenWork.estimate_time)
      : 0;
    parentWork.actual_time += childrenWork.actual_time
      ? Number(childrenWork.actual_time)
      : 0;
    sumProgress += childrenWork.progress ? Number(childrenWork.progress) : 0;
  }
  parentWork.progress =
    Math.round((sumProgress / childrenWorks.value.length) * 100) / 100;
  await axios.put(workBASE_URL, parentWork);
  return parentWork;
};

const postChildrenWork = async () => {
  await axios.post(workBASE_URL + "/childrenWork", editedChildrenWork.value);
  //await getChildrenWork(selectedChildrenWork.value.work_id);
};

const putChildrenWork = async () => {
  await axios.put(workBASE_URL + "/childrenWork", editedChildrenWork.value);
};

const getChildrenWork = (work_id) => {
  childrenWorks.value = [];
  for (const work of works.value) {
    if (work.work_id == work_id) {
      childrenWorks.value.push(work);
    }
  }
};

const deleteChildrenWork = async (id) => {
  await axios.delete(workBASE_URL + "/childrenWork?work_id=" + id);
};

const deleteParentChildrenWork = async (id) => {
  await axios.delete(workBASE_URL + "/deleteParentChildrenWork?work_id=" + id);
};

const updateRouteDisplayWork = async () => {
  if (router.currentRoute.value.path == "/work") {
    await getWork();
  } else if (router.currentRoute.value.path == "/") {
    await getRecentUpdateWorks(false);
  }
};

const getStatus = async (id = currentProject.value.id) => {
  if (!id) {
    return;
  }
  await axios.get(statusBASE_URL + "?project_id=" + id).then((res) => {
    for (const data of res.data) {
      data.project_name = convertProjectIdsToNames(data.project_id);
    }
    statuses.value = res.data;
    statuses.value.unshift({ name: "" });
  });
};

const getStatusAll = async () => {
  await axios.get(statusBASE_URL + "/all").then((res) => {
    for (const data of res.data) {
      data.project_name = convertProjectIdsToNames(data.project_id);
    }
    statuses.value = res.data;
    statuses.value.unshift({ name: "" });
  });
};

const postStatus = async () => {
  newStatus.value.project_id = convertProjectNamesToIds(
    newStatus.value.project_name
  );
  newStatus.value.sort_key = statuses.value.length;
  await axios.post(statusBASE_URL, newStatus.value);
  displaySnackbar("blue", "状況を登録しました。");
  await getStatus();
};

const putStatus = async (status) => {
  if (status.name == "" || status.project_name.length == 0) {
    displaySnackbar("red", "必須項目が入力されていません。");
    return;
  }
  if (selectedWork.value.state == status.id) {
    selectedWork.value.stateName = status;
  }
  status.project_id = convertProjectNamesToIds(status.project_name);
  await axios.put(statusBASE_URL, status);
  displaySnackbar("blue", "状況を更新しました。");
  await updateRouteDisplayWork();
};

const putMultiStatus = async (items) => {
  await axios
    .put(
      statusBASE_URL + "/multi" + "?project_id=" + currentProject.value.id,
      items
    )
    .then((res) => {
      for (const data of res.data) {
        data.project_name = convertProjectIdsToNames(data.project_id);
      }
      statuses.value = res.data;
      statuses.value.unshift("");
    });
};

const deleteStatus = async (id) => {
  await axios.delete(statusBASE_URL + "?id=" + id);
};

const deleteAllStatus = async (project_id) => {
  await axios.delete(statusBASE_URL + "/all?project_id=" + project_id);
};

const convertStatusNameToId = (name) => {
  for (const status of statuses.value) {
    if (name === status.name) {
      return status.id;
    }
  }
};

const convertStatusIdToName = (id) => {
  if (id) {
    for (const status of statuses.value) {
      if (id == status.id) {
        return { name: status.name, color: status.color };
      }
    }
  }
  return { name: "", color: "" };
};

const selectedStatus = ref({});
const puttedStatus = ref({});

const selectedItem = ref({});
const puttedItem = ref({});

const sortItems = (targets) => {
  if (selectedItem.value.sort_key == puttedItem.value.sort_key) {
    return;
  }

  const usedItems = [];

  if (selectedItem.value.sort_key > puttedItem.value.sort_key) {
    for (const target of targets) {
      if (
        target.sort_key <= selectedItem.value.sort_key &&
        target.sort_key >= puttedItem.value.sort_key
      ) {
        usedItems.push(target);
      }
    }
    for (const [index, item] of Object.entries(usedItems)) {
      if (usedItems.length - 1 == Number(index)) {
        item.new_id = usedItems[0].sort_key;
        break;
      }
      item.new_id = usedItems[Number(index) + 1].sort_key;
    }
    usedItems.unshift(usedItems.pop());
  } else {
    for (const target of targets) {
      if (
        target.sort_key >= selectedItem.value.sort_key &&
        target.sort_key <= puttedItem.value.sort_key
      ) {
        usedItems.push(target);
      }
    }

    for (const [index, item] of Object.entries(usedItems)) {
      if (usedItems.length - 1 == Number(index)) {
        usedItems[0].new_id = item.sort_key;
        break;
      }
      usedItems[Number(index) + 1].new_id = item.sort_key;
    }
    usedItems.push(usedItems.shift());
  }
  return usedItems;
};

const sortStatues = async () => {
  const usedStatuses = sortItems(statuses.value);
  if (usedStatuses) await putMultiStatus(usedStatuses);
};

const getPriority = async () => {
  priorities.value = [];
  await axios.get("../../public/json/priority.json").then((res) => {
    priorities.value = res.data;
  });
};

const convertPriorityNameToId = (name) => {
  for (const priority of priorities.value) {
    if (name === priority.name) {
      return priority.id;
    }
  }
};

const convertPriorityIdToName = (id) => {
  for (const priority of priorities.value) {
    if (id === priority.id) {
      return priority.name;
    }
  }
};

const postCategory = async (id = currentProject.value.id) => {
  newCategory.value.project_id = convertProjectNamesToIds(
    newCategory.value.project_name
  );
  newCategory.value.sort_key = categories.value.length + 1;
  await axios.post(categoryBASE_URL, newCategory.value);
  await getCategory(id);
};

const getCategory = async (id = currentProject.value.id) => {
  if (!id && id != 0) {
    return;
  }
  await axios.get(categoryBASE_URL + "?project_id=" + id).then((res) => {
    for (const data of res.data) {
      data.project_name = convertProjectIdsToNames(data.project_id);
    }
    categories.value = res.data;
  });
};

const getCategoryAll = async () => {
  await axios.get(categoryBASE_URL + "/all").then((res) => {
    for (const data of res.data) {
      data.project_name = convertProjectIdsToNames(data.project_id);
    }
    categories.value = res.data;
  });
};

const putCategory = async (category) => {
  if (category.name == "" || category.project_name.length == 0) {
    displaySnackbar("red", "必須項目が入力されていません。");
    return;
  }
  category.project_id = convertProjectNamesToIds(category.project_name);
  await axios.put(categoryBASE_URL, category);
};

const putMultiCategory = async (items) => {
  await axios
    .put(
      categoryBASE_URL + "/multi" + "?project_id=" + currentProject.value.id,
      items
    )
    .then((res) => {
      for (const data of res.data) {
        data.project_name = convertProjectIdsToNames(data.project_id);
      }
      categories.value = res.data;
      categories.value.unshift("");
    });
};

const deleteCategory = async (id) => {
  await axios.delete(categoryBASE_URL + "?id=" + id);
};

const deleteAllCategory = async (project_id) => {
  await axios.delete(categoryBASE_URL + "/all?project_id=" + project_id);
};

const sortCategory = async () => {
  const usedCategory = sortItems(categories.value);
  if (usedCategory) await putMultiCategory(usedCategory);
};

const convertCategoryNameToId = (names) => {
  let ids = [];
  if (!names) {
    return [];
  }
  for (const name of names) {
    for (const category of categories.value) {
      if (name === category.name) {
        ids.push(category.id);
        break;
      }
    }
  }
  return ids;
};

const convertCategoryIdToName = (ids) => {
  let names = [];
  if (!ids) {
    return names;
  }
  for (const id of ids) {
    for (const category of categories.value) {
      if (id === category.id) {
        names.push(category.name);
        break;
      }
    }
  }
  return names;
};

const getSeDailyReportProcess = async () => {
  await axios.get(workBASE_URL + "/seDailyReportProcess").then((res) => {
    seDailyReportProcesses.value = res.data;
  });
};

const convertSeDailyReportProcessNameToId = (name) => {
  for (const seDailyReportProcess of seDailyReportProcesses.value) {
    if (name == `${seDailyReportProcess.no}.${seDailyReportProcess.name}`) {
      return seDailyReportProcess.no;
    }
  }
};

const convertSeDailyReportProcessIdToName = (no) => {
  for (const seDailyReportProcess of seDailyReportProcesses.value) {
    if (no == seDailyReportProcess.no) {
      return `${seDailyReportProcess.no}.${seDailyReportProcess.name}`;
    }
  }
};

const isChildrenWorkEditDialogOpen = ref(false);

const searchWorkConditions = ref({
  staffsName: "",
  stateName: "",
  priorityName: "",
  categoryName: "",
  word: "",
  notDisplayProgress100: false,
});

const resetSearchWorkConditions = () => {
  searchWorkConditions.value = {
    staffsName: "",
    stateName: "",
    priorityName: "",
    categoryName: "",
    word: "",
    notDisplayProgress100: false,
  };
  exceptSelectedSearchState.value = false;
};

const searchedWorks = ref([]);

const isSearched = ref(false);
const exceptSelectedSearchState = ref(false);
const search = () => {
  isSearched.value = true;
  searchedWorks.value = [];
  const useSearchWorkConditions = [];
  let judge = false;

  if (
    !searchWorkConditions.value.stateName &&
    !searchWorkConditions.value.priorityName &&
    !searchWorkConditions.value.categoryName &&
    !searchWorkConditions.value.staffsName &&
    !searchWorkConditions.value.word &&
    !searchWorkConditions.value.notDisplayProgress100
  ) {
    isSearched.value = false;
    searchedWorks.value = works.value.concat();
    return;
  } else {
    for (const key in searchWorkConditions.value) {
      if (searchWorkConditions.value[key]) {
        useSearchWorkConditions.push(key);
      }
    }
  }
  for (const work of works.value) {
    judge = false;
    for (const key of useSearchWorkConditions) {
      if (
        key == "notDisplayProgress100" &&
        searchWorkConditions.value.notDisplayProgress100
      ) {
        if (Number(work.progress) < 100) {
          judge = true;
        } else {
          judge = false;
          break;
        }
      } else if (key == "staffsName") {
        let judgeStaff = false;
        for (const staff of work[key]) {
          if (searchWorkConditions.value[key] === staff) {
            judgeStaff = true;
            break;
          }
        }
        if (judgeStaff) {
          judge = true;
        } else {
          judge = false;
          break;
        }
      } else if (key == "categoryName") {
        let judgeCategory = false;
        for (const category of work.categoryName) {
          if (searchWorkConditions.value[key] === category) {
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
      } else if (key == "stateName") {
        if (exceptSelectedSearchState.value) {
          if (searchWorkConditions.value[key] != work[key].name) {
            judge = true;
          } else {
            judge = false;
            break;
          }
        } else {
          if (searchWorkConditions.value[key] == work[key].name) {
            judge = true;
          } else {
            judge = false;
            break;
          }
        }
      } else if (key == "word") {
        let judgeWord = false;
        for (const workKey in work) {
          let text = String(work[workKey]);
          if (text.includes(searchWorkConditions.value[key])) {
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
      } else {
        if (searchWorkConditions.value[key] === work[key]) {
          judge = true;
        } else {
          judge = false;
          break;
        }
      }
    }
    if (judge) {
      searchedWorks.value.push(work);
    }
  }
};

const searchRecentWorksWithWord = () => {
  let be = false;
  if (searchProjectCondition.value["word"]) {
    for (const [index, work] of Object.entries(showRecentUpdateWorks.value)) {
      be = false;
      for (const workKey in work) {
        let text = String(work[workKey]);
        if (text.includes(searchProjectCondition.value["word"])) {
          be = true;
          showRecentUpdateWorks.value.push(work);
          break;
        }
      }
      if (!be) {
        showRecentUpdateWorks.value.splice(index);
      }
    }
  }
};

const comment = ref({
  user: "",
  icon: "",
  content: "",
  registration_date: "",
});
const resetComment = () => {
  comment.value = {
    user: "",
    icon: "",
    content: "",
    registration_date: "",
  };
};
const importExcel = async () => {
  const excelFileInfo = await postFiles(false);
  await axios.post(workBASE_URL + "/importExcel", [
    {
      fileInfo: excelFileInfo,
      statuses: statuses.value,
      users: projectUsers.value,
      priorities: priorities.value,
      categories: categories.value,
      seDailyReportProcesses: seDailyReportProcesses.value,
      projectID: currentProject.value.id,
    },
  ]);
  await getWork();
};
const outputExcelChoices = async () => {
  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet("取り込み対象");
  workbook.addWorksheet("Table");
  const mainWorksheet = workbook.getWorksheet("取り込み対象");
  const worksheet = workbook.getWorksheet("Table");

  // 最大行数を求める
  const statusesCount = statuses.value.length - 1;
  const projectUsersCount = projectUsers.value.length;
  const prioritiesCount = priorities.value.length - 1;
  const categoriesCount = categories.value.length;
  const se_daily_report_process_count = seDailyReportProcesses.value.length;
  const maxRowsCount = Math.max(
    statusesCount,
    projectUsersCount,
    prioritiesCount,
    categoriesCount,
    se_daily_report_process_count
  );

  // Tableシート作成
  worksheet.columns = [
    { header: "状況", key: "status", width: 15 },
    { header: "担当者", key: "user", width: 15 },
    { header: "優先度", key: "priority", width: 15 },
    { header: "カテゴリー", key: "category", width: 15 },
    { header: "SE日報", key: "se_daily_report_process", width: 15 },
  ];
  // 行の定義
  for (let i = 0; i < maxRowsCount; i++) {
    let status = i < statusesCount ? statuses.value.slice(1)[i].name : "";
    let user = i < projectUsersCount ? projectUsers.value[i].name : "";
    let priority = i < prioritiesCount ? priorities.value.slice(1)[i].name : "";
    let category = i < categoriesCount ? categories.value[i].name : "";
    let se_daily_report_process =
      i < se_daily_report_process_count
        ? seDailyReportProcesses.value[i].name
        : "";

    worksheet.addRow({
      status: status,
      user: user,
      priority: priority,
      category: category,
      se_daily_report_process: se_daily_report_process,
    });
  }

  // メインシート作成
  // 列の定義
  mainWorksheet.columns = [
    { header: "タイトル *", key: "title", width: 45 },
    { header: "詳細", key: "detail", width: 45 },
    { header: "状況", key: "status", width: 15 },
    { header: "担当者", key: "user", width: 15 },
    { header: "優先度", key: "priority", width: 15 },
    { header: "SE日報工程", key: "se_daily_report_process", width: 15 },
    { header: "カテゴリー", key: "category", width: 15 },
    { header: "バージョン", key: "version", width: 15 },
    { header: "開始日(yyyy-mm-dd)", key: "from", width: 20 },
    { header: "終了日(yyyy-mm-dd)", key: "to", width: 20 },
    { header: "設計担当者", key: "designer", width: 15 },
    { header: "開発担当者", key: "developer", width: 15 },
    { header: "検証担当者", key: "verifier", width: 15 },
  ];

  // ヴァリデーション設定値を返す
  const makeValidationSetting = (column, maxRow) => {
    return {
      type: "list",
      showDropDown: true, // ドロップダウンリストを表示する
      allowBlank: true,
      //formulae: ["'" + names + "'"],
      formulae: ["Table!$" + column + "$2" + ":$" + column + "$" + maxRow],
    };
  };
  /** ヘッダ行の背景色 */
  const headerFillStyle = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "2196f3" },
  };
  const borderStyle = {
    top: { style: "thin" }, // 上部の罫線
    left: { style: "thin" }, // 左側の罫線
    bottom: { style: "thin" }, // 下部の罫線
    right: { style: "thin" }, // 右側の罫線
  };

  for (let i = 0; i < 100; i++) {
    mainWorksheet.addRow({
      title: "",
      detail: "",
      status: "",
      user: "",
      priority: "",
      se_daily_report_process: "",
      category: "",
      version: "",
      from: "",
      to: "",
      designer: "",
      developer: "",
      verifier: "",
    });
  }
  mainWorksheet.spliceRows(1, 0, [currentProject.value.title]); // 空白行を追加
  mainWorksheet.eachRow((row, rowNumber) => {
    // すべてのセルを走査
    row.eachCell((cell, colNumber) => {
      if (rowNumber == 1) {
        cell.font = { size: 16 };
      } else if (rowNumber == 2) {
        // ヘッダ行のスタイルを設定
        cell.fill = headerFillStyle;
        cell.font = {
          color: { argb: "FFFFFF" },
        };
        cell.border = borderStyle;
      } else {
        cell.border = borderStyle;

        if (colNumber == 3) {
          cell.dataValidation = makeValidationSetting(
            "A",
            String(statusesCount + 1)
          );
        } else if (
          colNumber == 4 ||
          colNumber == 11 ||
          colNumber == 12 ||
          colNumber == 13
        ) {
          cell.dataValidation = makeValidationSetting(
            "B",
            String(projectUsersCount + 1)
          );
        } else if (colNumber == 5) {
          cell.dataValidation = makeValidationSetting(
            "C",
            String(prioritiesCount + 1)
          );
        } else if (colNumber == 6) {
          cell.dataValidation = makeValidationSetting(
            "E",
            String(se_daily_report_process_count + 1)
          );
        } else if (colNumber == 7) {
          cell.dataValidation = makeValidationSetting(
            "D",
            String(categoriesCount + 1)
          );
        } else if (colNumber == 9 || colNumber == 10) {
          // セルの書式設定を文字列型に設定
          cell.style = {
            numFmt: "@", // '@'は文字列型を表す書式コードです
            border: borderStyle,
          };
        }
      }
    });
    // 行の設定を適用
    row.commit();
  });

  const uint8Array = await workbook.xlsx.writeBuffer();
  const blob = new Blob([uint8Array], { type: "application/octet-binary" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TeamSync「${currentProject.value.title}」取り込みテンプレート.xlsx`;
  a.click();
  a.remove();
};

const template = ref({
  id: 0,
  project_id: [],
  project_name: [],
  name: "",
  title: "",
  detail: "",
});
const templates = ref([]);
const resetTemplate = () => {
  template.value = {
    id: 0,
    project_id: [],
    project_name: [],
    name: "",
    title: "",
    detail: "",
  };
};
const selectedTemplateName = ref("");

const postTemplate = async () => {
  await axios.post(templateBASE_URL, template.value);
};
const putTemplate = async () => {
  await axios.put(templateBASE_URL, template.value);
};
const getTemplate = async (project_id = selectedWork.value.project) => {
  await axios
    .get(templateBASE_URL + "?project_id=" + project_id)
    .then((res) => {
      for (const data of res.data) {
        data.project_name = convertProjectIdsToNames(data.project_id);
      }
      templates.value = res.data;
      templates.value.unshift({
        id: 0,
        project_id: [],
        project_name: [],
        name: "",
        title: "",
        detail: "",
      });
    });
};
const deleteTemplate = async (id) => {
  await axios.delete(templateBASE_URL + "?id=" + id);
};

const deleteTemplateWithProjectId = async (project_id) => {
  await axios.delete(templateBASE_URL + "/project?project_id=" + project_id);
};

const recentUpdateWorks = ref([]);
const showRecentUpdateWorks = ref([]);
const getRecentUpdateWorks = async (isGetStatus = true) => {
  getParticipatingProjectIds(searchedProjects.value);
  if (participatingProjectIds.value.length == 0) return;
  await axios
    .get(
      workBASE_URL +
        "/projectIds" +
        "?projectIds=" +
        participatingProjectIds.value.join()
    )
    .then(async (res) => {
      if (res.data.length == 0) {
        return;
      }
      if (isGetStatus) {
        await getStatusAll();
      }
      await getDepartments();
      await getCategoryAll();
      await getSeDailyReportProcess();
      await getPriority();
      await getUser(0);
      for (let work of res.data) {
        work = convertWork(work);
      }
      recentUpdateWorks.value = res.data;
      searchUpdateWorks();
      works.value = res.data;
    });
};

const pushMyself = () => {
  if (!editWork.value.staffsName.includes(userInfo.value.name))
    editWork.value.staffsName.push(userInfo.value.name);
};
const workTab = ref("recent");
const searchUpdateWorks = () => {
  if (workTab.value == "myWork") {
    showRecentUpdateWorks.value = [];
    for (const work of recentUpdateWorks.value.concat()) {
      if (
        work.staffs.includes(userInfo.value.id) &&
        work.progress != 100 &&
        work.stateName.name != "完了"
      ) {
        showRecentUpdateWorks.value.push(work);
      }
    }

    showRecentUpdateWorks.value.sort((a, b) => {
      //オブジェクトの値を比較。
      if (!a.to || !b.to) {
        return b.to > a.to ? 1 : -1;
      }
      return a.to > b.to ? 1 : -1;
    });
    showRecentUpdateWorks.value.sort((a, b) => {
      //オブジェクトの値を比較。
      if (b.priority == 1 || !b.priority || a.priority == 1 || !a.priority) {
        return b.priority - a.priority;
      }
      return a.priority - b.priority;
    });
  } else {
    showRecentUpdateWorks.value = recentUpdateWorks.value.concat();
  }
  searchRecentWorksWithWord();
};

const correspondenceWorkIdAndName = {
  title: "タイトル",
  detail: "詳細",
  state: "状況",
  stateName: "状況",
  staffs: "担当者",
  staffsName: "担当者",
  priority: "優先度",
  priorityName: "優先度",
  category: "カテゴリー",
  categoryName: "カテゴリー",
  version: "バージョン",
  from: "開始日",
  to: "終了日",
  estimate_time: "予定時間",
  actual_time: "実績時間",
  progress: "進捗度",
  seDailyReportProcessName: "SE日報工程",
  children_title: "子課題タイトル",
};

const displayedChars = (char, num) => {
  if (char == null) return " ";
  if (char.length > num) return char.substring(0, num) + "...";
  return char;
};
const previousWork = ref({});
const commentDifferenceWork = () => {
  resetComment();
  comment.value.content = "【変更内容】";
  let content;
  for (const key in editedWork.value) {
    if (
      key == "id" ||
      key == "work_id" ||
      key == "project" ||
      key == "se_daily_report_process" ||
      key == "registration_date" ||
      key == "update_date" ||
      key == "staffs" ||
      key == "priority" ||
      key == "category" ||
      key == "state" ||
      key == "comment" ||
      key == "todo" ||
      key == "gross_estimate_time" ||
      key == "gross_actual_time" ||
      key == "gross_progress" ||
      key == "files"
    )
      continue;
    if (previousWork.value[key] != editedWork.value[key]) {
      if (key == "categoryName" || key == "staffsName") {
        content =
          correspondenceWorkIdAndName[key] +
          " : " +
          displayedChars(convertArrayToText(previousWork.value[key]), 15) +
          " → " +
          displayedChars(convertArrayToText(editedWork.value[key]), 15);
        comment.value.content += `\n` + content.replaceAll(`\n`, " ");
      } else {
        content =
          correspondenceWorkIdAndName[key] +
          " : " +
          displayedChars(previousWork.value[key], 15) +
          " → " +
          displayedChars(editedWork.value[key], 15);
        comment.value.content += `\n` + content.replaceAll(`\n`, " ");
      }
    }
  }
  if (comment.value.content != "【変更内容】") {
    comment.value.user = userInfo.value.name;
    comment.value.icon = userInfo.value.icon;
    comment.value.registration_date = getCurrentDateTime();
    editedWork.value.comment.unshift(comment.value);
  }
};

const commentDifferenceChildrenWork = () => {
  resetComment();
  comment.value.content = `【子課題(${editChildrenWork.value.title})変更内容】`;
  let content;
  for (const key in editChildrenWork.value) {
    if (
      key == "registration_date" ||
      key == "update_date" ||
      key == "staffs" ||
      key == "priority"
    )
      continue;
    if (selectedChildrenWork.value[key] != editChildrenWork.value[key]) {
      content =
        correspondenceWorkIdAndName[key] +
        " : " +
        displayedChars(selectedChildrenWork.value[key], 15) +
        " → " +
        displayedChars(editChildrenWork.value[key], 15);
      comment.value.content += `\n` + content.replaceAll(`\n`, " ");
    }
  }
  if (
    comment.value.content !=
    `【子課題(${editChildrenWork.value.title})変更内容】`
  ) {
    comment.value.user = userInfo.value.name;
    comment.value.icon = userInfo.value.icon;
    comment.value.registration_date = getCurrentDateTime();
    selectedWork.value.comment.unshift(comment.value);
  }
};

// 課題をエクセル化--------------------------------------------
const createExcel = async () => {
  // Excelの作成
  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet(`「${currentProject.value.title}」一覧`);
  const worksheet = workbook.getWorksheet(
    `「${currentProject.value.title}」一覧`
  );

  // 列の定義
  worksheet.columns = [
    { header: "ID", key: "id" },
    { header: "タイトル", key: "title", width: 45 },
    { header: "詳細", key: "detail", width: 45 },
    { header: "状態", key: "state", width: 15 },
    { header: "担当者", key: "staffs", width: 20 },
    { header: "優先度", key: "priority", width: 8 },
    { header: "カテゴリー", key: "category", width: 20 },
    { header: "バージョン", key: "version", width: 10 },
    { header: "開始日", key: "from", width: 15 },
    { header: "終了日", key: "to", width: 15 },
    { header: "予定時間", key: "estimate_time", width: 12 },
    { header: "実績時間", key: "actual_time", width: 12 },
    { header: "進捗度", key: "progress", width: 10 },
    { header: "更新日", key: "update_date", width: 20 },
    { header: "登録日", key: "registration_date", width: 20 },
  ];
  let title = "";
  // 行の定義
  for (let work of works.value) {
    if (work.title) {
      if (work.children_title) {
        title = `【${work.children_title}】${work.title}`;
      } else {
        title = work.title;
      }
    }
    worksheet.addRow({
      id: work.id,
      title: title,
      detail: work.detail ? work.detail : "",
      state: work.stateName.name ? work.stateName.name : "",
      staffs: work.staffsName ? convertArrayToText(work.staffsName) : "",
      priority: work.priorityName ? work.priorityName : "",
      category: work.categoryName ? convertArrayToText(work.categoryName) : "",
      version: work.version ? work.version : "",
      from: work.from ? work.from : "",
      to: work.to ? work.to : "",
      estimate_time: work.estimate_time ? work.estimate_time : "",
      actual_time: work.actual_time ? work.actual_time : "",
      progress: work.progress ? work.progress : "",
      update_date: work.update_date ? work.update_date : "",
      registration_date: work.registration_date ? work.registration_date : "",
    });
  }

  /** ヘッダ行の背景色 */
  const headerFillStyle = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "2196f3" },
  };
  const borderStyle = {
    top: { style: "thin" }, // 上部の罫線
    left: { style: "thin" }, // 左側の罫線
    bottom: { style: "thin" }, // 下部の罫線
    right: { style: "thin" }, // 右側の罫線
  };

  worksheet.spliceRows(1, 0, [currentProject.value.title]); // 空白行を追加
  worksheet.eachRow((row, rowNumber) => {
    // すべてのセルを走査
    row.eachCell((cell, colNumber) => {
      if (rowNumber == 1) {
        cell.font = { size: 16 };
      } else if (rowNumber == 2) {
        // ヘッダ行のスタイルを設定
        cell.fill = headerFillStyle;
        cell.font = {
          color: { argb: "FFFFFF" },
        };
        cell.border = borderStyle;
      } else {
        cell.border = borderStyle;
      }
    });
    // 行の設定を適用
    row.commit();
  });

  const uint8Array = await workbook.xlsx.writeBuffer();
  const blob = new Blob([uint8Array], { type: "application/octet-binary" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TeamSync「${currentProject.value.title}」一覧.xlsx`;
  a.click();
  a.remove();
};

const setWork = (targetWork, referenceWork) => {
  for (const key of Object.keys(targetWork)) {
    if (referenceWork[key] && Array.isArray(referenceWork[key])) {
      targetWork[key] = referenceWork[key];
    } else if (referenceWork[key] && typeof referenceWork[key] === "object") {
      targetWork[key] = Object.assign({}, referenceWork[key]);
    } else if (referenceWork[key]) {
      targetWork[key] = referenceWork[key];
    }
  }
  return targetWork;
};

const getLink = (
  url = `${baseURL}/TeamSync/?work_id=${selectedWork.value.id}`
) => {
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
    copyTextFallback(url);
    displaySnackbar("grey", "URLをクリップボードにコピーしました");
    return;
  }
  // https環境で動作するコード
  navigator.clipboard.writeText(url);
  displaySnackbar("grey", "URLをクリップボードにコピーしました");
};

export {
  workRegistrationDialog,
  isWorkDetailsDialogOpen,
  works,
  editWork,
  editedWork,
  selectedWork,
  selectedChildrenWork,
  cmbChildrenWorks,
  childrenWorks,
  isChildrenWorkEditDialogOpen,
  isStatusRegistrationDialog,
  newStatus,
  statuses,
  priorities,
  newCategory,
  categories,
  isCategoryRegistrationDialog,
  searchWorkConditions,
  searchedWorks,
  isSearched,
  comment,
  editChildrenWork,
  editedChildrenWork,
  selectedStatus,
  puttedStatus,
  template,
  templates,
  selectedTemplateName,
  isTemplateRegistrationDialog,
  recentUpdateWorks,
  previousChildrenWorkEstimateTime,
  previousChildrenWorkActualTime,
  previousChildrenWorkStaffs,
  previousChildrenWorkProgress,
  selectedItem,
  puttedItem,
  seDailyReportProcesses,
  previousWork,
  showRecentUpdateWorks,
  parentWork,
  exceptSelectedSearchState,
  workTab,
  getSeDailyReportProcess,
  putWorkComment,
  getChildrenWork,
  resetChildrenWork,
  postWork,
  putWork,
  resetWork,
  getWork,
  postChildrenWork,
  putChildrenWork,
  getWorkWithId,
  getStatus,
  postStatus,
  getPriority,
  convertPriorityNameToId,
  postCategory,
  getCategory,
  convertCategoryNameToId,
  convertCategoryIdToName,
  convertStatusNameToId,
  deleteChildrenWork,
  deleteWork,
  deleteParentChildrenWork,
  search,
  resetComment,
  resetSearchWorkConditions,
  deleteAllStatus,
  deleteAllCategory,
  deleteStatus,
  deleteCategory,
  sortStatues,
  importExcel,
  outputExcelChoices,
  postTemplate,
  getTemplate,
  resetTemplate,
  deleteTemplate,
  getRecentUpdateWorks,
  commentDifferenceWork,
  commentDifferenceChildrenWork,
  createExcel,
  openDetailsModal,
  putStatus,
  sortCategory,
  putCategory,
  putWorkFiles,
  convertSeDailyReportProcessNameToId,
  convertSeDailyReportProcessIdToName,
  resetEditedWork,
  updateParentWorkByChildrenWork,
  getParentWork,
  deleteTemplateWithProjectId,
  convertStatusIdToName,
  convertIdToUserName,
  convertPriorityIdToName,
  getStatusAll,
  getCategoryAll,
  deadlineIsPasted,
  setWork,
  postOnlyWorkProgressAndTime,
  getLink,
  searchUpdateWorks,
  pushMyself,
  putTemplate,
  searchRecentWorksWithWord,
  putParentWorkProgressAndTime,
};

import { ref } from "vue";
import axios from "axios";
import {
  works,
  deleteWork,
  deleteParentChildrenWork,
  deleteTemplateWithProjectId,
  deleteAllCategory,
  deleteAllStatus,
  getWork,
  getRecentUpdateWorks,
} from "./work.js";
import { userInfo } from "./user.js";

const projectBASE_URL = "http://localhost:3000/project";
const isProjectRegistrationDialogOpen = ref(false);

const currentProject = ref({
  id: 0,
  title: "",
  detail: "",
  state: "",
  state_name: { name: "", color: "" },
  staff_ids: [],
  from: "",
  to: "",
  estimate_time: null,
  actual_time: null,
  progress: null,
  project_no: "",
});
const currentProjectUserIds = ref([]);

const selectedProject = ref({
  id: 0,
  title: "",
  detail: "",
  state: "",
  state_name: { name: "", color: "" },
  staff_ids: [],
  from: "",
  to: "",
  estimate_time: 0,
  actual_time: 0,
  progress: 0,
  project_no: "",
});
const editProject = ref({
  id: 0,
  title: "",
  detail: "",
  state: "",
  state_name: { name: "", color: "" },
  staff_ids: [],
  from: "",
  to: "",
  estimate_time: 0,
  actual_time: 0,
  progress: 0,
  project_no: "",
});
const editedProject = ref({
  id: 0,
  title: "",
  detail: "",
  state: "",
  state_name: { name: "", color: "" },
  staff_ids: [],
  from: "",
  to: "",
  estimate_time: 0,
  actual_time: 0,
  progress: 0,
  project_no: "",
});

const resetProject = () => {
  editProject.value = {
    id: 0,
    title: "",
    detail: "",
    state: "",
    state_name: { name: "", color: "" },
    staff_ids: [],
    from: "",
    to: "",
    estimate_time: 0,
    actual_time: 0,
    progress: 0,
    project_no: "",
  };
  editedProject.value = {
    id: 0,
    title: "",
    detail: "",
    state: "",
    state_name: { name: "", color: "" },
    staff_ids: [],
    from: "",
    to: "",
    estimate_time: 0,
    actual_time: 0,
    progress: 0,
    project_no: "",
  };

  selectedProject.value = {
    id: 0,
    title: "",
    detail: "",
    state: "",
    state_name: { name: "", color: "" },
    staff_ids: [],
    from: "",
    to: "",
    estimate_time: 0,
    actual_time: 0,
    progress: 0,
    project_no: "",
  };

  currentProjectUserIds.value = [];
};

const projects = ref([]);

const projectStatus = ref([]);

const getProject = async (id) => {
  if (id) {
    await axios.get(projectBASE_URL + "?user_id=" + id).then((res) => {
      for (const project of res.data) {
        project.state_name = convertIdToProjectStatusName(project.state);
      }
      projects.value = res.data;
      searchedProjects.value = res.data;
    });
  }
};

const getProjectAll = async () => {
  await axios.get(projectBASE_URL + "/all").then((res) => {
    projects.value = res.data;
  });
};

const getLocalProject = (id) => {
  if (id) {
    for (const project of projects.value) {
      if (project.id == id) {
        return project;
      }
    }
  }
};

const postProject = async () => {
  await axios.post(projectBASE_URL, editedProject.value);
};

const putProject = async () => {
  await axios.put(projectBASE_URL, editedProject.value);
};

const deleteProject = async (id) => {
  await axios.delete(projectBASE_URL + "?id=" + id);
  // await deleteAllCategory(id);
  // await deleteAllStatus(id);
  // await deleteTemplateWithProjectId(id);
  await getWork(id);
  for (const work of works.value) {
    await deleteWork(work.id);
  }
  await getRecentUpdateWorks();
};

const getProjectStatus = async () => {
  await axios.get("../../public/json/projectStatus.json").then((res) => {
    projectStatus.value = res.data;
  });
};

const convertProjectIdToName = (id) => {
  for (const item of projects.value) {
    if (id === item.id) {
      return item.title;
    }
  }
};

const convertProjectNameToId = (name) => {
  for (const item of projects.value) {
    if (name === item.title) {
      return item.id;
    }
  }
};

const convertProjectNamesToIds = (names) => {
  let ids = [];
  if (!names) {
    return [];
  }
  for (const name of names) {
    for (const project of projects.value) {
      if (name === project.title) {
        ids.push(project.id);
        break;
      }
    }
  }
  return ids;
};

const convertProjectIdsToNames = (ids) => {
  let names = [];
  if (!ids) {
    return [];
  }
  for (const id of ids) {
    for (const project of projects.value) {
      if (id === project.id) {
        names.push(project.title);
        break;
      }
    }
  }
  return names;
};

const convertProjectNameToProjectNo = (name) => {
  for (const item of projects.value) {
    if (name === `${item.title}(${item.project_no})`) {
      return item.project_no;
    }
  }
};
const convertProjectProjectNoToName = (no) => {
  for (const item of projects.value) {
    if (no == item.project_no) {
      return `${item.title}(${item.project_no})`;
    }
  }
};

const convertProjectStatusNameToId = (name) => {
  for (const item of projectStatus.value) {
    if (name === item.name) {
      return item.id;
    }
  }
};
const convertIdToProjectStatusName = (id) => {
  if (!id) {
    return "";
  }
  for (const item of projectStatus.value) {
    if (id == item.id) {
      return { name: item.name, color: item.color };
    }
  }
};

const searchedProjects = ref([]);
const searchProjectCondition = ref({
  state: "",
  word: "",
});
const isSearchedProject = ref(false);
const searchProject = () => {
  isSearchedProject.value = true;
  searchedProjects.value = [];
  const useSearchWorkConditions = [];
  let judge = false;
  if (
    !searchProjectCondition.value.state &&
    !searchProjectCondition.value.word
  ) {
    isSearchedProject.value = false;
    searchedProjects.value = projects.value.concat();
    return;
  } else {
    for (const key in searchProjectCondition.value) {
      if (searchProjectCondition.value[key]) {
        useSearchWorkConditions.push(key);
      }
    }
  }
  for (const project of projects.value) {
    judge = false;
    for (const key of useSearchWorkConditions) {
      if (key == "state") {
        if (
          searchProjectCondition.value.state == "完了以外" &&
          project.state_name.name != "完了"
        ) {
          judge = true;
        } else if (
          searchProjectCondition.value.state == project.state_name.name
        ) {
          judge = true;
        }
      } else if (key == "word") {
        let judgeWord = false;
        for (const projectKey in project) {
          let text;
          if (projectKey == "state_name") {
            text = String(project[projectKey].name);
          } else {
            text = String(project[projectKey]);
          }
          if (text.includes(searchProjectCondition.value[key])) {
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
      searchedProjects.value.push(project);
    }
  }
};
const resetSearchProjectCondition = () => {
  searchProjectCondition.value = {
    state: "",
    word: "",
  };
};

let participatingProjectIds = ref([]);
const getParticipatingProjectIds = (projects) => {
  participatingProjectIds.value = [];
  for (const project of projects) {
    if (project.staff_ids.includes(userInfo.value.id)) {
      participatingProjectIds.value.push(project.id);
    }
  }
};

export {
  currentProject,
  editProject,
  editedProject,
  projects,
  isProjectRegistrationDialogOpen,
  currentProjectUserIds,
  projectStatus,
  searchProjectCondition,
  searchedProjects,
  isSearchedProject,
  selectedProject,
  participatingProjectIds,
  searchProject,
  resetProject,
  getProject,
  postProject,
  putProject,
  getProjectStatus,
  convertProjectStatusNameToId,
  convertIdToProjectStatusName,
  convertProjectIdToName,
  deleteProject,
  resetSearchProjectCondition,
  getParticipatingProjectIds,
  getProjectAll,
  getLocalProject,
  convertProjectNameToProjectNo,
  convertProjectProjectNoToName,
  convertProjectNameToId,
  convertProjectNamesToIds,
  convertProjectIdsToNames,
};

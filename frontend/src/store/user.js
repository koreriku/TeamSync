import { ref } from "vue";
import axios from "axios";
import { currentProjectUserIds } from "./project.js";
import { newAttachedFiles, postFiles, deleteFile } from "./common.js";
import router from "../router/router.js";

// 部署
const userBASE_URL = "http://localhost:3000/user";
const boardBASE_URL = "http://localhost:3000/board";

axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  responseType: "json",
});

const isOpenUserMemoDialog = ref(false);

const inputUserInfo = ref({
  id: 0,
  name: "",
  birthday: "",
  email: "",
  password: "",
  icon: "",
  todo: [],
  memo: "",
  display_todo: [],
  employee_no: 0,
});

const userInfo = ref({
  id: 0,
  name: "",
  birthday: "",
  email: "",
  password: "",
  icon: "",
  todo: [],
  memo: "",
  display_todo: [],
  employee_no: 0,
});

const users = ref([]);
const projectUsers = ref([]);

const getUser = async (id) => {
  await axios.get(userBASE_URL + "?id=" + id).then((res) => {
    if (id == 0) {
      users.value = res.data;
    } else {
      projectUsers.value.push(res.data[0]);
    }
  });
};

const postUser = async () => {
  if (newAttachedFiles.value.length > 0) {
    const file = await postFiles();
    inputUserInfo.value.icon = file[0].name;
  }
  await axios.post(userBASE_URL, inputUserInfo.value).then((res) => {
    userInfo.value = res.data[0];
    localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
  });
};

const previousFileName = ref("");
const putUser = async () => {
  if (newAttachedFiles.value.length > 0) {
    const file = await postFiles();
    inputUserInfo.value.icon = file[0].name;
    if (previousFileName.value) {
      deleteFile(previousFileName.value);
    }
  }
  await axios.put(userBASE_URL, inputUserInfo.value).then((res) => {
    userInfo.value = res.data[0];
    localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
  });
};

const notLoginAlert = ref(false);
const confirmUser = async () => {
  await axios
    .get(userBASE_URL + "/confirm", { params: inputUserInfo.value })
    .then((res) => {
      if (res.data.length > 0) {
        userInfo.value = res.data[0];
        localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
        router.push("/");
        return true;
      } else {
        notLoginAlert.value = true;
        return false;
      }
    });
};

const convertOnlyUserNameToId = (userName) => {
  if (!userName) {
    return;
  }
  for (const user of users.value) {
    if (user.name === userName) {
      return user.id;
    }
  }
};

const convertOnlyIdToUserName = (id) => {
  if (!id) {
    return;
  }
  for (const user of users.value) {
    if (user.id === id) {
      return user.name;
    }
  }
};

const convertUserNameToId = (userNames) => {
  let userIds = [];
  if (!userNames) {
    return userIds;
  }
  for (const userName of userNames) {
    for (const user of users.value) {
      if (user.name === userName) {
        userIds.push(user.id);
        break;
      }
    }
  }
  return userIds;
};
const convertIdToUserName = (userIds) => {
  let userNames = [];
  if (!userIds) {
    return userNames;
  }
  for (const id of userIds) {
    for (const user of users.value) {
      if (user.id === id) {
        userNames.push(user.name);
        break;
      }
    }
  }
  return userNames;
};

const convertSingleIdToUserName = (userId) => {
  if (!userId) {
    return;
  }
  for (const user of projectUsers.value) {
    if (user.id === userId) {
      return user.name;
    }
  }
};

const getProjectUsers = (userIds) => {
  projectUsers.value = [];
  for (const user of users.value) {
    if (userIds.includes(user.id)) {
      projectUsers.value.push(user);
    }
  }
};

const addTodo = async (id, isTodo) => {
  inputUserInfo.value = userInfo.value;
  if (isTodo) {
    inputUserInfo.value.todo.unshift(id);
  } else {
    let index = inputUserInfo.value.todo.indexOf(id);
    inputUserInfo.value.todo.splice(index, 1);
  }
  await putUser();
};

const boardContent = ref({
  id: 0,
  content: "",
});
const getBoard = async (id) => {
  await axios.get(boardBASE_URL + "?id=" + id).then((res) => {
    boardContent.value = res.data[0];
  });
};
const updateBoard = async () => {
  await axios.put(boardBASE_URL, boardContent.value).then((res) => {
    boardContent.value = res.data[0];
  });
};

const addIconBasedOnUserId = (users_id, targetItems = projectUsers.value) => {
  const result = [];
  for (const user of targetItems) {
    for (const id of users_id) {
      if (user.id == id) {
        result.push({
          name: user.name,
          icon: user.icon,
        });
        break;
      }
    }
  }
  return result;
};

const searchOnlyUser = (id) => {
  for (const user of users.value) {
    if (user.id == id) {
      return user;
    }
  }
};

export {
  users,
  projectUsers,
  userInfo,
  inputUserInfo,
  isOpenUserMemoDialog,
  previousFileName,
  notLoginAlert,
  boardContent,
  getBoard,
  updateBoard,
  getUser,
  postUser,
  putUser,
  confirmUser,
  convertUserNameToId,
  convertIdToUserName,
  convertSingleIdToUserName,
  getProjectUsers,
  addTodo,
  addIconBasedOnUserId,
  convertOnlyUserNameToId,
  convertOnlyIdToUserName,
  searchOnlyUser,
};

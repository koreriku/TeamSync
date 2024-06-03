import { ref } from "vue";
import axios from "axios";
import { userInfo } from "./user.js";

const notificationBASE_URL = "http://localhost:3000/notification";
const notifications = ref([]);

const editNotification = ref({
  title: "",
  detail: "",
  work_id: "",
  user_id: "",
  is_read: false,
  registration_date: "",
});

const setEditNotification = (
  title,
  detail,
  work_id,
  user_id,
  is_read,
  registration_date
) => {
  editNotification.value.title = title;
  editNotification.value.detail = detail;
  editNotification.value.work_id = work_id;
  editNotification.value.user_id = user_id;
  editNotification.value.is_read = is_read;
  editNotification.value.registration_date = registration_date;
};

const addNotification = async () => {
  await axios.post(notificationBASE_URL, editNotification.value);
};

const addNormalNotification = async () => {
  await axios.post(notificationBASE_URL + "/normal", editNotification.value);
};

const getNotification = async (userId = userInfo.value.id) => {
  await axios.get(notificationBASE_URL + "?userId=" + userId).then((res) => {
    notifications.value = res.data;
  });
  getNotificationsCount();
};

const putNotificationIsRead = async (id) => {
  await axios.put(notificationBASE_URL + "/is_read", { id: id });
};

const deleteNotification = async () => {
  await axios.delete(notificationBASE_URL);
};

const deleteNotificationWithWorkID = async (work_id) => {
  await axios.delete(notificationBASE_URL + `/work?work_id=${work_id}`);
};

const notificationsCount = ref();
const getNotificationsCount = () => {
  notificationsCount.value = notifications.value.filter(
    (item) => !item.is_read
  ).length;
};
export {
  notifications,
  editNotification,
  notificationsCount,
  setEditNotification,
  addNotification,
  getNotification,
  putNotificationIsRead,
  addNormalNotification,
  deleteNotification,
  deleteNotificationWithWorkID,
};

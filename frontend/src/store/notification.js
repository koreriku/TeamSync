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
  is_wiki: false,
});

const setEditNotification = (
  title,
  detail,
  work_id,
  user_id,
  is_read,
  registration_date,
  is_wiki
) => {
  editNotification.value.title = title;
  editNotification.value.detail = detail;
  editNotification.value.work_id = work_id;
  editNotification.value.user_id = user_id;
  editNotification.value.is_read = is_read;
  editNotification.value.registration_date = registration_date;
  editNotification.value.is_wiki = is_wiki;
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

const deleteNotificationWithWorkID = async (work_id, is_wiki) => {
  await axios.delete(
    notificationBASE_URL + `/work?work_id=${work_id}&is_wiki=${is_wiki}`
  );
};

const notificationsCount = ref();
const getNotificationsCount = () => {
  if (notifications.value.length > 0) {
    notificationsCount.value = notifications.value.filter(
      (item) => !item.is_read
    ).length;
  } else {
    notificationsCount.value = 0;
  }
};

const regularNotification = async () => {
  if (userInfo.value.id) {
    await axios
      .get(notificationBASE_URL + "?userId=" + userInfo.value.id)
      .then((items) => {
        notifications.value = items.data;
        getNotificationsCount();
        // items.forEach(async (item) => {
        //   if (!item.is_noticed) {
        //     new window.Notification("TeamSync通知", {
        //       body: item.title,
        //       icon: "../../public/typescript.png",
        //     }).onclick = async () => {
        //       window.location.href = `http://svlv2905a/TeamSync/?work_id=${item.work_id}`;
        //       // window.location.href = `http://localhost:5173/TeamSync/?work_id=${item.work_id}`;
        //       await axios.put(notificationBASE_URL + "/is_read", {
        //         id: item.id,
        //       });
        //     };
        //     await fetch(`${notificationBASE_URL}/is_noticed?id=${item.id}`, {
        //       method: "PUT",
        //     });
        //   }
        // });
      });
  }
};

regularNotification();
setInterval(regularNotification, 30000);

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

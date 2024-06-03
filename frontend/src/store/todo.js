import { ref } from "vue";
import axios from "axios";
import {
  getCurrentDate,
  snackbar,
  getFutureDate,
  displaySnackbar,
} from "./common.js";
import {
  convertStatusIdToName,
  convertIdToUserName,
  convertCategoryIdToName,
  convertPriorityIdToName,
  convertSeDailyReportProcessIdToName,
  getStatusAll,
  getCategoryAll,
  getSeDailyReportProcess,
  getPriority,
} from "./work.js";
import { users, userInfo, searchOnlyUser } from "./user.js";
import ExcelJS from "exceljs";
import encoding from "encoding-japanese";

const todoBASE_URL = "http://localhost:3000/todo";

const todoRegistrationDialog = ref(false);

const todoTab = ref("day");

const editTodo = ref({});
const resetTodo = () => {
  editTodo.value = {
    id: null,
    day: getCurrentDate(),
    work_id: null,
    user_id: null,
    title: null,
    se_daily_report_process: null,
    target_progress: 0,
    current_progress: 0,
    required_time: 0,
    overtime: 0,
  };
};

const postTodo = async () => {
  await axios
    .get(todoBASE_URL + "/dayAndUserIdAndWorkId", {
      params: {
        day: editTodo.value.day,
        userId: userInfo.value.id,
        workId: editTodo.value.work_id,
      },
    })
    .then(async (res) => {
      if (res.data.length == 0) {
        snackbar.value.color = "blue";
        snackbar.value.text = `ToDoに追加しました。`;
        snackbar.value.isOpened = true;
        await axios.post(todoBASE_URL, editTodo.value);
        return true;
      } else {
        snackbar.value.color = "red";
        snackbar.value.text = "既にToDo追加されています。";
        snackbar.value.isOpened = true;
        return false;
      }
    });
};

const addTodo = (work) => {
  editTodo.value.work_id = work.id;
  editTodo.value.user_id = userInfo.value.id;
  editTodo.value.target_progress = editTodo.value.target_progress
    ? editTodo.value.target_progress
    : 0;
  editTodo.value.current_progress = editTodo.value.current_progress
    ? editTodo.value.current_progress
    : 0;
  editTodo.value.required_time = editTodo.value.required_time
    ? editTodo.value.required_time
    : 0;
  editTodo.value.overtime = editTodo.value.overtime
    ? editTodo.value.overtime
    : 0;
  postTodo();
  displaySnackbar("blue", work.title);
};

const getTodoWithDayAndUserId = async (day, toDay, userId) => {
  if (!userId) {
    displayTodoUsers.value = [];
    return;
  }
  await getStatusAll();
  await getCategoryAll();
  await getSeDailyReportProcess();
  await getPriority();

  await axios
    .get(todoBASE_URL + "/dayAndUserId", {
      params: {
        day: day,
        toDay: toDay,
        userId: userId,
      },
    })
    .then((res) => {
      for (const work of res.data) {
        work.stateName = convertStatusIdToName(work.state);
        if (work.se_daily_report_process) {
          work.seDailyReportProcessName = convertSeDailyReportProcessIdToName(
            work.se_daily_report_process
          );
        }
        work.staffsName = convertIdToUserName(work.staffs);
        if (work.priority) {
          work.priorityName = convertPriorityIdToName(work.priority);
        } else {
          work.priorityName = "";
        }
        work.categoryName = convertCategoryIdToName(work.category);
        if (work.registered_staff) {
          work.registered_staff = Object.assign(
            {},
            searchOnlyUser(work.registered_staff)
          );
        }
      }
      if (toDay) {
        getDetailTodoByDay(res.data, day, toDay);
      } else {
        getDetailTodo(res.data);
      }
    });
};
const displayTodoUsers = ref([]);
const displayTodoTerm = ref([]);

const getDetailTodo = (data) => {
  displayTodoUsers.value = [];
  let user = {};
  for (const userId of userInfo.value.display_todo) {
    user = Object.assign(
      {},
      users.value.find((data) => data.id === userId)
    );

    user["detail_todo"] = [];
    user["isEditedMemo"] = false;
    for (const work of data) {
      if (work.user_id == user.id) {
        user["detail_todo"].push(work);
      }
    }
    displayTodoUsers.value.push(user);
  }
};

const getDetailTodoByDay = (data, from, to) => {
  displayTodoUsers.value = [];
  displayTodoTerm.value = [];
  let user = {};
  let firstLoop = true;
  for (const userId of userInfo.value.display_todo) {
    user = Object.assign(
      {},
      users.value.find((data) => data.id === userId)
    );
    user["detail_todo"] = {};
    user["isEditedMemo"] = false;
    let fromDate = new Date(from);
    let toDate = new Date(to);
    for (
      let date = fromDate;
      date <= toDate;
      date.setDate(date.getDate() + 1)
    ) {
      let stringDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (firstLoop) {
        displayTodoTerm.value.push(stringDate);
      }
      user["detail_todo"][stringDate] = [];
    }
    firstLoop = false;
    for (const work of data) {
      if (work.user_id == user.id) {
        user["detail_todo"][work.day].push(work);
      }
    }
    displayTodoUsers.value.push(user);
  }
};

const putTodo = async (day) => {
  editTodo.value.target_progress = editTodo.value.target_progress
    ? editTodo.value.target_progress
    : 0;
  editTodo.value.current_progress = editTodo.value.current_progress
    ? editTodo.value.current_progress
    : 0;
  editTodo.value.required_time = editTodo.value.required_time
    ? editTodo.value.required_time
    : 0;
  editTodo.value.overtime = editTodo.value.overtime
    ? editTodo.value.overtime
    : 0;
  if (day == editTodo.value.day) {
    await axios.put(todoBASE_URL, editTodo.value);
    snackbar.value.color = "blue";
    snackbar.value.text = `ToDoを上書きしました。`;
    snackbar.value.isOpened = true;
  } else {
    await axios
      .get(todoBASE_URL + "/dayAndUserIdAndWorkId", {
        params: {
          day: editTodo.value.day,
          userId: userInfo.value.id,
          workId: editTodo.value.work_id,
        },
      })
      .then(async (res) => {
        if (res.data.length == 0) {
          await axios.put(todoBASE_URL, editTodo.value);
          snackbar.value.color = "blue";
          snackbar.value.text = `ToDoを上書きしました。`;
          snackbar.value.isOpened = true;
          return true;
        } else {
          snackbar.value.color = "red";
          snackbar.value.text = "既にToDo追加されています。";
          snackbar.value.isOpened = true;
          return false;
        }
      });
  }
};
const previousToDoDay = ref();
const deleteTodo = async () => {
  await axios.delete(todoBASE_URL + "?id=" + editTodo.value.id);
  for (const user of displayTodoUsers.value) {
    if ((user.id = userInfo.value.id)) {
      if (todoTab.value == "day") {
        for (const [index, work] of Object.entries(user.detail_todo)) {
          if (work.todo_id == editTodo.value.id) {
            user.detail_todo.splice(index, 1);
          }
        }
      } else {
        for (const [index, work] of Object.entries(
          user.detail_todo[previousToDoDay.value]
        )) {
          if (work.todo_id == editTodo.value.id) {
            user.detail_todo[previousToDoDay.value].splice(index, 1);
          }
        }
      }
    }
  }
};

const csvRangeDate = ref({
  fromDay: getCurrentDate(),
  toDay: getFutureDate(7),
});
const outputSEDailyReportCSV = async () => {
  if (!csvRangeDate.value.fromDay && !csvRangeDate.value.toDay) {
    displaySnackbar("red", "日付を入力してください。");
    return;
  }
  if (
    new Date(csvRangeDate.value.fromDay) > new Date(csvRangeDate.value.toDay)
  ) {
    displaySnackbar("red", "終了日は開始日より大きくしてください。");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet("取り込み対象");
  const mainWorksheet = workbook.getWorksheet("取り込み対象");

  await axios
    .get(todoBASE_URL + "/betweenDayAndUserId", {
      params: {
        fromDay: csvRangeDate.value.fromDay,
        toDay: csvRangeDate.value.toDay,
        userId: userInfo.value.id,
      },
    })
    .then((res) => {
      let row = mainWorksheet.getRow(1);
      let preRow;
      let day;
      let preDay;
      let num = 1;
      row.getCell(1).value = userInfo.value.employee_no;
      let currentRow = 2;
      for (const data of res.data) {
        row = mainWorksheet.getRow(currentRow);
        day = data.day.replaceAll("-", "");
        if (preDay != day) {
          row.getCell(1).value = 1;
          row.getCell(2).value = day;
          row.getCell(4).value = "*";
          currentRow += 1;
          row = mainWorksheet.getRow(currentRow);
          num = 1;
        }
        preDay = day;
        row.getCell(1).value = 2;
        row.getCell(2).value = num;
        num += 1;
        row.getCell(3).value = data.project_no;
        // 工程
        row.getCell(4).value = data.se_daily_report_process;
        row.getCell(5).value = 1;
        row.getCell(6).value = data.required_time ? data.required_time : 0;
        // 時間外
        row.getCell(7).value = data.overtime ? data.overtime : 0;
        row.getCell(11).value = data.title;
        row.getCell(13).value = "*";
        currentRow += 1;
      }
    });

  const uint8Array = new Uint8Array(
    encoding.convert(await workbook.csv.writeBuffer(), {
      from: "UTF8",
      to: "SJIS",
    })
  );
  const blob = new Blob([uint8Array], { type: "application/octet-binary" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TeamSync CSV取り込みテンプレート.csv`;
  a.click();
  a.remove();
};

export {
  editTodo,
  displayTodoUsers,
  csvRangeDate,
  todoRegistrationDialog,
  displayTodoTerm,
  todoTab,
  previousToDoDay,
  resetTodo,
  postTodo,
  putTodo,
  getTodoWithDayAndUserId,
  deleteTodo,
  outputSEDailyReportCSV,
  addTodo,
};

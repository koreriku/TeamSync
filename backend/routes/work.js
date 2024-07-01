import express from "express";
import { throwQuery, throwQueryNoRes, pool, filePath } from "../psqlPool.js";
import bcrypt from "bcrypt";
import ExcelJS from "exceljs";
import { promises as fs } from "fs";

const router = express.Router();

let query = {};

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
    INSERT INTO works (title, project, detail, state, staffs, priority, category, version, "from", "to", 
    estimate_time, actual_time, progress, se_daily_report_process, registration_date, update_date, files, 
    children_title, work_id, registered_staff, gross_estimate_time, gross_actual_time, gross_progress)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING id;
  `,
    values: [
      data.title,
      data.project,
      data.detail,
      data.state,
      data.staffs,
      data.priority,
      data.category,
      data.version,
      data.from,
      data.to,
      data.estimate_time,
      data.actual_time,
      data.progress,
      data.se_daily_report_process,
      data.registration_date,
      data.update_date,
      data.files,
      data.children_title,
      data.work_id,
      data.registered_staff,
      data.gross_estimate_time,
      data.gross_actual_time,
      data.gross_progress,
    ],
  };
  await throwQuery(res, query);
});

router.put("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      UPDATE works
    SET title = $2,
    project = $3,
    detail = $4,
    state = $5,
    staffs = $6,
    priority = $7,
    category = $8,
    version = $9,
    "from" = $10,
    "to" = $11,
    estimate_time = $12,
    actual_time = $13,
    progress = $14,
    comment = $15,
    registration_date = $16,
    update_date = $17,
    files = $18,
    se_daily_report_process = $19,
    children_title = $20,
    work_id = $21,
    gross_estimate_time = $22,
    gross_actual_time = $23,
    gross_progress = $24
    WHERE id = $1;  
    `,
    values: [
      data.id,
      data.title,
      data.project,
      data.detail,
      data.state,
      data.staffs,
      data.priority,
      data.category,
      data.version,
      data.from,
      data.to,
      data.estimate_time,
      data.actual_time,
      data.progress,
      data.comment,
      data.registration_date,
      data.update_date,
      data.files,
      data.se_daily_report_process,
      data.children_title,
      data.work_id,
      data.gross_estimate_time,
      data.gross_actual_time,
      data.gross_progress,
    ],
  };
  await throwQuery(res, query);
});

router.put("/progressAndTime", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      UPDATE works SET
      actual_time = $2,
      progress = $3,
      state = $4
      WHERE id = $1;  
      `,
    values: [data.id, data.actual_time, data.progress, data.state],
  };
  await throwQuery(res, query);
});
router.put("/parentProgressAndTime", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      UPDATE works SET
      gross_estimate_time = $2,
      gross_actual_time = $3,
      gross_progress = $4
      WHERE id = $1;  
      `,
    values: [
      data.id,
      data.gross_estimate_time,
      data.gross_actual_time,
      data.gross_progress,
    ],
  };
  await throwQuery(res, query);
});

router.put("/comment", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      UPDATE works
    SET comment = $2,update_date = $3
    WHERE id = $1;  
    `,
    values: [data.id, data.comment, data.update_date],
  };
  await throwQuery(res, query);
});

router.put("/files", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      UPDATE works
    SET files = $2,update_date = $3
    WHERE id = $1;  
    `,
    values: [data.id, data.files, data.update_date],
  };
  await throwQuery(res, query);
});

router.get("/", async (req, res) => {
  const id = Number(req.query.projectId);
  if (id > 0) {
    query = {
      text: `SELECT * FROM works WHERE project = $1 ORDER BY id DESC`,
      values: [id],
    };
  } else {
    query = {
      text: `SELECT * FROM works`,
    };
  }
  await throwQuery(res, query);
});

router.get("/id", async (req, res) => {
  const id = req.query.id;
  query = {
    text: `SELECT * FROM works WHERE id = $1`,
    values: [id],
  };
  await throwQuery(res, query);
});

router.get("/projectIds", async (req, res) => {
  const projectIds = req.query.projectIds.split(",");
  if (projectIds.length == 0) return;
  if (projectIds.length == 1) {
    query = {
      text: `SELECT * FROM works WHERE project = $1 ORDER BY UPDATE_DATE desc`,
      values: [projectIds[0]],
    };
  } else {
    let whereText;
    for (let i = 1; i <= projectIds.length; i++) {
      if (i == 1) {
        whereText = `project = $${i} `;
      } else {
        whereText = whereText + ` OR project = $${i}`;
      }
    }
    query = {
      text: `SELECT * FROM works WHERE ${whereText} ORDER BY UPDATE_DATE desc`,
      values: projectIds,
    };
  }
  await throwQuery(res, query);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    res.send("IDがNullです。");
  }
  query = {
    text: `DELETE FROM works WHERE id = $1 OR work_id = $1`,
    values: [id],
  };
  await throwQuery(res, query);
});

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentTime() {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  const hh = ("00" + h).slice(-2);
  const mm = ("00" + m).slice(-2);
  const ss = ("00" + s).slice(-2);

  return `${hh}:${mm}:${ss}`;
}

function getCurrentDateTime() {
  return getCurrentDate() + " " + getCurrentTime();
}

router.post("/importExcel", (req, res) => {
  const data = req.body[0];
  const now = getCurrentDateTime();
  if (!data.fileInfo) return;
  const workbook = new ExcelJS.Workbook();
  const fileName = data.fileInfo[0].name;
  try {
    workbook.xlsx
      .readFile(filePath + "/" + fileName) // ファイルのパスを指定
      .then(() => {
        const worksheet = workbook.getWorksheet("取り込み対象"); // ワークシートを選択
        let work = {
          title: "",
          detail: "",
          status: null,
          staffs: [],
          priority: null,
          se_daily_report_process: null,
          category: [],
          version: "",
          from: "",
          to: "",
        };
        let childrenWorks = [];
        let tentativeChildrenWorks = [];
        let isChildrenWorkRow = false;
        let childrenWorkRows = [];
        let childrenWorkIds = [];

        const convertNameToID = (target, items) => {
          if (target.length > 0) {
            for (const item of items) {
              if (target == item.name) {
                return item.id;
              }
            }
          }
        };

        const rowCount = worksheet.rowCount;
        const to = worksheet.eachRow(
          { includeEmpty: true },
          (row, rowNumber) => {
            // 各行のデータを処理する
            if (rowNumber > 2) {
              row.eachCell((cell, colNumber) => {
                if (colNumber == 1) {
                  work.title = cell.value;
                } else if (colNumber == 2) {
                  work.detail = cell.value;
                } else if (colNumber == 3) {
                  work.status =
                    cell.value.length > 0
                      ? convertNameToID(cell.value, data.statuses)
                      : null;
                } else if (colNumber == 4) {
                  work.staffs =
                    cell.value.length > 0
                      ? [convertNameToID(cell.value, data.users)]
                      : [];
                } else if (colNumber == 5) {
                  work.priority =
                    cell.value.length > 0
                      ? convertNameToID(cell.value, data.priorities)
                      : null;
                } else if (colNumber == 6) {
                  work.se_daily_report_process =
                    cell.value.length > 0
                      ? convertNameToID(cell.value, data.seDailyReportProcesses)
                      : null;
                } else if (colNumber == 7) {
                  work.category =
                    cell.value.length > 0
                      ? [convertNameToID(cell.value, data.categories)]
                      : [];
                } else if (colNumber == 8) {
                  work.version = cell.value;
                } else if (colNumber == 9) {
                  work.from = cell.value;
                } else if (colNumber == 10) {
                  work.to = cell.value;
                } else if (colNumber == 11) {
                  if (cell.value != null && cell.value.trim() != "") {
                    isChildrenWorkRow = true;
                    tentativeChildrenWorks.push({
                      num: rowNumber,
                      title: work.title,
                      children_title: "設計",
                      staffs: [cell.value],
                      priority: work.priority,
                      category: work.category,
                      se_daily_report_process: 3,
                      from: work.from,
                      to: work.to,
                    });
                  }
                } else if (colNumber == 12) {
                  if (cell.value != null && cell.value.trim() != "") {
                    isChildrenWorkRow = true;
                    tentativeChildrenWorks.push({
                      num: rowNumber,
                      title: work.title,
                      children_title: "開発",
                      staffs: [cell.value],
                      priority: work.priority,
                      category: work.category,
                      se_daily_report_process: 4,
                      from: work.from,
                      to: work.to,
                    });
                  }
                } else if (colNumber == 13) {
                  if (cell.value != null && cell.value.trim() != "") {
                    isChildrenWorkRow = true;
                    tentativeChildrenWorks.push({
                      num: rowNumber,
                      title: work.title,
                      children_title: "検証",
                      staffs: [cell.value],
                      priority: work.priority,
                      category: work.category,
                      se_daily_report_process: 5,
                      from: work.from,
                      to: work.to,
                    });
                  }
                }
              });

              if (work.title.trim().length > 0) {
                if (isChildrenWorkRow) {
                  childrenWorks.push(...tentativeChildrenWorks);
                  childrenWorkRows.push(rowNumber);
                  tentativeChildrenWorks = [];
                  isChildrenWorkRow = false;
                }

                query = {
                  text: `
                INSERT INTO works (title, project, detail, state, staffs, priority, se_daily_report_process, category, version, "from", "to", update_date, registration_date, comment, files)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id;
                `,
                  values: [
                    work.title,
                    data.projectID,
                    work.detail,
                    work.status,
                    [...work.staffs],
                    work.priority,
                    work.se_daily_report_process,
                    [...work.category],
                    work.version,
                    work.from,
                    work.to,
                    now,
                    now,
                    [],
                    [],
                  ],
                };
                work = {
                  title: "",
                  detail: "",
                  status: null,
                  staffs: [],
                  priority: null,
                  se_daily_report_process: null,
                  category: [],
                  version: "",
                  from: "",
                  to: "",
                };
                try {
                  pool
                    .query(query)
                    .then((result) => {
                      let workId = result.rows[0].id;
                      childrenWorkIds.push(workId);
                      let deleteChildrenWorksIndex = [];
                      let targetRow = childrenWorkRows.shift();
                      let targetWorkId = childrenWorkIds.shift();
                      for (const [
                        index,
                        childrenWork,
                      ] of childrenWorks.entries()) {
                        if (childrenWork.num == targetRow) {
                          deleteChildrenWorksIndex.push(index);
                          let cwQuery = {
                            text: `
                          INSERT INTO works (work_id, title, children_title, staffs, priority, category, se_daily_report_process, "from", "to", project, comment, files)
                          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
                          `,
                            values: [
                              targetWorkId,
                              childrenWork.title,
                              childrenWork.children_title,
                              [
                                convertNameToID(
                                  childrenWork.staffs,
                                  data.users
                                ),
                              ],
                              childrenWork.priority,
                              childrenWork.category,
                              childrenWork.se_daily_report_process,
                              childrenWork.from,
                              childrenWork.to,
                              data.projectID,
                              [],
                              [],
                            ],
                          };
                          try {
                            pool
                              .query(cwQuery)
                              .then((cwResult) =>
                                console.log(
                                  childrenWork.title,
                                  "を子課題にインサート"
                                )
                              )
                              .catch((e) => {
                                console.log(e.stack);
                              });
                          } catch (error) {
                            console.error(
                              "クエリの実行中にエラーが発生しました: ",
                              error
                            );
                          }
                        }
                      }
                      childrenWorks = childrenWorks.filter(
                        (work) => work.num != targetRow
                      );
                    })
                    .catch((e) => {
                      console.log(e.stack);
                    });
                } catch (error) {
                  console.error(
                    "クエリの実行中にエラーが発生しました: ",
                    error
                  );
                }
              } else {
                tentativeChildrenWorks = [];
                isChildrenWorkRow = false;
              }
            }
          }
        );
      })
      .catch((error) => {
        console.error(
          "Excelファイルの読み込み中にエラーが発生しました: ",
          error
        );
      });
  } catch (error) {
    console.error("クエリの実行中にエラーが発生しました: ", error);
  }
  // finally {
  //   try {
  //     fs.unlink(filePath + "/" + fileName);
  //     console.log("ファイルの削除に成功しました");
  //   } catch (error) {
  //     console.error("ファイルの削除中にエラーが発生しました:", error);
  //   }
  // }
  res.send("取り込み完了");
  console.log("エクセル取り込み完了");
});

const copyCells = (
  fromSheet,
  fromSRow,
  fromERow,
  fromSCol,
  fromECol,
  toSheet,
  toSRow,
  toSCol
) => {
  let preCell = {
    value: "",
    SCol: 1,
    ECol: 1,
  };
  for (let i = fromSRow; i <= fromERow; i++) {
    for (let i2 = fromSCol; i2 <= fromECol + 1; i2++) {
      let fromCell = fromSheet.getCell(i, i2);
      let toCell = toSheet.getCell(
        toSRow + i - fromSRow,
        toSCol + i2 - fromSCol
      );

      if (fromCell.value != null) {
        if (preCell.value == fromCell.value) {
          preCell.ECol = i2;
        } else {
          toCell.value = fromCell.value;
          preCell.value = fromCell.value;
          if (preCell.SCol != preCell.ECol) {
            toSheet.mergeCells(i, preCell.SCol, i, preCell.ECol);
          }
          preCell.SCol = i2;
          preCell.ECol = i2;
        }
      }
      toCell.style = fromCell.style;
    }
  }
};

router.get("/seDailyReportProcess", async (req, res) => {
  query = {
    text: `SELECT * FROM se_daily_report_process`,
  };
  await throwQuery(res, query);
});

router.get("/testExcel", (req, res) => {
  const data = req.body[0];
  const workbook = new ExcelJS.Workbook();
  const fileName = "受付個票.xlsx";
  const output_file = "output.xlsx";
  try {
    workbook.xlsx
      .readFile(filePath + "/" + fileName) // ファイルのパスを指定
      .then(() => {
        let main = workbook.worksheets[0];
        let header = workbook.getWorksheet("Header");
        let detail = workbook.getWorksheet("Detail");
        copyCells(header, 1, 2, 1, 38, main, 1, 1);
        const imageId = workbook.addImage({
          filename: filePath + "/" + "../../src/assets/filename.png",
          extension: "png",
        });
        main.addImage(imageId, {
          tl: { col: 2, row: 3 },
          ext: { width: 500, height: 500 },
        });
        workbook.xlsx.writeFile(filePath + "/" + output_file);
      })
      .then((data) => {
        res.send(filePath + "/" + output_file);
      });
  } catch (error) {
    console.error("クエリの実行中にエラーが発生しました: ", error);
  }
});

export default router;

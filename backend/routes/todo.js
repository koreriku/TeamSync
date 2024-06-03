import express from "express";
import { throwQuery, throwQueryNoRes, pool, filePath } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      INSERT INTO todo (day, work_id, user_id, target_progress, required_time, current_progress, overtime)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `,
    values: [
      data.day,
      data.work_id,
      data.user_id,
      data.target_progress,
      data.required_time,
      data.current_progress,
      data.overtime,
    ],
  };
  await throwQuery(res, query);
});

router.get("/dayAndUserId", async (req, res) => {
  const userId = req.query.userId;
  const day = req.query.day;
  const toDay = req.query.toDay;
  let whereDay;
  if (toDay) {
    whereDay = `day BETWEEN '${day}' AND '${toDay}'`;
  } else {
    whereDay = `day = '${day}'`;
  }
  query = {
    text: `SELECT * FROM works INNER JOIN
           (SELECT id as todo_id,day,work_id as work_id_of_todo,user_id,target_progress,required_time,current_progress,overtime FROM todo
           WHERE ${whereDay} AND user_id in ( ${userId} )) todo 
           ON works.id = todo.work_id_of_todo INNER JOIN
           (SELECT id as project_id,title as project_name FROM projects) project 
           ON project.project_id = works.project
           order by project_id
           `,
  };
  await throwQuery(res, query);
});

router.get("/dayAndUserIdAndWorkId", async (req, res) => {
  const userId = req.query.userId;
  const day = req.query.day;
  const workId = req.query.workId;
  query = {
    text: `SELECT * FROM todo
           WHERE day = $1 AND user_id = $2 AND work_id = $3`,
    values: [day, userId, workId],
  };
  await throwQuery(res, query);
});

router.get("/betweenDayAndUserId", async (req, res) => {
  const fromDay = req.query.fromDay;
  const toDay = req.query.toDay;
  const userId = req.query.userId;
  query = {
    text: `
           SELECT * FROM works INNER JOIN
           (SELECT * FROM todo
            WHERE day BETWEEN $1 AND $2 AND user_id = $3) todo 
           ON works.id = todo.work_id INNER JOIN
           (SELECT id as project_id,project_no FROM projects) project 
           ON project.project_id = works.project
           order by day
            `,
    values: [fromDay, toDay, userId],
  };
  await throwQuery(res, query);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  query = {
    text: `DELETE FROM todo WHERE id = $1`,
    values: [id],
  };
  await throwQuery(res, query);
});

router.put("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      UPDATE todo
      SET day = $2,
      target_progress = $3,
      required_time = $4,
      current_progress = $5, 
      overtime = $6 
      WHERE id = $1;  
      `,
    values: [
      data.id,
      data.day,
      data.target_progress,
      data.required_time,
      data.current_progress,
      data.overtime,
    ],
  };
  await throwQuery(res, query);
});

export default router;

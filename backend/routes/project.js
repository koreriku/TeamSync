import express from "express";
import { throwQuery, throwQueryNoRes, pool } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
    INSERT INTO projects (title, detail, state, staff_ids, "from", "to", estimate_time, actual_time, progress, project_no)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
  `,
    values: [
      data.title,
      data.detail,
      data.state,
      data.staff_ids,
      data.from,
      data.to,
      data.estimate_time,
      data.actual_time,
      data.progress,
      data.project_no,
    ],
  };
  await throwQuery(res, query);
});

router.put("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
    UPDATE projects
    SET title = $2,
    detail = $3,
    state = $4,
    staff_ids = $5,
    "from" = $6,
    "to" = $7,
    estimate_time = $8,
    actual_time = $9,
    progress = $10,
    project_no = $11
    WHERE id = $1;  
    `,
    values: [
      data.id,
      data.title,
      data.detail,
      data.state,
      data.staff_ids,
      data.from,
      data.to,
      data.estimate_time,
      data.actual_time,
      data.progress,
      data.project_no,
    ],
  };
  await throwQuery(res, query);
});

router.get("/", async (req, res) => {
  const user_id = Number(req.query.user_id);
  query = {
    text: `SELECT * FROM projects WHERE staff_ids @> ARRAY[$1]::integer[]
           ORDER BY state, id desc`,
    values: [user_id],
  };
  await throwQuery(res, query);
});

router.get("/all", async (req, res) => {
  query = {
    text: `SELECT * FROM projects
           ORDER BY id desc`,
  };
  await throwQuery(res, query);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  query = {
    text: `DELETE FROM projects WHERE id = $1`,
    values: [id],
  };
  await throwQuery(res, query);
});

export default router;

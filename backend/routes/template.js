import express from "express";
import { throwQuery, throwQueryNoRes, pool } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      INSERT INTO template (project_id, name, title, detail)
      VALUES ($1, $2, $3, $4);
    `,
    values: [data.project_id, data.name, data.title, data.detail],
  };
  await throwQuery(res, query);
});

router.get("/", async (req, res) => {
  const project_id = req.query.project_id;
  query = {
    text: `SELECT * FROM template WHERE project_id = $1 ORDER BY id`,
    values: [project_id],
  };
  await throwQuery(res, query);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  query = {
    text: `DELETE FROM template WHERE id = $1`,
    values: [id],
  };
  await throwQuery(res, query);
});

router.delete("/project", async (req, res) => {
  const project_id = req.query.project_id;
  query = {
    text: `DELETE FROM template WHERE project_id = $1`,
    values: [project_id],
  };
  await throwQuery(res, query);
});

export default router;

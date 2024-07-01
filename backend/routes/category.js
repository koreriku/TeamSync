import express from "express";
import { throwQuery, throwQueryNoRes, pool } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
    INSERT INTO category (project_id, name, sort_key)
    VALUES ($1, $2, $3);
  `,
    values: [data.project_id, data.name, data.sort_key],
  };
  await throwQuery(res, query);
});

router.put("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      UPDATE category
      SET name = $2,
      project_id = $3
      WHERE id = $1;  
      `,
    values: [data.id, data.name, data.project_id],
  };
  await throwQuery(res, query);
});

router.put("/multi", async (req, res) => {
  const items = req.body;
  const project_id = req.query.project_id;
  for (const item of items) {
    query = {
      text: `
      UPDATE category
      SET sort_key = $2 ,name = $3, project_id = $4
      WHERE id = $1
      `,
      values: [item.id, item.new_id, item.name, item.project_id],
    };
    await throwQueryNoRes(res, query);
  }
  query = {
    text: `SELECT * FROM category WHERE $1 = ANY(project_id) ORDER BY sort_key`,
    values: [project_id],
  };
  await throwQuery(res, query);
});

router.get("/", async (req, res) => {
  const project_id = req.query.project_id;
  query = {
    text: `SELECT * FROM category WHERE $1 = ANY(project_id) ORDER BY sort_key`,
    values: [project_id],
  };
  await throwQuery(res, query);
});

router.get("/all", async (req, res) => {
  query = {
    text: `SELECT * FROM category ORDER BY sort_key`,
  };
  await throwQuery(res, query);
});

router.delete("/all", async (req, res) => {
  const project_id = req.query.project_id;
  query = {
    text: `DELETE FROM category WHERE $1 = ANY(project_id)`,
    values: [project_id],
  };
  await throwQuery(res, query);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  query = {
    text: `DELETE FROM category WHERE id = $1`,
    values: [id],
  };
  await throwQuery(res, query);
});

export default router;

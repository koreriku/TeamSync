import express from "express";
import { throwQuery, throwQueryNoRes, pool } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
      INSERT INTO wiki (update_date, registration_date, staff, title, detail, category, comment, image, color, files)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `,
    values: [
      data.update_date,
      data.registration_date,
      data.staff,
      data.title,
      data.detail,
      data.category,
      data.comment,
      data.image,
      data.color,
      data.files,
    ],
  };
  await throwQuery(res, query);
});

router.get("/", async (req, res) => {
  query = {
    text: `SELECT * FROM wiki ORDER BY id desc`,
  };
  await throwQuery(res, query);
});

router.delete("/", async (req, res) => {
  const id = req.query.id;
  query = {
    text: `DELETE FROM wiki WHERE id = $1`,
    values: [id],
  };
  await throwQuery(res, query);
});

router.put("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
        UPDATE wiki
      SET title = $2,
      detail = $3,
      category = $4,
      registration_date = $5,
      update_date = $6,
      staff = $7,
      image = $8,
      color = $9,
      files = $10
      WHERE id = $1;  
      `,
    values: [
      data.id,
      data.title,
      data.detail,
      data.category,
      data.registration_date,
      data.update_date,
      data.staff,
      data.image,
      data.color,
      data.files,
    ],
  };
  await throwQuery(res, query);
});

router.put("/image", async (req, res) => {
  const data = req.body;
  query = {
    text: `
    UPDATE wiki
    SET image = $2,update_date = $3
    WHERE id = $1;  
    `,
    values: [data.id, data.image, data.update_date],
  };
  await throwQuery(res, query);
});

router.put("/comment", async (req, res) => {
  const data = req.body;
  query = {
    text: `
        UPDATE wiki
      SET comment = $2,update_date = $3
      WHERE id = $1;  
      `,
    values: [data.id, data.comment, data.update_date],
  };
  await throwQuery(res, query);
});

export default router;

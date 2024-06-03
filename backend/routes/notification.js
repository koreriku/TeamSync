import express from "express";
import { throwQuery, throwQueryNoRes, pool, filePath } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.post("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `SELECT * FROM notification 
            WHERE user_id = $1 AND work_id = $2
            `,
    values: [data.user_id, data.work_id],
  };
  await pool
    .query(query)
    .then(async (result) => {
      if (result.rows.length > 0) {
        res.send(result.rows);
        return;
      }
      query = {
        text: `
            INSERT INTO notification (title, detail, work_id, user_id, is_read, registration_date)
            VALUES ($1, $2, $3, $4, $5, $6);
          `,
        values: [
          data.title,
          data.detail,
          data.work_id,
          data.user_id,
          data.is_read,
          data.registration_date,
        ],
      };
      await throwQuery(res, query);
    })
    .catch((e) => {
      console.log(e.stack);
      res.status(500).send("An error occurred");
    });
});

router.post("/normal", async (req, res) => {
  const data = req.body;
  query = {
    text: `
            INSERT INTO notification (title, detail, work_id, user_id, is_read, registration_date)
            VALUES ($1, $2, $3, $4, $5, $6);
            `,
    values: [
      data.title,
      data.detail,
      data.work_id,
      data.user_id,
      data.is_read,
      data.registration_date,
    ],
  };
  await throwQuery(res, query);
});

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  query = {
    text: `SELECT * FROM notification 
            WHERE user_id = ${userId}
            ORDER BY id desc`,
  };
  await throwQuery(res, query);
});

router.put("/is_read", async (req, res) => {
  const id = req.body.id;
  query = {
    text: `
        UPDATE notification
        SET is_read = $2
        WHERE id = $1;  
        `,
    values: [id, true],
  };
  await throwQuery(res, query);
});

router.delete("/", async (req, res) => {
  query = {
    text: `DELETE FROM notification WHERE is_read = true`,
  };
  await throwQuery(res, query);
});

router.delete("/work", async (req, res) => {
  const work_id = req.query.work_id;
  query = {
    text: `DELETE FROM notification WHERE work_id = ${work_id}`,
  };
  await throwQuery(res, query);
});
export default router;

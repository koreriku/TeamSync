import express from "express";
import { throwQuery, throwQueryNoRes, pool } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.get("/", async (req, res) => {
  const id = req.query.id;
  query = {
    text: `SELECT * FROM board WHERE id = $1 ORDER BY id`,
    values: [id],
  };
  await throwQuery(res, query);
});

router.put("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
        UPDATE board
        SET content = $2 
        WHERE id = $1
        RETURNING id, content;
        `,
    values: [data.id, data.content],
  };

  await throwQuery(res, query);
});

export default router;

import express from "express";
import { throwQuery, throwQueryNoRes, pool } from "../psqlPool.js";

const router = express.Router();

let query = {};

router.get("/", async (req, res) => {
  const department_id = req.query.department_id;
  query = {
    text: `SELECT * FROM board WHERE department = $1`,
    values: [department_id],
  };
  await pool
    .query(query)
    .then(async (result) => {
      if (result.rows.length > 0) {
        res.send(result.rows);
      } else {
        query = {
          text: `
          INSERT INTO board (content, department)
          VALUES ($1, $2) RETURNING id, content, department;
        `,
          values: ["", department_id],
        };
        await throwQuery(res, query);
      }
    })
    .catch((e) => {
      console.log(e.stack);
      res.status(500).send("An error occurred");
    });
});

router.put("/", async (req, res) => {
  const data = req.body;
  query = {
    text: `
        UPDATE board
        SET content = $2 
        WHERE department = $1
        RETURNING id, content, department;
        `,
    values: [data.department, data.content],
  };

  await throwQuery(res, query);
});

export default router;

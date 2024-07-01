import express from "express";
import { throwQuery, throwQueryNoRes, pool } from "../psqlPool.js";
import bcrypt from "bcrypt";

const router = express.Router();

let query = {};

router.get("/", async (req, res) => {
  const id = req.query.id;
  if (id == 0) {
    query = {
      text: `SELECT * FROM users ORDER BY id`,
    };
  } else {
    query = {
      text: `SELECT * FROM users WHERE id = $1`,
      values: [id],
    };
  }
  await throwQuery(res, query);
});

// ユーザー登録のエンドポイント
router.post("/", async (req, res) => {
  const data = req.body;
  // パスワードをハッシュ化
  data.password = await bcrypt.hash(data.password, 10);
  query = {
    text: `INSERT INTO users (name, birthday, email, password, icon, employee_no,department) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, employee_no, birthday,email,password,icon,todo,memo,display_todo,department;`,
    values: [
      data.name,
      data.birthday,
      data.email,
      data.password,
      data.icon,
      data.employee_no,
      data.department,
    ],
  };
  await throwQuery(res, query);
});

// ユーザー登録のエンドポイント
router.put("/", async (req, res) => {
  const data = req.body;
  // パスワードをハッシュ化
  data.password = await bcrypt.hash(data.password, 10);
  query = {
    text: `UPDATE users
    SET name = $2, birthday = $3, email = $4, password = $5, icon = $6, todo = $7, memo = $8, display_todo = $9, employee_no = $10, department = $11
    WHERE id = $1
    RETURNING id, name, birthday,email,password,icon,todo,memo,display_todo,employee_no,department;`,
    values: [
      data.id,
      data.name,
      data.birthday,
      data.email,
      data.password,
      data.icon,
      data.todo,
      data.memo,
      data.display_todo,
      data.employee_no,
      data.department,
    ],
  };
  await throwQuery(res, query);
});

router.get("/confirm", async (req, res) => {
  const data = req.query;
  query = {
    text: `SELECT * FROM users WHERE email = $1`,
    values: [data.email],
  };
  await pool
    .query(query)
    .then((result) => {
      if (result.rows.length > 0) {
        bcrypt.compare(data.password, result.rows[0].password, (err, judge) => {
          if (err) {
            console.error(err);
            res.send(result.rows);
            return;
          }

          console.log("Password Matched:", judge); // true
          res.send(result.rows);
        });
      } else {
        res.send(result.rows);
      }
    })
    .catch((e) => {
      console.log(e.stack);
      res.status(500).send("An error occurred");
    });
});

export default router;

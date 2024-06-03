import express from "express";
import {
  pool,
  upload,
  throwQuery,
  throwQueryNoRes,
  filePath,
} from "../psqlPool.js";
import { promises as fs } from "fs";

const router = express.Router();

let query = {};

router.post("/upload", upload.single("file"), function (req, res, next) {
  res.send("ファイルのアップロードが完了しました。");
});

router.put("/deleteFile", (req, res) => {
  if (req.body.fileName) {
    (async () => {
      try {
        await fs.unlink(filePath + "/" + req.body.fileName);
        console.log("ファイルの削除に成功しました");
      } catch (error) {
        console.error("ファイルの削除中にエラーが発生しました:", error);
      }
    })();
  }
});

export default router;

import express from "express";
import cors from "cors";
import user from "./routes/user.js";
import work from "./routes/work.js";
import status from "./routes/status.js";
import project from "./routes/project.js";
import category from "./routes/category.js";
import common from "./routes/common.js";
import template from "./routes/template.js";
import board from "./routes/board.js";
import wiki from "./routes/wiki.js";
import todo from "./routes/todo.js";
import notification from "./routes/notification.js";
const app = express();

// "http://172.16.16.134:5173"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

app.use("/user", user);
app.use("/work", work);
app.use("/status", status);
app.use("/project", project);
app.use("/category", category);
app.use("/common", common);
app.use("/template", template);
app.use("/board", board);
app.use("/wiki", wiki);
app.use("/todo", todo);
app.use("/notification", notification);

app.listen(3000, "localhost", function () {
  console.log("listen ....");
});

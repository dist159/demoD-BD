import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import TaskController from "./src/modules/task/task.controller";

const app = express();

const taskController = new TaskController();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/", taskController.router);

app.listen(3001, () => {
  console.log("The application is listening on port 3001!");
});

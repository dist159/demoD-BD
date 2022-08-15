import * as express from "express";
import MongoDBService from "../mongoDB/mongoDB.service";
import TaskService from "./task.service";

export default class TaskController {
  public router = express.Router();
  private mongoDbService = new MongoDBService();
  private taskService: TaskService | undefined;

  constructor() {
    this.initController();
    this.initDB();
  }

  /**
   * initial route setup
   */
  public initController() {
    this.router.get("/tasks", this.getTasks);
    this.router.put("/tasks", this.updateTask);
  }

  /**
   *
   * @param request
   * @param response
   */
  getTasks = async (request: express.Request, response: express.Response) => {
    const taskAmount = request.query?.taskAmount as string;
    response.send(await this.taskService?.getTasks(taskAmount));
  };

  /**
   *
   * @param request
   * @param response
   */
  updateTask = async (request: express.Request, response: express.Response) => {
    const taskId: string = request.body.taskId;
    response.send(await this.taskService?.updateTask(taskId));
  };

  /**
   * Database setup
   */
  initDB() {
    let db;
    let conectionAttempts = 3;
    const dbInterval = setInterval(() => {
      db = this.mongoDbService.getDb();

      if (db) {
        this.taskService = new TaskService(db);
        clearInterval(dbInterval);
      }

      conectionAttempts--;

      if (conectionAttempts == 0) {
        clearInterval(dbInterval);
        console.error("MongoDB could not connect to app");
      }
    }, 5000);
  }
}

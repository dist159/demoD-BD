import axios from "axios";
import { Db, ObjectId } from "mongodb";
import { Task } from "../../interfaces/task";

export default class TaskService {
  constructor(private db: Db | undefined) {}

  /**
   * get all task with the format id
   * @param request
   * @param response
   * @returns
   */
  getTasks = async (taskAmount: string = "3") => {
    try {
      const res = await axios.get(
        `https://lorem-faker.vercel.app/api?quantity=${taskAmount}`
      );

      const formatedTasks = res.data.map((Title: string) => {
        return { Title };
      });

      const operationResult = await this.db
        ?.collection("tasks")
        .insertMany(formatedTasks);

      const normalizeTasks = formatedTasks.map((task: Task, index: number) => {
        {
          return { ...task, UUID: operationResult?.insertedIds[index] };
        }
      });

      return normalizeTasks;
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  /**
   * set the task to completed
   * @param request
   * @param response
   * @returns
   */
  updateTask = async (taskId: string | ObjectId) => {
    const taskFinded = await this.db
      ?.collection("tasks")
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        { $set: { completed: true } }
      );

    if (!taskFinded?.value) {
      throw new Error("Task not found");
    }

    return taskFinded;
  };

  setDB(db: any) {
    this.db = db;
  }
}

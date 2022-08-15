import TaskService from "./task.service";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Db, ObjectId } from "mongodb";
import { Task } from "../../interfaces/task";

describe("Task", () => {
  let service: TaskService;
  let mongod: MongoMemoryServer;
  let db: Db;
  let mongoClient: MongoClient;
  let task: Task;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoClient = await MongoClient.connect(uri);

    db = await mongoClient.db("tasks");

    service = new TaskService(db);
    task = (await service.getTasks("1"))[0];
  });

  it("returns new tasks", async () => {
    const tasks = await service.getTasks("3");

    expect(tasks.length).toBe(3);
  });

  it("updates task", async () => {
    const taskUpdated = await service.updateTask(task._id);

    expect(taskUpdated?.value?.Title).toBe(task.Title);
  });

  it("task not found", async () => {
    let error: any;
    try {
      const taskUpdated = await service.updateTask(
        new ObjectId("62faa8b866bfc2fb8ee250bb")
      );
    } catch (e) {
      error = e;
    }

    expect(error.message).toBe("Task not found");
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongod.stop();
  });
});

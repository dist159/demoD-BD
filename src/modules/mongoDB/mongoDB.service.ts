import { Db, MongoClient } from "mongodb";

export default class MongoDBService {
  private db: Db | undefined;

  constructor() {
    this.initMongoDb();
  }

  async initMongoDb() {
    const mongoClient = await MongoClient.connect(
      "mongodb://localhost:27017/tasks"
    );

    this.db = await mongoClient.db("tasks");
  }

  getDb() {
    return this.db;
  }
}

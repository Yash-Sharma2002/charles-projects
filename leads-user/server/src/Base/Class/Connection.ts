import {
  ClientSession,
  Db,
  MongoClient,
  MongoNetworkError,
  MongoNetworkTimeoutError,
  MongoServerSelectionError,
} from "mongodb";
import CommonMessage from "../../config/response/CommonMessage";
import ResStatus from "../../config/response/ResStatus";
import ResponseClass from "./Response";
import dotenv from "dotenv";

dotenv.config({ path: "data.env" });

/**
 * Connection class
 */
class Connection {
  public client: MongoClient;
  public database: Db;
  private databaseSession: ClientSession = {} as ClientSession;

  constructor() {
    this.client = new MongoClient(process.env.DB_URL as string);
    this.database = {} as Db;
  }

  /**
   * Connect to the database
   */
  async connect() {
    try {
      await this.client.connect();
      this.database = this.client.db(process.env.DB_NAME as string);
    } catch (error: any) {
      if (
        error instanceof MongoServerSelectionError ||
        error instanceof MongoNetworkError ||
        error instanceof MongoNetworkTimeoutError
      ) {
        throw new ResponseClass(
          ResStatus.ServiceUnavailable,
          CommonMessage.ServiceUnavailable
        );
      } else {
        throw new ResponseClass(
          ResStatus.InternalServerError,
          CommonMessage.InternalServerError
        );
      }
    }
  }

  /**
   * Close the connection
   */
  async close() {
    await this.client.close();
  }

  /**
   * Set Database Session
   */
  start() {
    this.databaseSession = this.client.startSession();
    this.databaseSession.startTransaction();
  }

  /**
   * Commit Transaction
   */
  commit() {
    this.databaseSession.commitTransaction();
    this.databaseSession.endSession();
  }

  /**
   * Abort Transaction
   */
  abort() {
    this.databaseSession.abortTransaction();
    this.databaseSession.endSession();
  }

  /**
   * Get collection
   * @param collectionName
   * @returns
   */
  getCollection(collectionName: string) {
    return this.database.collection(collectionName);
  }

  /**
   * Get Database
   * @returns
   */
  getDatabase() {
    return this.database;
  }
}

export default Connection;

import Connection from "./Connection";
import { v4 as uuidv4 } from "uuid";
import Validations from "./Validations";
import ResponseClass from "./Response";
import ResStatus from "../../config/response/ResStatus";
import CommonMessage from "../../config/response/CommonMessage";

class Start extends Validations {
  protected connect: Connection = new Connection();

  /**
   * Connect Database
   */
  async connectDb() {
    await this.connect.connect();
  }

  /**
   * Generate Id
   * @returns
   */
  generateId() {
    return uuidv4();
  }

  /**
   * Delete One
   * @description Delete one document from the collection
   * @param collection
   * @param query
   */
  async deleteOne(collection: string, query: any) {
    try {
      this.connect.start();
      await this.connect.getCollection(collection).deleteOne(query);
      this.connect.commit();
    } catch (error: any) {
      this.connect.abort();
      if (error instanceof ResponseClass) {
        throw error;
      }
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Insert One
   * @description Insert one document into the collection
   * @param collection
   * @param query
   */
  async insertOne(collection: string, query: any) {
    try {
      this.connect.start();
      await this.connect.getCollection(collection).insertOne(query);
      this.connect.commit();
    } catch (error: any) {
      this.connect.abort();
      if (error instanceof ResponseClass) {
        throw error;
      }
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Update One
   * @description Update one document in the collection
   * @param collection
   * @param query
   * @param updateQuery
   */
  async updateOne(collection: string, query: any, updateQuery: any) {
    try {
      this.connect.start();
      await this.connect
        .getCollection(collection)
        .updateOne(query, updateQuery);
      this.connect.commit();
    } catch (error: any) {
      this.connect.abort();
      if (error instanceof ResponseClass) {
        throw error;
      }
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get One
   * @description Get one document from the collection
   * @param collection
   * @param query
   */
  async getOne(collection: string, query: any) {
    try {
      return await this.connect.getCollection(collection).findOne(query);
    } catch (error: any) {
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get All
   * @description Get all documents from the collection
   * @param collection
   * @param query
   */
  async getAll(collection: string, query: any) {
    try {
      return await this.connect.getCollection(collection).find(query).toArray();
    } catch (error: any) {
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Flush
   */
  flush() {
    this.connect.close();
  }
}

export default Start;

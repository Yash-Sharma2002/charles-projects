import {
    Db,
  MongoClient,
  MongoNetworkError,
  MongoNetworkTimeoutError,
  MongoServerSelectionError,
} from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./data.env" });

export default async function connectToCluster() {
  let uri = process.env.DB_URL as string;
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    return {
      message: "Connection to MongoDB Atlas established!",
      error: "",
      conn: mongoClient,
    };
  } catch (error) {
    if (
      error instanceof MongoServerSelectionError ||
      error instanceof MongoNetworkError ||
      error instanceof MongoNetworkTimeoutError
    ) {
      return {
        message: "Error connecting to MongoDB Atlas",
        error: error.message,
        conn: "",
      };
    } else {
      return {
        message: "Error connecting to MongoDB Atlas",
        error: "Unknown error",
        conn: "",
      };
    }
  }
}

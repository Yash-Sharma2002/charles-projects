import { Request, Response } from "express";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import ConnectionRes from "../interface/ConnectionRes";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";

export async function getAllUsers(req: Request, res: Response) {
  const session = req.query.session as string;
  const uid = req.query.uid as string;
  const token = req.query.token as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const usersCollection: Collection = db.collection("users");
    const sessionCollection: Collection = db.collection("sessions");

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    // insert session
    await sessionCollection.insertOne({
      activity: "get-all-users",
      session: session,
      uid: uid,
      created: new Date(),
    });

    let users = usersCollection.find(
      {},
      { projection: { username: 1, email: 1, name: 1 } }
    );

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}

export async function getUser(req: Request, res: Response) {
  const session = req.query.session as string;
  const uid = req.query.uid as string;
  const userId = req.query.userId as string;
  const token = req.query.token as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (userId === undefined) {
      return res.status(400).json({ message: "User id required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const usersCollection: Collection = db.collection("users");
    const sessionCollection: Collection = db.collection("sessions");

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    // insert session
    await sessionCollection.insertOne({
      activity: "get-all-users",
      session: session,
      uid: uid,
      created: new Date(),
    });

    let users = usersCollection.find({ uid: userId });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}

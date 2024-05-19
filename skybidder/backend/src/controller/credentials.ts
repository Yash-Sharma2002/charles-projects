import { Request, Response } from "express";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import ConnectionRes from "../interface/ConnectionRes";
import { createSession, validateSession } from "../functions/hash";
import User from "../interface/User";
import { validateToken } from "../functions/bearer";

export async function getCredentials(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const token = req.query.access_token as string;
  const session = req.query.session as string;

  try {
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Access token required" });
    }
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("credentials");
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
      activity: "get-all-credentials",
      session: session,
      uid: uid,
      created: new Date(),
    });

    // get credentials
    let credentials = collection.find({ uid: uid });
    credentials.map((credential) => {
      return {
        id: credential.id,
        platform: credential.platform,
        username: credential.username,
        password: credential.password,
        created: credential.created,
      };
    });

    return res
      .status(200)
      .json({ message: "Credentials found", credentials: credentials });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function addCredentials(req: Request, res: Response) {
  const uid = req.body.uid as string;
  const platform = req.body.platform as string;
  const username = req.body.username as string;
  const password = req.body.password as string;
  const token = req.body.access_token as string;
  const session = req.body.session as string;

  try {
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (platform === undefined) {
      return res.status(400).json({ message: "Platform required" });
    }
    if (username === undefined) {
      return res.status(400).json({ message: "Username required" });
    }
    if (password === undefined) {
      return res.status(400).json({ message: "Password required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Access token required" });
    }
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("credentials");
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
      activity: "save-credentials-" + platform,
      session: session,
      uid: uid,
      created: new Date(),
    });

    // add credentials
    await collection.insertOne({
      uid: uid,
      platform: platform,
      username: username,
      password: password,
      created: new Date(),
    });

    return res.status(200).json({ message: "Credentials added" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPlatformCredentials(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const token = req.query.access_token as string;
  const session = req.query.session as string;
  const platform = req.query.platform as string;

  try {
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Access token required" });
    }
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (platform === undefined) {
      return res.status(400).json({ message: "Platform required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("credentials");
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
      activity: "get-all-credentials",
      session: session,
      uid: uid,
      created: new Date(),
    });

    // get credentials
    let credentials = collection.find({ uid: uid, platform: platform});

    return res
      .status(200)
      .json({ message: "Credentials found", credentials: credentials });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

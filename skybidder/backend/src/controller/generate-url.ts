import { v4 } from "uuid";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import { Request, Response } from "express";
import { createSession, validateSession } from "../functions/hash";
import {  validateToken } from "../functions/bearer";

export async function generateURL(req: Request, res: Response) {
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
    const urlCollection: Collection = db.collection("urls");
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
      activity: "url-generate",
      session: session,
      uid: uid,
      created: new Date(),
    });

   

    let url = v4();
    await urlCollection.insertOne({
      url: url,
      uid: uid,
      expiration: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      created: new Date(),
    });

    return res.status(200).json({ url: url });
  } catch (error) {
    console.log(error);
  }
}

export async function validateURL(req: Request, res: Response) {
  const url = req.query.url as string;

  try {
    if (url === undefined) {
      return res.status(400).json({ message: "Url required" });
    }
    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const urlCollection: Collection = db.collection("urls");

    // check url
    let urlDoc = await urlCollection.findOne({ url: url });
    if (!urlDoc) {
      return res.status(400).json({ message: "Invalid url" });
    }

    let date = new Date();
    let expiration = urlDoc.expiration;
    if (date > expiration) {
      return res.status(400).json({ message: "Expired url" });
    }

    return res.status(200).json({ message: "Valid url" });
  } catch (error) {
    console.log(error);
  }
}

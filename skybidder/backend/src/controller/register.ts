import { v4 } from "uuid";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import { Request, Response } from "express";
import registerValidate from "../functions/registerValidate";
import RegisterError from "../interface/RegisterError";
import User from "../interface/User";
import { createSession, hash } from "../functions/hash";
import { createBearer } from "../functions/bearer";
import { closeConn } from "../connection/closeConn";

export async function register(req: Request, res: Response) {
  const { name, username, email, password, provider } = req.body;

  try {
    
    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("users");
    const sessionCollection: Collection = db.collection("sessions");

    // check if already exists
    const filteredDocs = await collection.find({ email: email }).toArray();
    if (filteredDocs.length > 0) {
      return res.status(400).json({
        errors: {
          message: "Email already exists",
        },
        email: email,
      });
    }

    // check for errors
    let errors: RegisterError | undefined = {} as RegisterError;
    errors = registerValidate(username, email, password, name).errors;
    if (errors && Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors: errors,
        message: "Invalid input(s)",
      });
    }

    // create account if everything is good
    let uid = v4();

    // create session
    let session = createSession();

    await sessionCollection.insertOne({
      active: "login",
      session: session,
      uid: uid,
      created: new Date(),
    });

    // create generate new token
    const token = createBearer(email, uid, session);

    const user: User = {
      uid: uid,
      name: name,
      username: username,
      email: email,
      password: hash(password),
      access_token: token,
      session: session,
      provider: provider,
    };

    await collection.insertOne(user);

    closeConn(conn);

    res
      .status(201)
      .json({ user: user, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

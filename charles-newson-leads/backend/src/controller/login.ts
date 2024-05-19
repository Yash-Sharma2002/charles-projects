import { Request, Response } from "express";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import loginValidate from "../functions/loginValidate";
import ConnectionRes from "../interface/ConnectionRes";
import LoginError from "../interface/LoginError";
import { comparePassword, createSession } from "../functions/hash";
import { createBearer } from "../functions/bearer";
import User from "../interface/User";

export async function login(req: Request, res: Response) {
  let user = req.query.user as string;
  let password = req.query.password as string;
  let provider = req.query.provider as string;

  try {
    if (user === undefined) {
      return res.status(400).json({ message: "Username or email required" });
    }
    if (password === undefined) {
      return res.status(400).json({ message: "Password required" });
    }
    if (provider === undefined) {
      return res.status(400).json({ message: "Provider required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("users");
    const sessionCollection: Collection = db.collection("sessions");

    // check if user exists
    let loggedUser;
    if (user) {
      loggedUser = await collection.findOne({ username: user });
    }
    if (loggedUser === null) {
      loggedUser = await collection.findOne({
        email: user,
      });
    }

    if (!loggedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (loggedUser.provider !== provider) {
      return res.status(400).json({ message: "Invalid provider" });
    }

    // check if password is correct
    if (!comparePassword(password, loggedUser.password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check user status
    if (loggedUser?.status === "inactive") {
      return res.status(400).json({ message: "User is inactive" });
    }

    let newUser: User = {
      uid: loggedUser?.uid,
      username: loggedUser?.username,
      email: loggedUser?.email,
      password: loggedUser?.password,
      access_token: loggedUser?.access_token,
      session: loggedUser?.session,
      status: loggedUser?.status,
    };

    // check session
    newUser.session = createSession();

    newUser.access_token = createBearer(
      loggedUser?.email,
      loggedUser?.uid,
      newUser.session
    );

    // insert session
    await sessionCollection.insertOne({
      activity: "login",
      session: newUser.session,
      uid: loggedUser?.uid,
      created: new Date(),
    });

    // update user

    await collection.updateOne(
      {
        uid: loggedUser?.uid,
      },
      {
        $set: {
          session: newUser.session,
          access_token: newUser.access_token,
        },
      }
    );

    const tmpuser = {
      uid: newUser.uid,
      username: newUser.username,
      email:newUser.email,
      access_token: newUser.access_token,
      session: newUser.session,
    };

    res
      .status(200)
      .json({ user: tmpuser, message: "User logged in successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

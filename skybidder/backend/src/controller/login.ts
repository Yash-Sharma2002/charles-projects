import { Request, Response } from "express";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import loginValidate from "../functions/loginValidate";
import ConnectionRes from "../interface/ConnectionRes";
import LoginError from "../interface/LoginError";
import {
  comparePassword,
  createSession,
  validateSession,
} from "../functions/hash";
import { createBearer, validateToken } from "../functions/bearer";
import User from "../interface/User";

export async function login(req: Request, res: Response) {
  const username = req.query.username as string;
  let email = req.query.email as string;
  let password = req.query.password as string;
  let provider = req.query.provider as string;

  try {
    if (username === undefined && email === undefined) {
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

    // check for errors
    let errors: LoginError | undefined = {} as LoginError;
    errors = loginValidate(email, password)?.errors;
    if (errors && Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors: errors,
        message: "Invalid input(s)",
      });
    }

    // check if user exists
    let user;
    if (username !== undefined) {
      user = await collection.findOne({ username: username });
    } else if (email !== undefined) {
      user = await collection.findOne({
        email: email,
      });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.provider !== provider) {
      return res.status(400).json({ message: "Wrong provider" });
    }

    // check if password is correct
    if (comparePassword(password, user.password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let newUser: User = {
      uid: user.uid,
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      access_token: user.access_token,
      session: user.session,
    };

    // check session
    newUser.session = createSession();

    newUser.access_token = createBearer(user.email, user.uid, newUser.session);

    // insert session
    await sessionCollection.insertOne({
      activity: "login",
      session: newUser.session,
      uid: user.uid,
      created: new Date(),
    });

    // update user

    await collection.updateOne(
      {
        uid: user.uid,
      },
      {
        $set: {
          session: newUser.session,
          access_token: newUser.access_token,
        },
      }
    );

    res
      .status(200)
      .json({ user: user, message: "User logged in successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

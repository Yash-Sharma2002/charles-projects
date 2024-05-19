import { Request, Response } from "express";
import axios from "axios";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "../data.env" });

export async function forgetPass(req: Request, res: Response) {
  const email = req.body.email as string;
  const username = req.body.username as string;

  try {
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (username === undefined) {
      return res.status(400).json({ message: "Username required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("users");

    // check if already exists
    const filteredDocs = await collection
      .find({ email: email, username: username }, { projection: { $uid: 1 } })
      .toArray();
    if (filteredDocs.length === 0) {
      return res.status(400).json({
        errors: {
          message: "Email or username does not exist",
        },
        email: email,
      });
    }

    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          email: "support@newson.io",
          name: "Leads",
        },
        to: [
          {
            email: email,
            name: username,
          },
        ],
        subject: "Password reset",
        htmlContent: `<html><body><p>Click <a href='http://localhost:3000/reset-pass/${filteredDocs[0]._id}'>here</a> to reset your password</p></body></html>`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_EMAIL_API,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}



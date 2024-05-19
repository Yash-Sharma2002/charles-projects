import { Collection, Db } from "mongodb";
import { Request, Response } from "express";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { v4 } from "uuid";

export async function addProxies(req: Request, res: Response) {
  let proxies = req.body.proxies;

  try {
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("proxies");
    let error: {
      ip: string;
      port: number;
      message: string;
    }[] = []

    for (let i = 0; i < proxies.length; i++) {

      let proxy = proxies[i];
      let check = await collection.findOne({ ip: proxy.ip, port: proxy.port, status: "active" });
      if (check!.proxy_id) {
        error.push({ ip: proxy.ip, port: proxy.port, message: "Proxy already exists" });
        continue;
      }

      await collection.insertOne({
        ip: proxy.ip,
        proxy_id: v4(),
        account_id: "",
        port: proxy.port,
        username: proxy.username,
        password: proxy.password,
        status: "active",
      });
    }
    return res.status(200).json({ message: "Proxies added successfully",error:error });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

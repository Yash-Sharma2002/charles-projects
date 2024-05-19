import { Collection, Db } from "mongodb";
import { Request, Response, urlencoded } from "express";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";
import dotenv from "dotenv";
import axios from "axios";
import { v4 } from "uuid";
import url from "url";
import { closeConn } from "../connection/closeConn";

dotenv.config({ path: "../data.env" });

export async function connectLinkedIn(req: Request, res: Response) {
  const {
    country,
    use_custom_proxy,
    isDomain,
    custom_proxy_server,
    custom_proxy_port,
    custom_proxy_username,
    custom_proxy_password,
    timezone,
    from_hour,
    to_hour,
    linkedin_username,
    linkedin_password,
    uid,
    session,
    access_token,
    workspace_id,
  } = req.body;

  try {
    if (linkedin_password === undefined || linkedin_password === "") {
      return res.status(400).json({ message: "LinkedIn Password is Reguired" });
    }
    if (linkedin_username === undefined || linkedin_username === "") {
      return res.status(400).json({ message: "LinkedIn Username is Reguired" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token is Reguired" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session is Reguired" });
    }
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User is Reguired" });
    }
    if (timezone === undefined || timezone === "") {
      return res.status(400).json({ message: "Timezone is Reguired" });
    }
    if (from_hour === undefined || from_hour === "") {
      return res.status(400).json({ message: "From Hour is Reguired" });
    }
    if (to_hour === undefined || to_hour === "") {
      return res.status(400).json({ message: "To Hour is Reguired" });
    }
    if (workspace_id === undefined || workspace_id === "") {
      return res.status(400).json({ message: "Workspace is Reguired" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(access_token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("linkedin-accounts");
    const proxiesCollection: Collection = db.collection("proxies");
    const cookies: Collection = db.collection("linkedin-cookies");

    const prevData = await collection.findOne({
      uid: uid,
      linkedin_username: linkedin_username,
      workspace_id: workspace_id,
    });
    if (prevData) {
      return res.status(400).json({ message: "Account Already Connected" });
    }

    let proxy;

    if (!use_custom_proxy) {
      proxy = await proxiesCollection.findOne({
        account_id: "",
        status: "active",
      });
    } else {
      let check = await proxiesCollection.findOne({
        ip: custom_proxy_server,
        port: custom_proxy_port,
        username: custom_proxy_username,
        password: custom_proxy_password,
      });
      if (check) {
        if (check!.account_id) {
          closeConn(conn);
          return res.status(400).json({ message: "Proxy Already Occuppied" });
        }

        proxy = {
          ip: check.ip,
          port: check.port,
          username: check.username,
          password: check.password,
          proxy_id: v4(),
        };
      } else {
        proxy = {
          ip: custom_proxy_server,
          port: custom_proxy_port,
          username: custom_proxy_username,
          password: custom_proxy_password,
          proxy_id: v4(),
        };
      }
    }

    const account_id = v4();
    const proxy_id = v4();

    const params = {
      email: linkedin_username,
      password: linkedin_password,
      proxy_address: proxy!.ip,
      proxy_port: proxy!.port,
      proxy_username: proxy!.username,
      proxy_password: proxy!.password,
    };

    let data;
    try {
      data = await axios
        .get(
          process.env.REACT_APP_API_URL +
            "/login?" +
            new URLSearchParams(params)
        )
        .then((res) => res.data);
    } catch (e) {
      closeConn(conn);
      return res.status(500).json({ message: "Invalid Proxy" });
    }

    if (data.codeFlag !== undefined) {
      if (!use_custom_proxy) {
        await proxiesCollection.updateOne(
          { proxy_id: proxy!.proxy_id },
          { $set: { account_id: account_id } }
        );
      } else {
        await proxiesCollection.insertOne({
          ip: custom_proxy_server,
          proxy_id: proxy_id,
          account_id: account_id,
          port: custom_proxy_port,
          username: custom_proxy_username,
          password: custom_proxy_password,
          status: "active",
        });
      }
      if (data.codeFlag) {
        await collection.insertOne({
          account_id: account_id,
          country: country,
          use_custom_proxy: use_custom_proxy,
          isDomain: isDomain,
          custom_proxy_server: custom_proxy_server,
          custom_proxy_port: custom_proxy_port,
          username: custom_proxy_username,
          password: custom_proxy_password,
          timezone: timezone,
          from_hour: from_hour,
          to_hour: from_hour,
          linkedin_username: linkedin_username,
          linkedin_password: linkedin_password,
          uid: uid,
          session: data.session,
          otpVerified: data.codeFlag,
          workspace_id: workspace_id,
        });
      } else {
        await collection.insertOne({
          account_id: account_id,
          country: country,
          use_custom_proxy: use_custom_proxy,
          isDomain: isDomain,
          custom_proxy_server: custom_proxy_server,
          custom_proxy_port: custom_proxy_port,
          username: custom_proxy_username,
          password: custom_proxy_password,
          timezone: timezone,
          from_hour: from_hour,
          to_hour: from_hour,
          linkedin_username: linkedin_username,
          linkedin_password: linkedin_password,
          uid: uid,
          session: data.session,
          otpVerified: "true",
          workspace_id: workspace_id,
        });

        let cookiesData = await cookies.findOne({
          account_id: account_id,
          uid: uid,
        });

        if (cookiesData) {
          await cookies.updateOne(
            {
              account_id: account_id,
              uid: uid,
            },
            {
              $set: {
                account_id: account_id,
                uid: uid,
                cookies: data.cookies,
                expires: data.expire,
              },
            }
          );
        } else {
          await cookies.insertOne({
            account_id: account_id,
            uid: uid,
            cookies: data.cookies,
            expires: data.expire,
          });
        }
      }
    }
    closeConn(conn);
    return res.status(200).json({
      message: data.codeFlag ? "OTP Required" : "Connected",
      account_id: account_id,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}

export async function linkedinOTPVerify(req: Request, res: Response) {
  const { otp, uid, access_token, session, account_id, workspace_id } =
    req.body;

  try {
    if (otp === undefined || otp === "") {
      return res.status(400).json({ message: "OTP is Reguired" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token is Reguired" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session is Reguired" });
    }
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User is Reguired" });
    }
    if (account_id === undefined || account_id === "") {
      return res.status(400).json({ message: "Account is Reguired" });
    }
    if (workspace_id === undefined || workspace_id === "") {
      return res.status(400).json({ message: "Workspace is Reguired" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(access_token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("linkedin-accounts");
    const cookies: Collection = db.collection("linkedin-cookies");

    const data = await collection.findOne(
      { uid: uid, account_id: account_id, workspace_id: workspace_id },
      { projection: { session: 1 } }
    );



    const data1 = await axios
      .get(
        process.env.REACT_APP_API_URL +
          "/verifyCode?" +
          new URLSearchParams({ session_id: data!.session, code: otp })
      )
      .then((res) => res.data);


    if (data1.message) {
      await collection.updateOne(
        { uid: uid, account_id: account_id, workspace_id: workspace_id },
        { $set: { otpVerified: true } }
      );

      const cookiesData = await cookies.findOne({
        account_id: account_id,
        uid: uid,
      });

      if (cookiesData) {
        await cookies.updateOne(
          {
            account_id: account_id,
            uid: uid,
          },
          {
            $set: {
              account_id: account_id,
              uid: uid,
              cookies: data1.cookies,
              expires: data1.expire,
            },
          }
        );
      } else {
        await cookies.insertOne({
          account_id: account_id,
          uid: uid,
          cookies: data1.cookies,
          expires: data1.expire,
        });
      }

      closeConn(conn);
      return res.status(200).json({ message: "OTP Verified" });
    }
    closeConn(conn);
    return res.status(400).json({ message: "Invalid User" });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}

export async function getLinkedinAccounts(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const workspace_id = req.query.workspace_id as string;

  try {
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token is Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session is Required" });
    }
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User is Required" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(access_token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("linkedin-accounts");

    const data = await collection
      .find({ uid: uid, workspace_id: workspace_id })
      .toArray();

    closeConn(conn);
    return res.status(200).json({
      message: "Accounts",
      data: data,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}

export async function addCookies(req: Request, res: Response) {
  const { cookies, account_id, uid } = req.body;
  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User is Required" });
    }
    if (account_id === undefined || account_id === "") {
      return res.status(400).json({ message: "Account is Required" });
    }

    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("linkedin-cookies");
    const accounts: Collection = db.collection("linkedin-accounts");

    const data = await collection.findOne({ account_id: account_id, uid: uid });
    if (data) {
      await collection.updateOne(
        { account_id: account_id, uid: uid },
        {
          $set: {
            cookies: cookies,
            expires: null,
          },
        }
      );
    } else {
      await collection.insertOne({
        account_id: account_id,
        uid: uid,
        cookies: cookies,
        expires: null,
      });
    }

    await accounts.updateOne(
      { account_id: account_id, uid: uid },
      { $set: { otpVerified: true } }
    );

    closeConn(conn);
    return res.status(200).json({ message: "Cookies Added" });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}


export async function deleteCookies(req: Request, res: Response) {
  const access_token = req.query.access_token as string;
  const session = req.query.session as string;
  const uid = req.query.uid as string;
  const account_id = req.query.account_id as string;

  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User is Required" });
    }
    if (account_id === undefined || account_id === "") {
      return res.status(400).json({ message: "Account is Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session is Required" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token is Required" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(access_token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }


    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("linkedin-cookies");
    const linkedinAccounts: Collection = db.collection("linkedin-accounts");

    const data = await collection.findOne({ account_id: account_id, uid: uid });
    if (data) {
      await collection.deleteOne({ account_id: account_id, uid: uid });
      await linkedinAccounts.updateOne({ account_id: account_id, uid: uid }, { $set: { otpVerified: false } });
    }
    closeConn(conn);
    return res.status(200).json({ message: "Cookies Deleted" });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}

export async function deleteLinkedinAccount(req: Request, res: Response) {

  const account_id = req.query.account_id as string;
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;

  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User is Required" });
    }
    if (account_id === undefined || account_id === "") {
      return res.status(400).json({ message: "Account is Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session is Required" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token is Required" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(access_token);
    if (tokenErr !== "") {
      return res.status(400).json({ message: tokenErr });
    }

    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const collection: Collection = db.collection("linkedin-accounts");
    const cookies: Collection = db.collection("linkedin-cookies");

    const data = await collection.findOne({ account_id: account_id, uid: uid });
    if (data) {
      await collection.deleteOne({ account_id: account_id, uid: uid });
      await cookies.deleteOne({ account_id: account_id, uid: uid });
    }
    closeConn(conn);
    return res.status(200).json({ message: "Account Deleted" });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}
import { Collection, Db } from "mongodb";
import { Request, Response } from "express";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";
import { v4 } from "uuid";
import axios from "axios";

import dotenv from "dotenv";
import { closeConn } from "../connection/closeConn";

dotenv.config({ path: "../data.env" });

export async function saveDraftCampaigns(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const workspace_id = req.query.workspace_id as string;

  const {
    name,
    searchItems,
    steps,
    selectedLinkedinAccount,
    extras,
    campType,
  } = req.body;

  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User Id Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session Required" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token Required" });
    }
    if (workspace_id === undefined || workspace_id === "") {
      return res.status(400).json({ message: "Workspace Id Required" });
    }
    if (name === undefined || name === "") {
      return res.status(400).json({ message: "Campign Name Required" });
    }
    if (
      selectedLinkedinAccount === undefined ||
      selectedLinkedinAccount === ""
    ) {
      return res.status(400).json({ message: "Search Items Required" });
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

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const campaignsCollection: Collection = db.collection("campaigns");
    const sessionCollection: Collection = db.collection("sessions");

    const campaign_id = v4();

    const newCampaign = {
      campaign_id,
      name,
      searchItems: JSON.parse(searchItems),
      steps: JSON.parse(steps),
      selectedLinkedinAccount,
      workspace_id,
      uid,
      campType,
      extras: JSON.parse(extras),
      status: "draft",
      progress: 0,
      connected_people: 0,
      liked: 0,
      message_send: 0,
      immail_sent:0
    };

    await campaignsCollection.insertOne(newCampaign);

    await sessionCollection.insertOne({
      activity: "Campaign saved",
      uid,
      session,
      created_at: new Date(),
    });

    closeConn(conn);

    res
      .status(200)
      .json({ message: "Campaign saved successfully", data: newCampaign });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCampaigns(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const workspace_id = req.query.workspace_id as string;

  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User Id Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session Required" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token Required" });
    }
    if (workspace_id === undefined || workspace_id === "") {
      return res.status(400).json({ message: "Workspace Id Required" });
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

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const campaignsCollection: Collection = db.collection("campaigns");

    const campaigns = await campaignsCollection
      .find({ uid, workspace_id })
      .toArray();

    closeConn(conn);

    res.status(200).json({ data: campaigns });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteCampaign(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const workspace_id = req.query.workspace_id as string;
  const campaign_id = req.query.campaign_id as string;

  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User Id Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session Required" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token Required" });
    }
    if (workspace_id === undefined || workspace_id === "") {
      return res.status(400).json({ message: "Workspace Id Required" });
    }
    if (campaign_id === undefined || campaign_id === "") {
      return res.status(400).json({ message: "Campaign Id Required" });
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

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const campaignsCollection: Collection = db.collection("campaigns");
    const sessionCollection: Collection = db.collection("sessions");

    await campaignsCollection.deleteOne({ uid, workspace_id, campaign_id });

    await sessionCollection.insertOne({
      activity: "Campaign deleted",
      uid,
      session,
      created_at: new Date(),
    });

    closeConn(conn);

    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function startCampaign(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const workspace_id = req.query.workspace_id as string;

  const {
    name,
    searchItems,
    steps,
    selectedLinkedinAccount,
    extras,
    campType,
  } = req.body;

  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User Id Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session Required" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token Required" });
    }
    if (workspace_id === undefined || workspace_id === "") {
      return res.status(400).json({ message: "Workspace Id Required" });
    }
    if (name === undefined || name === "") {
      return res.status(400).json({ message: "Campign Name Required" });
    }
    if (
      selectedLinkedinAccount === undefined ||
      selectedLinkedinAccount === ""
    ) {
      return res.status(400).json({ message: "Search Items Required" });
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

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const campaignsCollection: Collection = db.collection("campaigns");
    const sessionCollection: Collection = db.collection("sessions");
    const linkedinAccountsCollection: Collection =
      db.collection("linkedin-accounts");
    const linkedInCookiesCollection: Collection =
      db.collection("linkedin-cookies");
    const proxiesCollection: Collection = db.collection("proxies");

    const campaign = await campaignsCollection.findOne({
      name: name,
      uid: uid,
      workspace_id: workspace_id,
    });

    if (campaign) {
      closeConn(conn);

      return res
        .status(200)
        .json({ message: "Campaign with same name already exits" });
    }

    const proxies = await proxiesCollection.findOne({
      account_id: selectedLinkedinAccount,
    });
    const cookies = await linkedInCookiesCollection.findOne({
      account_id: selectedLinkedinAccount,
      uid: uid,
    });

    if (!cookies) {
      closeConn(conn);

      return res
        .status(200)
        .json({ message: "Linkedin account not connected" });
    }

    if (!proxies) {
      closeConn(conn);
      return res.status(200).json({ message: "Proxies not added" });
    }

    let data = await axios
      .post(
        process.env.REACT_APP_API_URL +
          "/openexisting?" +
          new URLSearchParams({
            proxy_address: proxies.ip,
            proxy_port: proxies.port,
            proxy_username: proxies.username,
            proxy_password: proxies.password,
          }),
        { cookies: cookies.cookies }
      )
      .then((res) => res.data);

    if (data.session) {
      await linkedinAccountsCollection.updateOne(
        { uid, account_id: selectedLinkedinAccount },
        { $set: { session: data.session } }
      );

      const campaign_id = v4();

      const newCampaign = {
        campaign_id,
        name,
        searchItems: JSON.parse(searchItems),
        steps: JSON.parse(steps),
        selectedLinkedinAccount,
        workspace_id,
        uid,
        campType,
        extras: JSON.parse(extras),
        status: "running",
        progress: 0,
        connected_people: 0,
        liked: 0,
        message_send: 0,
        immail_sent:0
      };

      await campaignsCollection.insertOne(newCampaign);

      await sessionCollection.insertOne({
        activity: "Campaign started",
        uid,
        session,
        created_at: new Date(),
      });
      closeConn(conn);

      batchJobApiForCampaigns(campaign_id, data.session);
      return res.status(200).json({ message: "Campaign started successfully" });
    }
    closeConn(conn);

    return res.status(200).json({ message: "Something went Wrong" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

export async function reRunCampaign(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const campaign_id = req.query.campaign_id as string;

  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User Id Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session Required" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token Required" });
    }
    if (campaign_id === undefined || campaign_id === "") {
      return res.status(400).json({ message: "Campaign Id Required" });
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

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const fetchedResultCollection: Collection =
      db.collection("fetched-results");

    const campaignsCollection: Collection = db.collection("campaigns");
    const linkedinAccountsCollection: Collection =
      db.collection("linkedin-accounts");
    const linkedInCookiesCollection: Collection =
      db.collection("linkedin-cookies");
    const proxiesCollection: Collection = db.collection("proxies");

    const campaign = await campaignsCollection.findOne({
      campaign_id: campaign_id,
    });

    if (campaign === null) {
      closeConn(conn);
      return res.status(400).json({ message: "Campaign not found" });
    }

    if (campaign.status === "running") {
      closeConn(conn);
      return res.status(400).json({ message: "Campaign already running" });
    }

    const proxies = await proxiesCollection.findOne({
      account_id: campaign.selectedLinkedinAccount,
    });
    const cookies = await linkedInCookiesCollection.findOne({
      account_id: campaign.selectedLinkedinAccount,
      uid: uid,
    });

    let data = await axios
      .post(
        process.env.REACT_APP_API_URL +
          "/openexisting?" +
          new URLSearchParams({
            proxy_address: proxies!.ip,
            proxy_port: proxies!.port,
            proxy_username: proxies!.username,
            proxy_password: proxies!.password,
          }),
        { cookies: cookies!.cookies }
      )
      .then((res) => res.data);

    if (data.session) {
      await campaignsCollection.updateOne(
        { campaign_id },
        {
          $set: {
            status: "running",
            progress: 0,
            connected_people: 0,
            liked: 0,
            message_send: 0,
            immail_sent:0
          },
        }
      );

      await fetchedResultCollection.deleteOne({ campaign_id });

      batchJobApiForCampaigns(campaign!.campaign_id, data.session);
      closeConn(conn);
      return res.status(200).json({ message: "Campaign started successfully" });
    }
    closeConn(conn);
    return res.status(400).json({ message: "Something went wrong" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCampaignResults(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const campaign_id = req.query.campaign_id as string;

  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User Id Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session Required" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token Required" });
    }
    if (campaign_id === undefined || campaign_id === "") {
      return res.status(400).json({ message: "Campaign Id Required" });
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

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const fetchedResultCollection: Collection =
      db.collection("fetched-results");

    const results = await fetchedResultCollection.findOne({ campaign_id });

    closeConn(conn);
    res.status(200).json({ data: results });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllCampaignDataofWorksapce(
  req: Request,
  res: Response
) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const workspace_id = req.query.workspace_id as string;

  try {
    if (uid === undefined || uid === "") {
      return res.status(400).json({ message: "User Id Required" });
    }
    if (session === undefined || session === "") {
      return res.status(400).json({ message: "Session Required" });
    }
    if (access_token === undefined || access_token === "") {
      return res.status(400).json({ message: "Access Token Required" });
    }
    if (workspace_id === undefined || workspace_id === "") {
      return res.status(400).json({ message: "Workspace Id Required" });
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

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const campaignsCollection: Collection = db.collection("campaigns");
    const fetchedResultCollection: Collection =
      db.collection("fetched-results");

    const campaigns = await campaignsCollection
      .find(
        { uid, workspace_id },
        {
          projection: {
            _id: 0,
            name: 1,
            status: 1,
            progress: 1,
            campaign_id: 1,
            connected_people: 1,
            liked: 1,
            message_send: 1,
            immail_sent:1
          },
        }
      )
      .toArray();

    let allResults: any = [];

    for (let i = 0; i < campaigns.length; i++) {
      const results = await fetchedResultCollection.findOne(
        {
          campaign_id: campaigns[i].campaign_id,
        },
        { projection: { results: 1, _id: 0 } }
      );
      let data = {
        campaign: campaigns[i],
        results: results === null ? [] : results.results,
      };

      allResults.push(data);
    }

    closeConn(conn);

    res.status(200).json({ data: allResults });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function batchJobApiForCampaigns(campaign_id: string, session: string) {
  try {
    let data = await axios
      .get(
        process.env.REACT_APP_API_URL +
          "/start?" +
          new URLSearchParams({
            campaignid: campaign_id,
            session_id: session,
          })
      )
      .then((res) => res.data);
  } catch (err) {
    console.log(err);
  }
}

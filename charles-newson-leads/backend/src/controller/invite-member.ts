import { Collection, Db } from "mongodb";
import { Request, Response } from "express";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";
import dotenv from "dotenv";
import emailValidate from "../functions/validations/email";
import { closeConn } from "../connection/closeConn";

dotenv.config();

export async function inviteMember(req: Request, res: Response) {
  const { organisation_id, email, uid, session, access_token } = req.body;

  try {
    if (organisation_id === undefined) {
      return res.status(400).json({ message: "Organisation id required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (access_token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }

    let errors: any = emailValidate(email);
    if (errors.valid === false) {
      return res.status(400).json({ message: errors.errors.email });
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
    const usersCollection: Collection = db.collection("users");
    const invitationsCollection: Collection = db.collection("invitations");
    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );

    // check if user exists
    const user = await usersCollection.findOne({ email: email });
    if (user !== null) {
      closeConn(conn);
      return res.status(400).json({ message: "User already exists" });
    }

    // checkif already invited
    const invitation = await invitationsCollection.findOne({
      organisation_id: organisation_id,
      email: email,
    });
    if (invitation !== null) {
      closeConn(conn);
      return res.status(400).json({ message: "User already invited" });
    }

    // check if user is already in organisation
    const userOrg = await UserOrganisationMappingCollection.findOne({
      email: email,
    });
    if (userOrg !== null) {
      closeConn(conn);
      return res.status(400).json({ message: "User already in organisation" });
    }

    await invitationsCollection.insertOne({
      organisation_id: organisation_id,
      email: email,
      status: "pending",
      created: new Date(),
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    const url = `${process.env.FRONTEND_URL}/invite/organisation/${organisation_id}/email/${email}`;

    closeConn(conn);
    return res.status(200).json({ message: "User Invited", url: url });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

export async function addMemberToWorkspace(req: Request, res: Response) {
  const { workspace_id, email, uid, session, access_token } = req.body;

  try {
    if (workspace_id === undefined) {
      return res.status(400).json({ message: "Workspace id required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (access_token === undefined) {
      return res.status(400).json({ message: "Token required" });
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
    const usersCollection: Collection = db.collection("users");
    const WorkspaceOrganisationMappingCollection: Collection = db.collection(
      "workspace_organisation_mapping"
    );

    // cheeck if workspace exists
    const workspace = await WorkspaceOrganisationMappingCollection.findOne({
      workspace_id: workspace_id,
    });
    if (workspace === null) {
      closeConn(conn);
      return res.status(400).json({ message: "Workspace does not exist" });
    }

    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );
    const UserWorkspaceMappingCollection: Collection = db.collection(
      "user_workspace_mapping"
    );

    // check for rights
    let existUser = await UserOrganisationMappingCollection.findOne(
      { user_id: uid },
      { projection: { role: 1 } }
    );
    if (existUser === null) {
      closeConn(conn);
      return res.status(400).json({ message: "User does not exist" });
    }
    if (existUser.role !== "admin") {
      closeConn(conn);
      return res.status(400).json({ message: "User does not have rights" });
    }

    existUser = await UserWorkspaceMappingCollection.findOne(
      { user_id: uid },
      { projection: { role: 1 } }
    );
    if (existUser === null) {
      closeConn(conn);
      return res.status(400).json({ message: "User does not exist" });
    }
    if (existUser.role !== "admin") {
      closeConn(conn);
      return res.status(400).json({ message: "User does not have rights" });
    }

    // check if user exists
    const user = await usersCollection.findOne({ email: email });
    if (user === null) {
      closeConn(conn);
      return res.status(400).json({ message: "User does not exist" });
    }

    // check if user is already in workspace
    const userWorkspace = await UserWorkspaceMappingCollection.findOne({
      user_id: user.uid,
      workspace_id: workspace_id,
    });
    if (userWorkspace !== null) {
      closeConn(conn);
      return res.status(400).json({ message: "User already in workspace" });
    }

    await UserWorkspaceMappingCollection.insertOne({
      user_id: user.uid,
      workspace_id: workspace_id,
      status: "active",
      created: new Date(),
    });

    closeConn(conn);
    return res.status(200).json({ message: "User added to workspace" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

export async function removeMemberFromWorkspace(req: Request, res: Response) {
  const { workspace_id, email, uid, session, access_token } = req.body;

  try {
    if (workspace_id === undefined) {
      return res.status(400).json({ message: "Workspace id required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (access_token === undefined) {
      return res.status(400).json({ message: "Token required" });
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
    const usersCollection: Collection = db.collection("users");
    const WorkspaceOrganisationMappingCollection: Collection = db.collection(
      "workspace_organisation_mapping"
    );

    // cheeck if workspace exists
    const workspace = await WorkspaceOrganisationMappingCollection.findOne({
      workspace_id: workspace_id,
    });
    if (workspace === null) {
      return res.status(400).json({ message: "Workspace does not exist" });
    }

    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );
    const UserWorkspaceMappingCollection: Collection = db.collection(
      "user_workspace_mapping"
    );

    // check for rights
    let existUser = await UserOrganisationMappingCollection.findOne(
      { user_id: uid },
      { projection: { role: 1 } }
    );
    if (existUser === null) {
      closeConn(conn);
      return res.status(400).json({ message: "User does not exist" });
    }
    if (existUser.role !== "admin") {
      closeConn(conn);
      return res.status(400).json({ message: "User does not have rights" });
    }

    existUser = await UserWorkspaceMappingCollection.findOne(
      { user_id: uid },
      { projection: { role: 1 } }
    );

    if (existUser === null) {
      closeConn(conn);
      return res.status(400).json({ message: "User does not exist" });
    }

    if (existUser.role !== "admin") {
      closeConn(conn);
      return res.status(400).json({ message: "User does not have rights" });
    }

    // check if user exists
    const user = await usersCollection.findOne({ email: email });
    if (user === null) {
      closeConn(conn);
      return res.status(400).json({ message: "User does not exist" });
    }

    // check if user is already in workspace
    const userWorkspace = await UserWorkspaceMappingCollection.findOne({
      user_id: user.uid,
      workspace_id: workspace_id,
    });
    if (userWorkspace === null) {
      closeConn(conn);
      return res.status(400).json({ message: "User not in workspace" });
    }

    await UserWorkspaceMappingCollection.deleteOne({
      user_id: user.uid,
      workspace_id: workspace_id,
    });

    closeConn(conn);
    return res.status(200).json({ message: "User removed from workspace" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

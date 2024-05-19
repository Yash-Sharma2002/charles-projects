import { Request, Response } from "express";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import ConnectionRes from "../interface/ConnectionRes";
import { hash, validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";
import { ObjectId } from "mongodb";

export async function updateUser(req: Request, res: Response) {
  const session = req.body.session as string;
  const uid = req.body.uid as string;
  const userId = req.body.userId as string;
  const token = req.body.access_token as string;
  const name = req.body.name as string;
  const username = req.body.username as string;
  const email = req.body.email as string;
  const role = req.body.role as string;
  const status = req.body.status as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (userId === undefined) {
      return res.status(400).json({ message: "User id required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }
    if (name === undefined) {
      return res.status(400).json({ message: "Name required" });
    }
    if (username === undefined) {
      return res.status(400).json({ message: "Username required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (role === undefined) {
      return res.status(400).json({ message: "Role required" });
    }
    if (status === undefined) {
      return res.status(400).json({ message: "Status required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const usersCollection: Collection = db.collection("users");
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

    let tempUser = await usersCollection.findOne({ uid: userId });
    if (!tempUser) {
      return res.status(400).json({ message: "User not found" });
    }

    tempUser = await usersCollection.findOne(
      { username: username },
      { projection: { username: 1, uid: 1 } }
    );
    if (
      tempUser !== null &&
      tempUser!.username === username &&
      tempUser.uid !== userId
    ) {
      return res.status(400).json({ message: "Username already taken" });
    }

    tempUser = await usersCollection.findOne(
      { email: email },
      { projection: { email: 1, uid: 1 } }
    );
    if (
      tempUser !== null &&
      tempUser.email === email &&
      tempUser.uid !== userId
    ) {
      return res.status(400).json({ message: "Email already taken" });
    }

    // insert session
    await sessionCollection.insertOne({
      activity: "update-user",
      session: session,
      uid: uid,
      created: new Date(),
    });

    let user = await usersCollection.findOne({ uid: userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    let updatedUser = await usersCollection.updateOne(
      { uid: userId },
      {
        $set: {
          name: name,
          username: username,
          email: email,
          role: role,
          status: status,
        },
      }
    );

    return res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const session = req.query.session as string;
  const uid = req.query.uid as string;
  const userId = req.query.userId as string;
  const token = req.query.access_token as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (userId === undefined) {
      return res.status(400).json({ message: "User id required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(token);
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
    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );
    const UserWorkspaceMappingCollection: Collection = db.collection(
      "user_workspace_mapping"
    );
    const sessionCollection: Collection = db.collection("sessions");

    let userOrgMapping = await UserOrganisationMappingCollection.findOne(
      { user_id: userId },
      {
        projection: { role: 1 },
      }
    );

    if (userOrgMapping !== null && userOrgMapping.role === "admin") {
      return res.status(400).json({ message: "Admin cannot be deleted" });
    }

    userOrgMapping = await UserOrganisationMappingCollection.findOne(
      { user_id: uid },
      {
        projection: { role: 1 },
      }
    );
    if (userOrgMapping === null || userOrgMapping.role !== "admin") {
      return res.status(400).json({ message: "Only admin can delete user" });
    }

    // insert session
    await sessionCollection.insertOne({
      activity: "delete-user",
      session: session,
      uid: uid,
      created: new Date(),
    });

    let user = await usersCollection.findOne({ uid: userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await usersCollection.deleteOne({ uid: userId });
    await UserOrganisationMappingCollection.deleteMany({ user_id: userId });
    await UserWorkspaceMappingCollection.deleteMany({ user_id: userId });

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}

export async function deleteUserWorkspace(req: Request, res: Response) {
  const session = req.query.session as string;
  const uid = req.query.uid as string;
  const userId = req.query.userId as string;
  const workspaceId = req.query.workspace_id as string;
  const token = req.query.access_token as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (userId === undefined) {
      return res.status(400).json({ message: "User id required" });
    }
    if (workspaceId === undefined) {
      return res.status(400).json({ message: "Workspace id required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(token);
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
    const UserWorkspaceMappingCollection: Collection = db.collection(
      "user_workspace_mapping"
    );
    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );
    const sessionCollection: Collection = db.collection("sessions");

    let userOrgMapping = await UserOrganisationMappingCollection.findOne(
      { user_id: userId },
      {
        projection: { role: 1 },
      }
    );

    if (userOrgMapping !== null && userOrgMapping.role === "admin") {
      return res.status(400).json({ message: "Admin cannot be deleted" });
    }

    userOrgMapping = await UserOrganisationMappingCollection.findOne(
      { user_id: uid },
      {
        projection: { role: 1 },
      }
    );
    if (userOrgMapping === null || userOrgMapping.role !== "admin") {
      return res.status(400).json({ message: "Only admin can delete user" });
    }

    userOrgMapping = await UserWorkspaceMappingCollection.findOne({
      user_id: userId,
      workspace_id: workspaceId,
    });
    if (userOrgMapping !== null && userOrgMapping.role === "admin") {
      return res.status(400).json({ message: "Admin cannot be deleted" });
    }

    userOrgMapping = await UserWorkspaceMappingCollection.findOne({
      user_id: uid,
      workspace_id: workspaceId,
    });
    if (userOrgMapping === null || userOrgMapping.role !== "admin") {
      return res.status(400).json({ message: "Only admin can delete user" });
    }

    // insert session
    await sessionCollection.insertOne({
      activity: "delete-user-workspace",
      session: session,
      uid: uid,
      created: new Date(),
    });

    let user = await UserWorkspaceMappingCollection.findOne({
      user_id: userId,
      workspace_id: workspaceId,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await UserWorkspaceMappingCollection.deleteOne({
      user_id: userId,
      workspace_id: workspaceId,
    });

    return res.status(200).json({ message: "User deleted from workspace" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}

export async function updatePassword(req: Request, res: Response) {
  const session = req.body.session as string;
  const id = req.body.id as string;
  const token = req.body.access_token as string;
  const password = req.body.password as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (id === undefined) {
      return res.status(400).json({ message: "Uid required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }
    if (password === undefined) {
      return res.status(400).json({ message: "Password required" });
    }

    // check session
    let sessionBool = validateSession(session);
    if (sessionBool) {
      return res.status(400).json({ message: "Invalid session" });
    }

    let tokenErr = validateToken(token);
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
    const sessionCollection: Collection = db.collection("sessions");

    let user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const updatedUser = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          password: hash(password),
        },
      }
    );

    // insert session
    await sessionCollection.insertOne({
      activity: "update-password",
      session: session,
      uid: new ObjectId(id),
      created: new Date(),
    });

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unknown error" });
  }
}

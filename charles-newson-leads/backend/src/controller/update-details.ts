import { Collection, Db } from "mongodb";
import { Request, Response } from "express";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";

export async function updateUserDetails(req: Request, res: Response) {
  const session = req.body.session as string;
  const uid = req.body.uid as string;
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
      // validate session
      const validSession = validateSession(session);
      if (!validSession) {
        return res.status(400).json({ message: "Invalid session" });
      }
  
      // validate token
      const validToken = validateToken(token);
      if (!validToken) {
        return res.status(400).json({ message: "Invalid token" });
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

  
    await sessionCollection.insertOne({
      session: session,
      uid: uid,
      token: token,
      created: new Date(),
    });

    // update user
    const update = await usersCollection.updateOne(
      { uid: uid },
      {
        $set: {
          name: name,
          username: username,
          email: email,
          role: role,
          status: status,
          modified: new Date(),
        },
      }
    );

    if (update.modifiedCount === 0) {
      return res.status(400).json({ message: "User not updated" });
    }

    return res.status(200).json({ message: "User updated" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateAddress(req: Request, res: Response) {
  const session = req.body.session as string;
  const relation_id = req.body.relation_id as string;
  const token = req.body.access_token as string;
  const addressline1 = req.body.addressline1 as string;
  const addressline2 = req.body.addressline2 as string;
  const city = req.body.city as string;
  const state = req.body.state as string;
  const country = req.body.country as string;
  const postal_code = req.body.zip as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }
    if (addressline1 === undefined || addressline2 === undefined) {
      return res.status(400).json({ message: "Address line is required" });
    }
    if (city === undefined) {
      return res.status(400).json({ message: "City required" });
    }
    if (state === undefined) {
      return res.status(400).json({ message: "State required" });
    }
    if (country === undefined) {
      return res.status(400).json({ message: "Country required" });
    }
    if (postal_code === undefined) {
      return res.status(400).json({ message: "Zip required" });
    }
    if (relation_id === undefined) {
      return res.status(400).json({ message: "User id required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const addressCollection: Collection = db.collection("addresses");

    // validate session
    const validSession = validateSession(session);
    if (!validSession) {
      return res.status(400).json({ message: "Invalid session" });
    }

    // validate token
    const validToken = validateToken(token);
    if (!validToken) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // update user
    const update = await addressCollection.updateOne(
      { relation_id: relation_id },
      {
        $set: {
          addressline1: addressline1,
          addressline2: addressline2,
          city: city,
          state: state,
          country: country,
          postal_code: postal_code,
          modified: new Date(),
        },
      }
    );

    if (update.modifiedCount === 0) {
      return res.status(400).json({ message: "Address not updated" });
    }

    return res.status(200).json({ message: "Address updated" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateOrganizationAddress(req: Request, res: Response) {
  const uid = req.body.uid as string;
  const session = req.body.session as string;
  const relation_id = req.body.relation_id as string;
  const token = req.body.access_token as string;
  const addressline1 = req.body.addressline1 as string;
  const addressline2 = req.body.addressline2 as string;
  const city = req.body.city as string;
  const state = req.body.state as string;
  const country = req.body.country as string;
  const postal_code = req.body.zip as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }
    if (addressline1 === undefined || addressline2 === undefined) {
      return res.status(400).json({ message: "Address line is required" });
    }
    if (city === undefined) {
      return res.status(400).json({ message: "City required" });
    }
    if (state === undefined) {
      return res.status(400).json({ message: "State required" });
    }
    if (country === undefined) {
      return res.status(400).json({ message: "Country required" });
    }
    if (postal_code === undefined) {
      return res.status(400).json({ message: "Zip required" });
    }
    if (relation_id === undefined) {
      return res.status(400).json({ message: "Organisation id required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "User id required" });
    }

    // validate session
    const validSession = validateSession(session);
    if (!validSession) {
      return res.status(400).json({ message: "Invalid session" });
    }

    // validate token
    const validToken = validateToken(token);
    if (!validToken) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const addressCollection: Collection = db.collection("addresses");
    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );

    const userOrg = await UserOrganisationMappingCollection.findOne(
      { uid: uid, organisation_id: relation_id },
      { projection: { role: 1 } }
    );

    if (userOrg === null) {
      return res
        .status(400)
        .json({ message: "User not found in the organisation" });
    }
    if (userOrg.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    const update = await addressCollection.updateOne(
      { relation_id: relation_id },
      {
        $set: {
          addressline1: addressline1,
          addressline2: addressline2,
          city: city,
          state: state,
          country: country,
          postal_code: postal_code,
          modified: new Date(),
        },
      }
    );

    if (update.modifiedCount === 0) {
      return res.status(400).json({ message: "Address not updated" });
    }

    return res.status(200).json({ message: "Address updated" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateWorkspace(req: Request, res: Response) {
  const uid = req.body.uid as string;
  const workspace_name = req.body.workspace_name as string;
  const workspace_id = req.body.workspace_id as string;
  const session = req.body.session as string;
  const token = req.body.access_token as string;
  const workspace_desc = req.body.workspace_desc as string;
  const workspace_admin = req.body.workspace_admin as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (workspace_name === undefined) {
      return res.status(400).json({ message: "Workspace name required" });
    }
    if (workspace_id === undefined) {
      return res.status(400).json({ message: "Workspace id required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }
    if (workspace_desc === undefined) {
      return res
        .status(400)
        .json({ message: "Workspace description required" });
    }
    if (workspace_admin === undefined) {
      return res.status(400).json({ message: "Workspace admin required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "User id required" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    // validate session
    const validSession = validateSession(session);
    if (!validSession) {
      return res.status(400).json({ message: "Invalid session" });
    }

    // validate token
    const validToken = validateToken(token);
    if (!validToken) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const workspaceCollection: Collection = db.collection("workspaces");
    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );
    const UserWorkSpaceMappingCollection: Collection = db.collection(
      "user_workspace_mapping"
    );

    const userOrg = await UserOrganisationMappingCollection.findOne(
      { uid: uid },
      { projection: { role: 1 } }
    );

    if (userOrg === null) {
      return res
        .status(400)
        .json({ message: "User not found in the organisation" });
    }
    if (userOrg.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    const userWorkspace = await UserWorkSpaceMappingCollection.findOne(
      { uid: uid, workspace_id: workspace_id },
      { projection: { role: 1 } }
    );

    if (userWorkspace === null) {
      return res
        .status(400)
        .json({ message: "User not found in the workspace" });
    }
    if (userWorkspace.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    // update workspace
    const update = await workspaceCollection.updateOne(
      { workspace_id: workspace_id },
      {
        $set: {
          workspace_name: workspace_name,
          workspace_desc: workspace_desc,
          workspace_admin: workspace_admin,
          modified: new Date(),
        },
      }
    );

    if (update.modifiedCount === 0) {
      return res.status(400).json({ message: "Workspace not updated" });
    }

    return res.status(200).json({ message: "Workspace updated" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateOrganization(req: Request, res: Response) {
  const uid = req.body.uid as string;
  const session = req.body.session as string;
  const token = req.body.access_token as string;
  const organisation_id = req.body.organisation_id as string;
  const organisation_desc = req.body.organisation_desc as string;
  const organisation_name = req.params.organisation_name as string;
  const organisation_logo = req.params.organisation_logo as string;
  const organisation_email = req.params.organisation_email as string;
  const organisation_phone = req.params.organisation_phone as string;
  const organisation_type = req.params.organisation_type as string;
  const organisation_website = req.params.organisation_website as string;

  try {
    if (session === undefined) {
      return res.status(400).json({ message: "Session required" });
    }
    if (organisation_name === undefined) {
      return res.status(400).json({ message: "Organisation name required" });
    }
    if (organisation_id === undefined) {
      return res.status(400).json({ message: "Organisation id required" });
    }
    if (token === undefined) {
      return res.status(400).json({ message: "Token required" });
    }
    if (organisation_desc === undefined) {
      return res
        .status(400)
        .json({ message: "Organisation description required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "User id required" });
    }

    // validate session
    const validSession = validateSession(session);
    if (!validSession) {
      return res.status(400).json({ message: "Invalid session" });
    }

    // validate token
    const validToken = validateToken(token);
    if (!validToken) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // create connection
    const connect: ConnectionRes = await connectToCluster();
    if (typeof connect.conn === "string") {
      return res.status(500).json(connect);
    }

    const conn = connect.conn;
    const db: Db = conn.db("client");
    const organisationCollection: Collection = db.collection("organisations");
    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );

    const userOrg = await UserOrganisationMappingCollection.findOne(
      { uid: uid, organisation_id: organisation_id },
      { projection: { role: 1 } }
    );

    if (userOrg === null) {
      return res
        .status(400)
        .json({ message: "User not found in the organisation" });
    }
    if (userOrg.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    // update organisation
    const update = await organisationCollection.updateOne(
      { organisation_id: organisation_id },
      {
        $set: {
          organisation_name: organisation_name,
          organisation_desc: organisation_desc,
          organisation_logo: organisation_logo,
          organisation_email: organisation_email,
          organisation_phone: organisation_phone,
          organisation_type: organisation_type,
          organisation_website: organisation_website,
          modified: new Date(),
        },
      }
    );

    if (update.modifiedCount === 0) {
      return res.status(400).json({ message: "Organisation not updated" });
    }

    return res.status(200).json({ message: "Organisation updated" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

import { Collection, Db } from "mongodb";
import { Request, Response } from "express";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";
import { closeConn } from "../connection/closeConn";

export async function getUserDetails(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;

  try {
    if (!uid || !session || !access_token) {
      return res.status(400).json({
        message: "Invalid request",
      });
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
    const collection: Collection = db.collection("users");
    const addressCollection: Collection = db.collection("addresses");
    const UserWorkSpaceMapping: Collection = db.collection(
      "user_workspace_mapping"
    );
    const UserOrganisationMapping: Collection = db.collection(
      "user_organisation_mapping"
    );

    const user = await collection.findOne({ uid: uid });

    if (!user) {
      closeConn(conn);
      return res.status(404).json({
        message: "User not found",
      });
    }
    const address = await addressCollection.findOne({ foreign_id: user.uid });

    const workspace = await UserWorkSpaceMapping.find({
      user_id: user.uid,
    }).toArray();
    const organisation = await UserOrganisationMapping.find({
      user_id: user.uid,
    }).toArray();

    let workspaces = [];
    for (let i = 0; i < workspace.length; i++) {
      const collection: Collection = db.collection("workspaces");
      const work = await collection.findOne(
        { workspace_id: workspace[i].workspace_id },
        {
          projection: {
            _id: 0,
            workspace_id: 1,
            workspace_name: 1,
            workspace_desc: 1,
            created: 1,
          },
        }
      );
      workspaces.push({
        workspace_id: work!.workspace_id,
        workspace_name: work!.workspace_name,
        workspace_desc: work!.workspace_desc,
        created: work!.created,
        role: workspace[i].role,
      });
    }

    let organisations;
    for (let i = 0; i < organisation.length; i++) {
      const collection: Collection = db.collection("organisations");
      const org = await collection.findOne(
        { organisation_id: organisation[i].organisation_id },
        {
          projection: {
            _id: 0,
            organisation_id: 1,
            organisation_name: 1,
            organisation_logo: 1,
            created: 1,
          },
        }
      );
      organisations = {
        organisation_id: org!.organisation_id,
        organisation_name: org!.organisation_name,
        organisation_logo: org!.organisation_logo,
        created: org!.created,
        role: organisation[i].role,
      };
    }
    closeConn(conn);
    return res.status(200).json({
      user: user,
      address: address,
      workspaces: workspaces,
      organisations: organisations,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getWorkspaceDetails(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;
  const workspace_id = req.query.workspace_id as string;

  try {
    if (!uid || !session || !access_token || !workspace_id) {
      return res.status(400).json({
        message: "Invalid request",
      });
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
    const collection: Collection = db.collection("workspaces");

    const workspace = await collection.findOne({ workspace_id: workspace_id });

    if (!workspace) {
      closeConn(conn);
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    closeConn(conn);
    return res.status(200).json({
      workspace: workspace,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getOrganizationDetails(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const organisation_id = req.query.organisation_id as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;

  try {
    if (!uid || !session || !access_token || !organisation_id) {
      return res.status(400).json({
        message: "Invalid request",
      });
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
    const collection: Collection = db.collection("organisations");
    const addressCollection: Collection = db.collection("addresses");

    const organization = await collection.findOne({
      organisation_id: organisation_id,
    });

    if (!organization) {
      closeConn(conn);
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    const address = await addressCollection.findOne({
      foreign_id: organization.organisation_id,
    });

    closeConn(conn);
    return res.status(200).json({
      organisation: organization,
      address: address,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getAllWorkSpacesByUserId(req: Request, res: Response) {
  const uid = req.query.uid as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;

  try {
    if (!uid || !session || !access_token) {
      return res.status(400).json({
        message: "Invalid request",
      });
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
    const UserWorkSpaceMapping: Collection = db.collection(
      "user_workspace_mapping"
    );

    const workspace = await UserWorkSpaceMapping.find({
      user_id: uid,
    }).toArray();

    const workspaces = [];
    for (let i = 0; i < workspace.length; i++) {
      const collection: Collection = db.collection("workspaces");
      const work = await collection.findOne({
        workspace_id: workspace[i].workspace_id,
      });
      workspaces.push(work);
    }

    if (!workspace) {
      closeConn(conn);
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    closeConn(conn);
    return res.status(200).json({
      workspace: workspaces,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getAllWorkSpacesByOrganisation(
  req: Request,
  res: Response
) {
  const organisation_id = req.query.organisation_id as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;

  try {
    if (!organisation_id || !session || !access_token) {
      return res.status(400).json({
        message: "Invalid request",
      });
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
    const WorkspaceOrganisationMappingCollection: Collection = db.collection(
      "workspace_organisation_mapping"
    );

    const workspace = await WorkspaceOrganisationMappingCollection.find({
      organisation_id: organisation_id,
    }).toArray();

    const workspaces = [];
    for (let i = 0; i < workspace.length; i++) {
      const collection: Collection = db.collection("workspaces");
      const work = await collection.findOne({
        workspace_id: workspace[i].workspace_id,
      });
      workspaces.push(work);
    }

    if (workspaces.length === 0) {
      closeConn(conn);
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    closeConn(conn);
    return res.status(200).json({
      workspace: workspaces,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getAllUsersByWorkspace(req: Request, res: Response) {
  const workspace_id = req.query.workspace_id as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;

  try {
    if (!workspace_id || !session || !access_token) {
      return res.status(400).json({
        message: "Invalid request",
      });
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
    const UserWorkSpaceMapping: Collection = db.collection(
      "user_workspace_mapping"
    );

    const workspace = await UserWorkSpaceMapping.find({
      workspace_id: workspace_id,
    }).toArray();

    const users = [];
    for (let i = 0; i < workspace.length; i++) {
      const collection: Collection = db.collection("users");
      const user = await collection.findOne(
        {
          uid: workspace[i].user_id,
        },
        {
          projection: {
            username: 1,
            email: 1,
            uid: 1,
            profile: 1,
            status: 1,
            created: 1,
            modified: 1,
          },
        }
      );
      users.push(user);
    }

    if (users.length === 0) {
      closeConn(conn);
      return res.status(404).json({
        message: "Users not found",
      });
    }

    closeConn(conn);
    return res.status(200).json({
      users: users,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getAllUsersByOrganisation(req: Request, res: Response) {
  const organisation_id = req.query.organisation_id as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;

  try {
    if (!organisation_id || !session || !access_token) {
      return res.status(400).json({
        message: "Invalid request",
      });
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
    const UserOrganisationMapping: Collection = db.collection(
      "user_organisation_mapping"
    );

    const organisation = await UserOrganisationMapping.find({
      organisation_id: organisation_id,
    }).toArray();

    const users = [];
    for (let i = 0; i < organisation.length; i++) {
      const collection: Collection = db.collection("users");
      const user = await collection.findOne(
        {
          uid: organisation[i].user_id,
        },
        {
          projection: {
            username: 1,
            email: 1,
            uid: 1,
            status: 1,
            created: 1,
            modified: 1,
            profile: 1,
          },
        }
      );
      users.push(user);
    }

    if (users.length === 0) {
      closeConn(conn);
      return res.status(404).json({
        message: "Users not found",
      });
    }

    closeConn(conn);
    return res.status(200).json({
      users: users,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function getAddress(req: Request, res: Response) {
  const relation_id = req.query.relation_id as string;
  const session = req.query.session as string;
  const access_token = req.query.access_token as string;

  try {
    if (!relation_id || !session || !access_token) {
      return res.status(400).json({
        message: "Invalid request",
      });
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
    const collection: Collection = db.collection("addresses");

    const address = await collection.findOne({
      foreign_id: relation_id,
    });

    if (!address) {
    closeConn(conn);
    return res.status(404).json({
        message: "Address not found",
      });
    }

    closeConn(conn);
    return res.status(200).json({
      address: address,
    });
  } catch (err) {
    console.log(err);
  }
}

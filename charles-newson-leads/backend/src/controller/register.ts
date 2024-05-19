import { v4 } from "uuid";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import { Collection, Db } from "mongodb";
import { Request, Response } from "express";
import registerValidate from "../functions/registerValidate";
import RegisterError from "../interface/RegisterError";
import User from "../interface/User";
import { createSession, hash, validateSession } from "../functions/hash";
import { createBearer, validateToken } from "../functions/bearer";
import { closeConn } from "../connection/closeConn";
import Admin from "../interface/Admin";
import Organisation from "../interface/Organisation";
import Address from "../interface/Address";
import Workspace from "../interface/Workspace";
import axios from "axios";

export async function registerAdmin(req: Request, res: Response) {
  const { username, email, password, provider } = req.body;

  try {
    if (username === undefined) {
      return res.status(400).json({ message: "Username required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
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

    // check if already exists
    const filteredDocs = await collection.find({ email: email }).toArray();
    if (filteredDocs.length > 0) {
      return res.status(400).json({
        errors: {
          message: "Email already exists",
        },
        email: email,
      });
    }

    // check for errors
    let errors: RegisterError | undefined = {} as RegisterError;
    errors = registerValidate(username, email, password).errors;
    if (errors && Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors: errors,
        message: "Invalid input(s)",
      });
    }

    // create account if everything is good
    let uidNew = v4();

    // create session
    let sessionNew = createSession();

    await sessionCollection.insertMany([
      {
        activity: "register",
        session: sessionNew,
        uid: uidNew,
        created: new Date(),
      },
    ]);

    // create generate new token
    const token = createBearer(email, uidNew, sessionNew);

    const user: Admin = {
      uid: uidNew,
      username: username,
      email: email,
      password: hash(password),
      access_token: token,
      session: sessionNew,
      status: "active",
      provider: provider,
      created: new Date(),
      modified: new Date(),
      profile: "",
    };

    await collection.insertOne(user);

    closeConn(conn);

    const tmpuser = {
      uid: uidNew,
      username: username,
      email: email,
      access_token: token,
      session: sessionNew,
    };
    res
      .status(201)
      .json({ user: tmpuser, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function registerOrganisation(req: Request, res: Response) {
  const {
    name,
    phone,
    email,
    website,
    logo,
    type,
    uid,
    session,
    access_token,
  } = req.body;

  try {
    if (name === undefined) {
      return res.status(400).json({ message: "Organisation name required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Organisation email required" });
    }
    if (phone === undefined) {
      return res.status(400).json({ message: "Organisation phone required" });
    }
    if (website === undefined) {
      return res.status(400).json({ message: "Organisation website required" });
    }
    if (logo === undefined) {
      return res.status(400).json({ message: "Organisation logo required" });
    }
    if (type === undefined) {
      return res.status(400).json({ message: "Organisation type required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "User id required" });
    }
    if (session === undefined) {
      return res.status(400).json({ message: "User session required" });
    }
    if (access_token === undefined) {
      return res.status(400).json({ message: "User access token required" });
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
    const sessionCollection: Collection = db.collection("sessions");
    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );

    // check if already exists for name and email
    let filteredDocs = await collection.findOne(
      { organisation_email: email },
      { projection: { organisation_email: 1 } }
    );

    if (filteredDocs !== null && filteredDocs !== undefined) {
      return res.status(400).json({
        errors: {
          message: "Organisation email already exists",
        },
        email: email,
      });
    }
    filteredDocs = await collection.findOne(
      { organisation_name: name },
      { projection: { organisation_name: 1 } }
    );
    if (filteredDocs !== null && filteredDocs !== undefined) {
      return res.status(400).json({
        errors: {
          message: "Organisation name already exists",
        },
        name: name,
      });
    }

    // create account if everything is good
    let organisation_id = v4();

    // create session
    let sessionNew = createSession();

    await sessionCollection.insertMany([
      {
        activity: "organisation-register",
        session: sessionNew,
        uid: uid,
        created: new Date(),
      },
    ]);

    const organisation: Organisation = {
      organisation_id: organisation_id,
      organisation_name: name,
      organisation_logo: logo,
      organisation_email: email,
      organisation_phone: phone,
      organisation_type: type,
      organisation_website: website,
      created: new Date(),
      modified: new Date(),
    };

    await collection.insertOne(organisation);

    await UserOrganisationMappingCollection.insertOne({
      user_id: uid,
      organisation_id: organisation_id,
      role: "admin",
      created: new Date(),
      modified: new Date(),
    });

    closeConn(conn);

    res.status(201).json({
      organisation: organisation,
      message: "Organisation created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function registerAddress(req: Request, res: Response) {
  const {
    uid,
    session,
    access_token,
    relation_id,
    address_line1,
    address_line2,
    city,
    state,
    country,
    postal_code,
  } = req.body;

  try {
    if (relation_id === undefined) {
      return res.status(400).json({ message: "Relation id required" });
    }
    if (address_line1 === undefined || address_line2 === undefined) {
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
      return res.status(400).json({ message: "Postal code required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "User id required" });
    }
    if (session === undefined) {
      return res.status(400).json({ message: "User session required" });
    }
    if (access_token === undefined) {
      return res.status(400).json({ message: "User access token required" });
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
    const sessionCollection: Collection = db.collection("sessions");

    // create account if everything is good
    let address_id = v4();

    await sessionCollection.insertMany([
      {
        activity: "address-register",
        session: session,
        uid: uid,
        created: new Date(),
      },
    ]);

    const address: Address = {
      address_id: address_id,
      foreign_id: relation_id,
      address_line1: address_line1,
      address_line2: address_line2,
      city: city,
      state: state,
      country: country,
      postal_code: postal_code,
      created: new Date(),
      modified: new Date(),
    };

    await collection.insertOne(address);

    closeConn(conn);

    res.status(201).json({
      address: address,
      message: "Address created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function registerMember(req: Request, res: Response) {
  const { username, email, password, provider, organisation_id } = req.body;

  try {
    if (username === undefined) {
      return res.status(400).json({ message: "Username required" });
    }
    if (email === undefined) {
      return res.status(400).json({ message: "Email required" });
    }
    if (password === undefined) {
      return res.status(400).json({ message: "Password required" });
    }
    if (provider === undefined) {
      return res.status(400).json({ message: "Provider required" });
    }
    if (organisation_id === undefined) {
      return res.status(400).json({ message: "Organisation id required" });
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
    const invitationsCollection: Collection = db.collection("invitations");
    const UserOrganisationMappingCollection: Collection = db.collection(
      "user_organisation_mapping"
    );

    // check if already exists
    const filteredDocs = await collection.find({ email: email }).toArray();
    if (filteredDocs.length > 0) {
      return res.status(400).json({
        errors: {
          message: "Email already exists",
        },
        email: email,
      });
    }

    // check for errors
    let errors: RegisterError | undefined = {} as RegisterError;
    errors = registerValidate(username, email, password).errors;
    if (errors && Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors: errors,
        message: "Invalid input(s)",
      });
    }

    // create account if everything is good
    let user_id = v4();

    // create session
    let sessionNew = createSession();

    await sessionCollection.insertMany([
      {
        activity: "register, added to organisation",
        session: sessionNew,
        uid: user_id,
        created: new Date(),
      },
    ]);

    // create generate new token
    const token = createBearer(email, user_id, sessionNew);

    const user: User = {
      uid: user_id,
      username: username,
      email: email,
      password: hash(password),
      access_token: token,
      session: sessionNew,
      provider: provider,
      status: "active",
      profile: "",
      created: new Date(),
      modified: new Date(),
    };

    await collection.insertOne(user);

    await invitationsCollection.updateOne(
      {
        email: email,
        organisation_id: organisation_id,
      },
      {
        $set: {
          status: "accepted",
          modified: new Date(),
        },
      }
    );

    await UserOrganisationMappingCollection.insertOne({
      user_id: user_id,
      organisation_id: organisation_id,
      role: "member",
      created: new Date(),
      modified: new Date(),
    });

    closeConn(conn);

    const tmpuser = {
      uid: user_id,
      username: username,
      access_token: token,
      session: sessionNew,
      role: "member",
    };
    res
      .status(201)
      .json({ user: tmpuser, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function registerWorkspace(req: Request, res: Response) {
  const {
    organisation_id,
    workspace_name,
    workspace_admin,
    workspace_desc,
    uid,
    access_token,
    session,
  } = req.body;

  try {
    if (organisation_id === undefined) {
      return res.status(400).json({ message: "Organisation id required" });
    }
    if (workspace_name === undefined || workspace_name === "") {
      return res.status(400).json({ message: "Workspace name required" });
    }
    if (workspace_admin === undefined || workspace_admin === "") {
      return res.status(400).json({ message: "Workspace admin required" });
    }
    if (uid === undefined) {
      return res.status(400).json({ message: "User id required" });
    }
    if (access_token === undefined) {
      return res.status(400).json({ message: "User access token required" });
    }
    if (session === undefined) {
      return res.status(400).json({ message: "User session required" });
    }
    if (workspace_desc === undefined || workspace_desc === "") {
      return res
        .status(400)
        .json({ message: "Workspace description required" });
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
    const sessionCollection: Collection = db.collection("sessions");
    const UserWorkSpaceMappingCollection: Collection = db.collection(
      "user_workspace_mapping"
    );
    const WorkspaceOrganisationMappingCollection: Collection = db.collection(
      "workspace_organisation_mapping"
    );

    const filteredDocs = await collection
      .find({
        workspace_name: workspace_name,
        organisation_id: organisation_id,
      })
      .toArray();
    if (filteredDocs.length > 0) {
      return res.status(400).json({
        message: "Workspace name already exists",
        workspace_name: workspace_name,
      });
    }

    // create account if everything is good
    let workspace_id = v4();

    // create session
    let sessionNew = createSession();

    await sessionCollection.insertMany([
      {
        activity: "workspace-register",
        session: sessionNew,
        uid: uid,
        created: new Date(),
      },
    ]);

    const workspace: Workspace = {
      organisation_id: organisation_id,
      workspace_name: workspace_name,
      workspace_admin: workspace_admin,
      workspace_desc: workspace_desc,
      workspace_id: workspace_id,
      created: new Date(),
      modified: new Date(),
    };

    await collection.insertOne(workspace);

    await UserWorkSpaceMappingCollection.insertOne({
      user_id: workspace_admin,
      workspace_id: workspace_id,
      role: "admin",
      created: new Date(),
      modified: new Date(),
    });

    await WorkspaceOrganisationMappingCollection.insertOne({
      organisation_id: organisation_id,
      workspace_id: workspace_id,
      created: new Date(),
      modified: new Date(),
    });

    closeConn(conn);

    res.status(201).json({
      workspace: workspace,
      message: "Workspace created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

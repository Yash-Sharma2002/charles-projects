import express from "express";
import OrganisationRouter from "../controller/organisation/Route/OrganisationRouter";
import UserRouter from "../controller/user/Route/UserRouter";
import EmailRouter from "../controller/emails/Route/EmailRoute";
// import ProjectRouter from "../controller/projects/Router/ProjectRouter";
// import ClientRouter from "../controller/Client/Route/ClientRouter";
// import SequenceRouter from "../controller/Sequence/Router/SequenceRouter";
import WorkspaceRouter from "../controller/workspace/Router/WorkspaceRouter";
import ProxyRouter from "../controller/Proxy/Route/ProxyRouter";
import LinkedInAccountRouter from "../controller/LinkedAccount/Route/LinkedinAccountRoute";
import AddressRouter from "../controller/Address/Route/AddressRouter";
import CampaignRouter from "../controller/Campaigns/Route/CampaignRoute";
// import Views from "../Base/Class/Views";

const MainRouter = express.Router();

MainRouter.use("/api/user/", UserRouter);
MainRouter.use("/api/email/", EmailRouter);
// MainRouter.use("/api/client/", ClientRouter);
MainRouter.use("/api/address/", AddressRouter);
// MainRouter.use("/api/project/", ProjectRouter);
// MainRouter.use("/api/sequence/", SequenceRouter);
MainRouter.use("/api/workspace/", WorkspaceRouter);
MainRouter.use("/api/campaigns/", CampaignRouter);
MainRouter.use("/api/organisation/", OrganisationRouter);

MainRouter.use("/api/proxy/", ProxyRouter);
MainRouter.use("/api/linkedin-account", LinkedInAccountRouter);

// for test purpose only
// MainRouter.get("/test", async (req, res) => {
//   let user_id = req.query.user_id as string;
//   let workspace_id = req.query.workspace_id as string;
//   let organisation_id = req.query.organisation_id as string;

//   let view = new Views();
//   await view.connectDb();
//   let abd = await view.getOrganisationAndWorkspaceDetails( workspace_id, organisation_id);
//   view.flush();
//   res.send(abd);
// });

export default MainRouter;

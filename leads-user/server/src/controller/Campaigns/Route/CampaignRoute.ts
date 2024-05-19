import express from "express";
import CreateCampaign from "../API/Create";
import UpdateCampaign from "../API/Update";
import DeleteCampaign from "../API/Delete";
import GetCampaignDetails from "../API/GetDetails";

const CampaignRouter = express.Router();


CampaignRouter.get("/get",new GetCampaignDetails().getDetails);
CampaignRouter.get("/pipeline",new GetCampaignDetails().getAllCampaignResults);
CampaignRouter.post("/pipeline/enrich",new GetCampaignDetails().enrichEmail);
CampaignRouter.get("/results",new GetCampaignDetails().getCampaignResults);
CampaignRouter.post("/create",new CreateCampaign().create);
CampaignRouter.post("/duplicate",new CreateCampaign().duplicateCampaign);
CampaignRouter.post("/start",new CreateCampaign().start);
CampaignRouter.delete("/stop",new UpdateCampaign().stop);
CampaignRouter.put("/update",new UpdateCampaign().update);
CampaignRouter.delete("/delete",new DeleteCampaign().delete);


export default CampaignRouter;

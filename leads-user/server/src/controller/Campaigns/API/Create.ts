import { Request, Response, response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../config/response/ResStatus";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Campaigns from "../../../Base/Class/Campaigns";
import CampaignsFields from "../../../config/response/Campaigns";
import Status from "../../../config/Status";
import CampaignsInterface from "../../../Base/Interface/Campaigns";



class CreateCampaign {

    /**
     * Constructor
     */
    constructor() {
        this.create = this.create.bind(this);
        this.start = this.start.bind(this);
    }

    /**
     * Create a new campaign
     * @param req
     * @param res
     */
    async create(req: Request, res: Response) {
        try {

            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token
            ).checkAccess();


            let campaign = new Campaigns(req.body.campaign)
            campaign.validateCampaign();
            await campaign.connectDb();
            await campaign.createCampaign();

            let response = new ResponseClass(ResStatus.Success, CampaignsFields.Created);
            response.setData(campaign.getCampaign());
            campaign.flush();
            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }

    /**
     * Start the campaign
     * @param req
     * @param res
     */
    async start(req: Request, res: Response) {
        try {
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token
            ).checkAccess();

            let campaign = new Campaigns()
            await campaign.connectDb();
            let setupRes = await campaign.setupCampaign(req.body.linkedin_account_id);
            campaign.executeCampaign(setupRes.session, req.body.campaign_id);
            await campaign.updateStatus(Status.Running, req.body.campaign_id, req.body.linkedin_account_id);
            campaign.flush();

            let response = new ResponseClass(ResStatus.Success, CampaignsFields.Started);
            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }

    /**
     * Duplicate the campaign
     * @param req
     * @param res
     */
    async duplicateCampaign(req: Request, res: Response) {
        try {
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token
            ).checkAccess();

            let campaign = new Campaigns()
            await campaign.connectDb();
            let currentCampaign = await campaign.getCampaignDetails(
                req.body.linkedin_account_id,
                req.body.uid,
                req.body.workspace_id,
                req.body.campaign_id);

            campaign.setCampaigns(currentCampaign);
            campaign.setCampaignId(campaign.generateId());
            campaign.setCampaignName(campaign.getCampaignName() + " - Copy");
            campaign.setStatus(Status.Draft);
            await campaign.createCampaign();

            let response = new ResponseClass(ResStatus.Success, CampaignsFields.Duplicate);
            response.setData(campaign.getCampaign());
            campaign.flush();

            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }

}

export default CreateCampaign;
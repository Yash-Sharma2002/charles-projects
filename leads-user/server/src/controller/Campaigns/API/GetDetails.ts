import { Request, Response } from 'express';
import ResponseClass from '../../../Base/Class/Response';
import ResStatus from '../../../config/response/ResStatus';
import CommonMessage from '../../../config/response/CommonMessage';
import UserAccess from '../../../Base/Class/UserAccess';
import CampaignsFields from '../../../config/response/Campaigns';
import Views from '../../../Base/Class/Views';
import Campaigns from '../../../Base/Class/Campaigns';


class GetCampaignDetails {

    /**
     * Constructor
     */
    constructor() {
        this.getDetails = this.getDetails.bind(this);
        this.getCampaignResults = this.getCampaignResults.bind(this);
    }

    /**
     * Get the details of a campaign
     * @param req
     * @param res
     */
    async getDetails(req: Request, res: Response) {
        try {
            new UserAccess(req.query.uid as string, req.query.session as string, req.query.access_token as string).checkAccess();
            let campaign = new Views()
            await campaign.connectDb();
            let campaignDetails = await campaign.getCampaignDetails(req.query.uid as string, req.query.workspace_id as string);
            campaign.flush();
            let response = new ResponseClass(ResStatus.Success, CampaignsFields.FindSuccess);
            response.setData(campaignDetails);
            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }

    /**
     * Get the results of a campaign
     * @param req
     * @param res
     */
    async getCampaignResults(req: Request, res: Response) {
        try {
            new UserAccess(req.query.uid as string, req.query.session as string, req.query.access_token as string).checkAccess();
            let campaign = new Campaigns()
            await campaign.connectDb();
            let campaignDetails = await campaign.getCampaignResults(req.query.linkedin_account_id as string, req.query.campaign_id as string);
            campaign.flush();
            let response = new ResponseClass(ResStatus.Success, CampaignsFields.FindSuccess);
            response.setData(campaignDetails);
            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }


    /**
     * Get the results of a campaign
     * @param req
     * @param res
     */
    async getAllCampaignResults(req: Request, res: Response) {
        try {
            new UserAccess(req.query.uid as string, req.query.session as string, req.query.access_token as string).checkAccess();
            let campaign = new Views()
            await campaign.connectDb();
            let campaignDetails = await campaign.getCampaignResults(req.query.uid as string, req.query.workspace_id as string);
            campaign.flush();
            let response = new ResponseClass(ResStatus.Success, CampaignsFields.FindSuccess);
            response.setData(campaignDetails);
            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }

    /**
     * Enrich the email
     * @param req
     * @param res
     */
    async enrichEmail(req: Request, res: Response) {
        try {
            new UserAccess(req.body.uid, req.body.session, req.body.access_token).checkAccess();
            let campaign = new Campaigns();
            await campaign.connectDb();
            let email = await campaign.enrichEmail(req.body.id)
            campaign.flush();
            let response = new ResponseClass(ResStatus.Success, CampaignsFields.EMailEnriched)
            response.setData(email);
            return res.status(ResStatus.Success).send(response.getResponse())
        } catch (error) {
            if (error instanceof ResponseClass){
                return res.status(error.getStatus()).send(error.getResponse());
            }
            return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
        }
    }

}

export default GetCampaignDetails;
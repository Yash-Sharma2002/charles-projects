import { Request, Response } from 'express';
import ResponseClass from '../../../Base/Class/Response';
import ResStatus from '../../../config/response/ResStatus';
import CommonMessage from '../../../config/response/CommonMessage';
import UserAccess from '../../../Base/Class/UserAccess';
import Campaigns from '../../../Base/Class/Campaigns';
import CampaignsFields from '../../../config/response/Campaigns';   

class UpdateCampaign{

    /**
     * Constructor
     */
    constructor() {
        this.update = this.update.bind(this);
    }

    /**
     * Update a campaign
     * @param req
     * @param res
     */
    async update(req: Request, res: Response) {
        try {

            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token
            ).checkAccess();

            let campaign = new Campaigns(req.body.campaign)
            campaign.validateCampaign();
            await campaign.connectDb();
            await campaign.updateCampaign();
            let response = new ResponseClass(ResStatus.Success, CampaignsFields.Updated);
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
     * Stop the campaign
     * @param req
     * @param res
     */
    async stop(req: Request, res: Response) {
        try {
            new UserAccess(
                req.query.uid as string,
                req.query.session as string,
                req.query.access_token as string
            ).checkAccess();

            let campaign = new Campaigns()
            await campaign.connectDb();
            await campaign.pauseCampaign(
                req.query.linkedin_account_id as string,
                req.query.uid as string,
                req.query.workspace_id as string,
                req.query.campaign_id as string
            );
            let response = new ResponseClass(ResStatus.Success, CampaignsFields.Stopped);
            campaign.flush();
            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }
}

export default UpdateCampaign;
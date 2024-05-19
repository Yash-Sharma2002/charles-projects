import { Request, Response } from 'express';
import ResponseClass from '../../../Base/Class/Response';
import ResStatus from '../../../config/response/ResStatus';
import CommonMessage from '../../../config/response/CommonMessage';
import UserAccess from '../../../Base/Class/UserAccess';
import Campaigns from '../../../Base/Class/Campaigns';
import CampaignsFields from '../../../config/response/Campaigns';   


class DeleteCampaign{

    /**
     * Constructor
     */
    constructor() {
        this.delete = this.delete.bind(this);
    }


    /**
     * Delete a campaign
     * @param req
     * @param res
     */
    async delete(req: Request, res: Response) {
        try {

            new UserAccess(
                req.query.uid as string,
                req.query.session as string,
                req.query.access_token as string
            ).checkAccess();

            let campaign = new Campaigns()

            await campaign.connectDb();
            await campaign.deleteCampaign(
                req.query.linkedin_account_id as string,
                req.query.uid as string,
                req.query.workspace_id as string,
                req.query.campaign_id as string
            );
            campaign.flush();
            let response = new ResponseClass(ResStatus.Success, CampaignsFields.Deleted);

            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }

}

export default DeleteCampaign;
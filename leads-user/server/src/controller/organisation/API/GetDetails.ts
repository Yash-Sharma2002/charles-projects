import { Request, Response } from "express";
import Organisation from "../../../Base/Class/Organisation";
import UserAccess from "../../../Base/Class/UserAccess";
import ResponseClass from "../../../Base/Class/Response";
import Address from "../../../Base/Class/Address";
import ResStatus from "../../../config/response/ResStatus";
import CampaignsFields from "../../../config/response/Campaigns";
import CommonMessage from "../../../config/response/CommonMessage";
import Views from "../../../Base/Class/Views";



class GetDetails {

    /**
     * Constructor
     */
    constructor() {
        this.getDetails = this.getDetails.bind(this);
    }

    /**
     * Get the details of a campaign
     * @param req
     * @param res
     */
    async getDetails(req: Request, res: Response) {
        try {
            new UserAccess(req.query.uid as string, req.query.session as string, req.query.access_token as string).checkAccess();
            let org = new Organisation()
            await org.connectDb();
            let orgDetails = await org.getOrganisationByDetails(req.query.organisation_id as string);
            org.flush();

            let addr = new Address()
            await addr.connectDb();
            let address = await addr.getAddressById(orgDetails.organisation_address);
            addr.flush();
            let response = new ResponseClass(ResStatus.Success, CampaignsFields.FindSuccess);
            response.setData({ orgDetails, address });
            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }

    /**
     * Get Organisation members
     * @param req
     * @param res
     */
    async getOrganisationMembers(req: Request, res: Response) {
        try {
            new UserAccess(req.query.uid as string, req.query.session as string, req.query.access_token as string).checkAccess();
            let org = new Views()
            await org.connectDb();
            let orgDetails = await org.getOrganisationMembers(req.query.organisation_id as string);
            org.flush();
            let response = new ResponseClass(ResStatus.Success, CampaignsFields.FindSuccess);
            response.setData(orgDetails);
            return res.status(ResStatus.Success).send(response.getResponse());
        } catch (error) {
            if (error instanceof ResponseClass)
                return res.status(error.getStatus()).send(error.getResponse());
        }
        return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }

}

export default GetDetails;
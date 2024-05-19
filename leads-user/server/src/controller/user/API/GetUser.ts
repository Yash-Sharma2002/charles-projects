import { Request, Response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import CommonMessage from "../../../config/response/CommonMessage";
import ResStatus from "../../../config/response/ResStatus";
import Views from "../../../Base/Class/Views";
import UserAccess from "../../../Base/Class/UserAccess";


class GetUser {

    /**
     * Constructor
     */
    constructor() {
        this.getUserDataInOrganisationAndWorkspace = this.getUserDataInOrganisationAndWorkspace.bind(this);
    }

    /**
     * Get User Data In Organisation And Workspace
     * @param req
     * @param res
     * @returns User Data
     */
    async getUserDataInOrganisationAndWorkspace(req: Request, res: Response) {
        try {
            new UserAccess(
                req.query.user as string,
                req.query.session as string,
                req.query.access_token as string
            ).checkAccess();
            let user = req.query.user as string;

            let view = new Views();
            await view.connectDb();
            let userData = await view.getUserDetailsWithOrganisationAndWorkspace(user);

            console.log(userData);

            let response = new ResponseClass(ResStatus.Success, "");
            response.setData(userData);

            view.flush();
            return res.status(ResStatus.Success).send(response.getResponse());

        } catch (error: any) {

            if (error instanceof ResponseClass) {
                return res.status(error.getStatus()).send(error.getResponse());
            }


            return res.status(ResStatus.InternalServerError).send(new ResponseClass(
                ResStatus.InternalServerError,
                CommonMessage.InternalServerError
            ).getResponse());
        }
    }

    /**
     * Get User Data In Organisation by Roles
     * @param req
     * @param res
     */
    async getUserDataInOrganisationByRoles(req: Request, res: Response) {
        try {
            new UserAccess(
                req.query.uid as string,
                req.query.session as string,
                req.query.access_token as string
            ).checkAccess();
            let organisation_id = req.query.organisation_id as string;
            let role = req.query.role as string;

            let view = new Views();
            await view.connectDb();
            let userData = await view.getOrganisationMembersByRole(organisation_id, role);
            view.flush();

            let response = new ResponseClass(ResStatus.Success, "");
            response.setData(userData);

            return res.status(ResStatus.Success).send(response.getResponse());

        } catch (error: any) {

            if (error instanceof ResponseClass) {
                return res.status(error.getStatus()).send(error.getResponse());
            }

            return res.status(ResStatus.InternalServerError).send(new ResponseClass(
                ResStatus.InternalServerError,
                CommonMessage.InternalServerError
            ).getResponse());
        }
    }

}


export default GetUser
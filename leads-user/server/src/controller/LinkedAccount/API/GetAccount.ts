
import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import LinkedInAccountMessage from "../../../config/response/LinkedInAccount";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Views from "../../../Base/Class/Views";
import LinkedInAccount from "../../../Base/Class/LinkedInAccount";


class GetAccounts {

    /**
     * Constructor
     */
    constructor() {
        this.getLinkedAccounts = this.getLinkedAccounts.bind(this);
        this.getLinkedAccountsEmails = this.getLinkedAccountsEmails.bind(this);
    }


    /**
     * Get Linkedin Account
     * @param req
     * @param res
     * @returns Response
     * @Get Linkedin Account
     */
    async getLinkedAccounts(req: Request, res: Response) {
        try {
            new UserAccess(
                req.query.uid as string,
                req.query.session as string,
                req.query.access_token as string
            ).checkAccess();

            let views = new Views();
            await views.connectDb();
            let accounts = await views.getLinkedinAccountDetails(req.query.uid as string, req.query.workspace_id as string);
            views.flush()

            let response = new ResponseClass(
                ResStatus.Success,
                LinkedInAccountMessage.LinkedInAccountGetSuccess
            );
            response.setData(accounts);

            res.status(ResStatus.Success).send(response.getResponse());
        } catch (err) {
            if (err instanceof ResponseClass) {
                res.status(err.status).send(err.message);
            } else {
                res.status(ResStatus.InternalServerError).send(CommonMessage.InternalServerError);
            }
        }
    }


    /**
     * Get Linkedin Account
     * @param req
     * @param res
     */
    async getLinkedAccountsEmails(req: Request, res: Response) {
        try {
            new UserAccess(
                req.query.uid as string,
                req.query.session as string,
                req.query.access_token as string
            ).checkAccess();

            let linkedinAccount = new LinkedInAccount();
            await linkedinAccount.connectDb();
            let accounts = await linkedinAccount.getAllLinkedInAccounts(req.query.uid as string, req.query.workspace_id as string);
            linkedinAccount.flush()

            let response = new ResponseClass(
                ResStatus.Success,
                LinkedInAccountMessage.LinkedInAccountGetSuccess
            );
            response.setData(accounts);


            res.status(ResStatus.Success).send(response.getResponse());
        } catch (err) {
            if (err instanceof ResponseClass) {
                res.status(err.status).send(err.message);
            } else {
                res.status(ResStatus.InternalServerError).send(CommonMessage.InternalServerError);
            }
        }
    }

}

export default GetAccounts;
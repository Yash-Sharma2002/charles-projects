import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import LinkedInAccountMessage from "../../../config/response/LinkedInAccount";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import LinkedInAccount from "../../../Base/Class/LinkedInAccount";
import Proxy from "../../../Base/Class/Proxy";
import Collections from "../../../config/collections";

class DeleteLinkedinAccount{

    /**
     * Constructor
     */
    constructor() {
        this.deleteLinkedinAccount = this.deleteLinkedinAccount.bind(this);
    }

    /**
     * Delete Linkedin Account
     * @param req
     * @param res
     * @returns Response
     * @Delete Linkedin Account
     */
    async deleteLinkedinAccount(req: Request, res: Response) {
        try {
            new UserAccess(
                req.query.uid as string,
                req.query.session as string,
                req.query.access_token as string
            ).checkAccess();

            let account_id = req.query.account_id as string;

            let linkedAccount = new LinkedInAccount();
            await linkedAccount.connectDb();
            await linkedAccount.checkAccountNotExistsAccountId(account_id);
            await linkedAccount.deleteAccount(account_id);
            await linkedAccount.deleteOne(Collections.LinkedInCookies, { account_id: account_id });

            let proxy = new Proxy();
            proxy.setAccountId(account_id);
            await proxy.connectDb();
            let linkedinAccountProxy = await proxy.getProxyById();
            if(!linkedinAccountProxy.isCustom){
                await proxy.deleteProxy(linkedinAccountProxy.proxy_id);
            }else{
                linkedinAccountProxy.account_id = "";
                proxy.setProxy(linkedinAccountProxy);
                await proxy.updateProxy();
            }
            proxy.flush();
            linkedAccount.flush();


            return res.status(ResStatus.Success).send(new ResponseClass(ResStatus.Success, LinkedInAccountMessage.Deleted).getResponse());
        } catch (error) {
            if (error instanceof ResponseClass) {
                return res.status(error.getStatus()).send(error.getResponse());
            }
            return res
                .status(ResStatus.InternalServerError)
                .send(
                    new ResponseClass(
                        ResStatus.InternalServerError,
                        CommonMessage.InternalServerError
                    ).getResponse()
                );
        }
    }
}


export default DeleteLinkedinAccount;
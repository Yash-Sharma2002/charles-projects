import LinkedInAccount from "../../../Base/Class/LinkedInAccount";
import ResponseClass from "../../../Base/Class/Response";
import UserAccess from "../../../Base/Class/UserAccess";
import Collections from "../../../config/collections";
import LinkedInAccountMessage from "../../../config/response/LinkedInAccount";
import ResStatus from "../../../config/response/ResStatus";
import { Request, Response } from "express";


class ValidateAccount {

    /**
     * Constructor
     */
    constructor() {
        this.sendOTPLinkedAccount = this.sendOTPLinkedAccount.bind(this);
    }

    /**
     * Send OTP Linkedin Account
     * @param req
     * @param res
     * @returns Response
     * @Validate Linkedin Account
     */
    async sendOTPLinkedAccount(req: Request, res: Response) {

        try {

            let withCookies = false;
            new UserAccess(req.body.uid, req.body.session, req.body.access_token).checkAccess();


            let linkedAccount = new LinkedInAccount()
            let response = await linkedAccount.sendOTP(req.body.account_details);
            await linkedAccount.connectDb();
            if (response.codeFlag !== undefined) {
                if (!response.codeFlag) {
                    await linkedAccount.saveCookie(req.body.account_id, req.body.workspace_id, req.body.uid, response);
                    withCookies = true;
                }
            }
            else {
                throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.OTPError);
            }
            await linkedAccount.updateOne(Collections.LinkedinAccount, { account_id: req.body.account_id, workspace_id: req.body.workspace_id }, {$set:{ session: response.session} });
            linkedAccount.flush();
            if (withCookies) {
                return res.status(ResStatus.Success).send(new ResponseClass(ResStatus.Success, LinkedInAccountMessage.Connected).getResponse());
            }

            return res.status(ResStatus.Success).send(new ResponseClass(ResStatus.Success, LinkedInAccountMessage.OTP).getResponse());
        } catch (err) {
            if (err instanceof ResponseClass) {
                return res.status(ResStatus.BadRequest).send(err.getResponse());
            }
            return res.status(ResStatus.BadRequest).send(new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.OTPError).getResponse());
        }
    }

    /**
     * Validate Linkedin Account
     * @param req
     * @param res
     * @returns Response
     * @Validate Linkedin Account
     */
    async validateLinkedAccount(req: Request, res: Response) {
        try {

            new UserAccess(req.body.uid, req.body.session, req.body.access_token).checkAccess();

            let linkedAccount = new LinkedInAccount();
            await linkedAccount.connectDb();
            let response: any = linkedAccount.validateOTP(req.body.account_id, req.body.otp);
            if (!response.codeFlag) {
                linkedAccount.saveCookie(req.body.account_id, req.body.workspace_id, req.body.uid, response);
                linkedAccount.flush();
                return res.status(ResStatus.Success).send(new ResponseClass(ResStatus.Success, LinkedInAccountMessage.Connected).getResponse());
            }
            else {
                throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.OTPValidError);
            }
        } catch (err) {
            if (err instanceof ResponseClass) {
                return res.status(ResStatus.BadRequest).send(err.getResponse());
            }
            return res.status(ResStatus.BadRequest).send(new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.OTPError).getResponse());
        }
    }
}

export default ValidateAccount;
import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import LinkedInAccount from "../../../Base/Class/LinkedInAccount";
import LinkedInAccountMessage from "../../../config/response/LinkedInAccount";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Collections from "../../../config/collections";
import Status from "../../../config/Status";

class UpdateLinkedAccount {
  /**
   * Constructor
   */
  constructor() {
    this.updateLinkedAccount = this.updateLinkedAccount.bind(this);
    this.disconnectLinkedAccount = this.disconnectLinkedAccount.bind(this);
  }

  /**
   * Update Linkedin Account
   * @param req
   * @param res
   * @returns Response
   * @Update Linkedin Account
   */
  async updateLinkedAccount(req: Request, res: Response) {
    try {
      new UserAccess(
        req.body.uid as string,
        req.body.session as string,
        req.body.access_token as string
      ).checkAccess();

      let linkedAccount = new LinkedInAccount(req.body.account);
      linkedAccount.validate();
      await linkedAccount.connectDb();
      await linkedAccount.checkAccountNotExists();
      linkedAccount.setUpdatedAt();
      await linkedAccount.updateAccount();

      let response = new ResponseClass(
        ResStatus.Success,
        LinkedInAccountMessage.Updated
      );
      response.setData(linkedAccount.getAccount());
      linkedAccount.flush();

      return res.status(ResStatus.Success).send(response.getResponse());
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

  /**
   * Disconnect Linkedin Account
   * @param req
   * @param res
   */
  async disconnectLinkedAccount(req: Request, res: Response) {
    try {
      new UserAccess(
        req.body.uid,
        req.body.session,
        req.body.access_token
      ).checkAccess();

      let linkedAccount = new LinkedInAccount();
      await linkedAccount.connectDb();
      await linkedAccount.checkAccountNotExistsAccountId(req.body.account_id);
      await linkedAccount.updateOne(
        Collections.LinkedinAccount,
        { account_id: req.body.account_id },
        { $set: { status: Status.Disconnected } }
      );
      await linkedAccount.deleteOne(Collections.LinkedInCookies, {
        account_id: req.body.account_id,
      });

      linkedAccount.flush();

      return res
        .status(ResStatus.Success)
        .send(
          new ResponseClass(
            ResStatus.Success,
            LinkedInAccountMessage.Disconnected
          ).getResponse()
        );
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

export default UpdateLinkedAccount;

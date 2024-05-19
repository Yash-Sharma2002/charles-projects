import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import LinkedInAccount from "../../../Base/Class/LinkedInAccount";
import LinkedInAccountMessage from "../../../config/response/LinkedInAccount";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Proxy from "../../../Base/Class/Proxy";
import Status from "../../../config/Status";
import ProxyMessage from "../../../config/response/Proxy";

class CreateLinkedinAccount {
  /**
   * Constructor
   */
  constructor() {
    this.createLinkedAccount = this.createLinkedAccount.bind(this);
  }

  /**
   * Create Linkedin Account
   * @param req
   * @param res
   * @returns Response
   * @Create Linkedin Account
   */
  async createLinkedAccount(req: Request, res: Response) {
    try {
      new UserAccess(
        req.body.uid as string,
        req.body.session as string,
        req.body.access_token as string
      ).checkAccess();

      let linkedAccount = new LinkedInAccount(req.body.account);
      linkedAccount.validate();
      await linkedAccount.connectDb();
      await linkedAccount.checkAccountExists();

      let proxy = new Proxy({
        ...req.body.proxy,
        status: Status.Active,
      });
      proxy.setAccountId(linkedAccount.getAccountId());
      await proxy.connectDb();
      if (
        proxy.getUsername() === undefined ||
        proxy.getUsername() === null ||
        proxy.getUsername() === ""
      ) {
        let linkedinAccountProxy = await proxy.getTopAvailableProxyByCountry(
          req.body.account.country
        );
        if (linkedinAccountProxy.proxy_id === "") {
          throw new ResponseClass(
            ResStatus.BadRequest,
            ProxyMessage.NotAvailable
          );
        }
        proxy.setProxy(linkedinAccountProxy);
        proxy.setStatus(Status.Occupied);
        await proxy.updateProxy();
      } else {
        proxy.validate();
        await proxy.checkProxyExists();
        proxy.setStatus(Status.Occupied);
        await proxy.createNewProxy();
      }

      linkedAccount.setProxyId(proxy.getProxyId());
      linkedAccount.validateProxy();
      await linkedAccount.insertAccount();

      let response = new ResponseClass(
        ResStatus.Success,
        LinkedInAccountMessage.Created
      );
      response.setData(linkedAccount.getAccount());
      linkedAccount.flush();
      proxy.flush();

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
}

export default CreateLinkedinAccount;
import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import ProxyMessage from "../../../config/response/Proxy";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Proxy from "../../../Base/Class/Proxy";

class UpdateProxy {
  /**
   * Constructor
   */
  constructor() {
    this.updateProxy = this.updateProxy.bind(this);
  }

  /**
   * Update Proxy
   * @param req
   * @param res
   * @returns Response
   * @Update Proxy
   */
  async updateProxy(req: Request, res: Response) {
    try {
      new UserAccess(
        req.body.uid as string,
        req.body.session as string,
        req.body.access_token as string
      ).checkAccess();

      let proxy = new Proxy(req.body.proxy);
      proxy.validate();
      await proxy.connectDb();
      await proxy.checkProxyExistsById();
      await proxy.checkProxyNotExists();
      await proxy.updateProxy();
      
      let response = new ResponseClass(ResStatus.Success, ProxyMessage.Updated);
      response.setData(proxy.getProxy());
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

export default UpdateProxy;

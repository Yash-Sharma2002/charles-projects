import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import ProxyMessage from "../../../config/response/Proxy";
import UserAccess from "../../../Base/Class/UserAccess";
import Proxy from "../../../Base/Class/Proxy";
import CommonMessage from "../../../config/response/CommonMessage";

class DeleteProxy {
  /**
   * Contructor
   */
  constructor() {
    this.delete = this.delete.bind(this);
  }

  /**
   * Delete Sequence
   * @param req
   * @param res
   * @returns Response
   * @Delete Sequence
   */
  async delete(req: Request, res: Response) {
    try {
      new UserAccess(
        req.query.uid as string,
        req.query.session as string,
        req.query.access_token as string
      ).checkAccess();

      let proxy = new Proxy();
      await proxy.connectDb();
      await proxy.checkProxyExistsById(
        req.query.proxy_id as string,
        req.query.account_id as string
      );
      await proxy.deleteProxy(req.query.proxy_id as string);
      proxy.flush();

      let response = new ResponseClass(ResStatus.Success, ProxyMessage.Deleted);
      response.setData(proxy.getProxy());

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

export default DeleteProxy;

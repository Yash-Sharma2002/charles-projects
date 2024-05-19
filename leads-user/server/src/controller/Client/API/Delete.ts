import { Request, Response } from "express";
import Client from "../../../Base/Class/Client";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import ClientFields from "../../../config/response/Client";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Organisation from "../../../Base/Class/Organisation";

class DeleteClient {
  /**
   * Constructor
   */
  constructor() {
    this.deleteClient = this.deleteClient.bind(this);
  }

  /**
   * Delete Client
   * @param req
   * @param res
   * @returns Response
   * @Delete Client
   */
  async deleteClient(req: Request, res: Response) {
    try {
      new UserAccess(
        req.query.uid as string,
        req.query.session as string,
        req.query.access_token as string,
      ).checkAccess();

      let organisation =new Organisation();
      organisation.setOrganisationId(req.query.organisation_id as string);
      await organisation.connectDb();
      await organisation.checkOrganisationExistsV2();
      organisation.flush();

      let clt = new Client();
      clt.setClientId(req.query.client_id as string);
      await clt.connectDb();
      await clt.deleteClient();
      clt.flush();

      return res
        .status(ResStatus.Success)
        .send(
          new ResponseClass(
            ResStatus.Success,
            ClientFields.ClientDeleted
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

export default DeleteClient;

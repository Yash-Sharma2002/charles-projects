import { Request, Response } from "express";
import Client from "../../../Base/Class/Client";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import ClientFields from "../../../config/response/Client";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Organisation from "../../../Base/Class/Organisation";

class UpdateClient {
  /**
   * Constructor
   */
  constructor() {
    this.updateClient = this.updateClient.bind(this);
  }

  /**
   * Update Client
   * @param req
   * @param res
   * @returns Response
   * @Update Client
   */
  async updateClient(req: Request, res: Response) {
    try {
      new UserAccess(
        req.body.uid,
        req.body.session,
        req.body.access_token
      ).checkAccess();

      let organisation =new Organisation();
      organisation.setOrganisationId(req.body.client.organisation_id);
      await organisation.connectDb();
      await organisation.checkOrganisationExistsV2();
      organisation.flush();

      let client = new Client(req.body.client);
      client.validate();
      await client.connectDb();
      await client.checkClientExists();
      await client.updateClient();

      let response = new ResponseClass(
        ResStatus.Success,
        ClientFields.ClientUpdated
      );
      response.setData(client.getClient());

      client.flush();

      return res
        .status(ResStatus.Success)
        .send(response.getResponse()
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

export default UpdateClient;

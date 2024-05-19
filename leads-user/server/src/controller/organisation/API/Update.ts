import OrganisationClass from "../../../Base/Class/Organisation";
import Organisation from "../../../Base/Interface/Organisation";

import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import OrganisationMessage from "../../../config/response/Organisation";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import UserOrganisationClass from "../../../Base/Class/UserOrganisation";

/**
 * Update Organisation
 * @param req
 * @param res
 * @returns Response
 * @Create Organisation
 */
class UpdateOrganisation {
  public uid: string = "";
  public session: string = "";
  public access_token: string = "";

  public res: Response = {} as Response;

  /**
   * Constructor
   */
  constructor() {
    this.updateOrganisation = this.updateOrganisation.bind(this);
  }

  /**
   * Set Main Request Params
   * @param uid
   * @param session
   * @param access_token
   */
  setorg(uid: string, session: string, access_token: string): void {
    this.uid = uid;
    this.session = session;
    this.access_token = access_token;
  }

   /**
   * Check Access
   * @param req
   */
   checkAccess(req: Request) {
    this.setorg(req.body.uid, req.body.session, req.body.access_token);
    new UserAccess(this.uid, this.session, this.access_token).checkAccess();
  }


  /**
   * Update Organisation
   * @param req
   * @param res
   */
  async updateOrganisation(req: Request, res: Response) {
    try {
      this.checkAccess(req);
      this.res = res;

      const organisation = new OrganisationClass(req.body.organisation);
      organisation.validate();

      await organisation.connectDb();
      await organisation.checkOrganisationExistsV2();

      let userOrganisation = new UserOrganisationClass();
      await userOrganisation.connectDb();
      await userOrganisation.checkUserNotAdmin(this.uid, organisation.getOrganisationId());

      await organisation.updateOrganisation();

      let response = new ResponseClass(
        ResStatus.Success,
        OrganisationMessage.Updated
      );
      response.setData(organisation.getOrganisation());
      organisation.flush();
      userOrganisation.flush();

      return res.status(ResStatus.Success).send(response.getResponse());
    } catch (error) {
      if(error instanceof ResponseClass) {
        return res.status(error.status).send(error.getResponse());
      }
      return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
    }
  }
}

export default UpdateOrganisation;

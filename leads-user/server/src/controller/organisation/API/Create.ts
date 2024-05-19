import { Request, Response } from "express";
import OrganisationClass from "../../../Base/Class/Organisation";
import Organisation from "../../../Base/Interface/Organisation";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import OrganisationMessage from "../../../config/response/Organisation";
import UserOrganisationClass from "../../../Base/Class/UserOrganisation";
import UserAccess from "../../../Base/Class/UserAccess";
import Roles from "../../../config/Roles";
import CommonMessage from "../../../config/response/CommonMessage";

/**
 * Create Organisation
 * @param req
 * @param res
 * @returns Response
 * @Create Organisation
 */
class CreateOrganisation {
  public uid: string = "";
  public session: string = "";
  public access_token: string = "";

  public res: Response = {} as Response;

  /**
   * Constructor
   */
  constructor() {
    this.createOrganisation = this.createOrganisation.bind(this);
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
   * Create Organisation
   * @param req
   * @param res
   */
  async createOrganisation(req: Request, res: Response) {
    try {
      this.checkAccess(req);
      this.res = res;
      
      const organisation = new OrganisationClass(req.body.organisation);
      organisation.validate();
      await organisation.connectDb();
      await organisation.checkOrganisationExists();

      let userOrganisation = new UserOrganisationClass({
        user_id: this.uid,
        organisation_id: organisation.getOrganisationId(),
        role: Roles.OrganisationAdmin,
      });
      await userOrganisation.connectDb();
      await userOrganisation.checkUserExists();

      await organisation.connectDb();
      await organisation.createOrganisation();
      await userOrganisation.addUserInOrganisation();

      let response = new ResponseClass(
        ResStatus.Success,
        OrganisationMessage.Created
      );
      response.setData(organisation.getOrganisation());
      userOrganisation.flush();
      organisation.flush();

      return res.status(ResStatus.Success).send(response.getResponse());
    } catch (error: any) {
      if (error instanceof ResponseClass) {
        return this.res.status(error.getStatus()).send(error.getResponse());
      }
      return this.res
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

export default CreateOrganisation;

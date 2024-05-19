import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import OrganisationMessage from "../../../config/response/Organisation";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import UserOrganisation from "../../../Base/Class/UserOrganisation";
import Organisation from "../../../Base/Class/Organisation";

class DeleteOranisation {
  public uid: string = "";
  public session: string = "";
  public access_token: string = "";

  public res: Response = {} as Response;

  /**
   * Constructor
   */
  constructor() {
    this.deleteOrganisation = this.deleteOrganisation.bind(this);
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
    this.setorg(
      req.query.uid as string,
      req.query.session as string,
      req.query.access_token as string
    );
    new UserAccess(this.uid, this.session, this.access_token).checkAccess();
  }

  /**
   * Delete Organisation
   * @param req
   * @param res
   */
  async deleteOrganisation(req: Request, res: Response) {
    try {
      this.checkAccess(req);
      let organisation = new Organisation();
      organisation.setOrganisationId(req.query.organisation_id as string);
      await organisation.connectDb();
      await organisation.checkOrganisationExistsV2();

      let userOrganisation = new UserOrganisation();
      userOrganisation.setUserId(req.query.uid as string);
      userOrganisation.setOrganisationId(req.query.organisation_id as string);
      await userOrganisation.connectDb();
      await userOrganisation.checkUserNotAdmin();
      await userOrganisation.deleteUserOrganisation();
      await organisation.deleteOrganisation();

      organisation.flush();
      userOrganisation.flush();

      return res
        .status(ResStatus.Success)
        .send(
          new ResponseClass(
            ResStatus.Success,
            OrganisationMessage.Deleted
          ).getResponse()
        );
    } catch (error) {
      if (error instanceof ResponseClass) {
        return res.status(error.status).send(error.getResponse());
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

export default DeleteOranisation;

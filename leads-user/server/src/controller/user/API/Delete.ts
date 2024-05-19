import UserClass from "../../../Base/Class/User";
import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import UserFieldsMessage from "../../../config/response/User";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import UserOrganisationClass from "../../../Base/Class/UserOrganisation";

/**
 * Delete User
 */
class DeleteUser {
  public uid: string = "";
  public deleteUid: string = "";
  public session: string = "";
  public access_token: string = "";

  /**
   * Constructor
   */
  constructor() {
    this.deleteUser = this.deleteUser.bind(this);
  }

  /**
   * Check Access
   * @param req
   */
  async checkAccess(req: Request) {
    this.uid = req.query.uid as string;
    this.session = req.query.session as string;
    this.access_token = req.query.access_token as string;

    new UserAccess(this.uid, this.session, this.access_token).checkAccess();
    let userOrganisation = new UserOrganisationClass();
    await userOrganisation.connectDb();
    // await userOrganisation.checkUserNotAdmin(this.uid);
  }

  /**
   * Update User
   * @param req
   * @param res
   */
  async deleteUser(req: Request, res: Response) {
    try {
      await this.checkAccess(req);
      this.deleteUid = req.query.delete as string;
      const user = new UserClass();
      await user.connectDb();
      await user.checkUserExistsV2(this.deleteUid);
      await user.deleteUser(this.deleteUid);
      user.flush();

      let userAccess = new UserAccess(this.deleteUid)
      await userAccess.connectDb();
      await userAccess.removeAccess();
      userAccess.flush()
      return res
        .status(ResStatus.Success)
        .send(
          new ResponseClass(
            ResStatus.Success,
            UserFieldsMessage.UserDeleted
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

export default DeleteUser;

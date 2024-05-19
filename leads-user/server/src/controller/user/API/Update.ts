import UserClass from "../../../Base/Class/User";
import User from "../../../Base/Interface/User";
import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import UserFieldsMessage from "../../../config/response/User";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";

/**
 * Update User
 */
class UpdateUser {
  public uid: string = "";
  public updateUid: string = "";
  public session: string = "";
  public access_token: string = "";
  public user: User = {} as User;
  public password: string = "";

  public res: Response = {} as Response;

  /**
   * Constructor
   */
  constructor() {
    this.updateUser = this.updateUser.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  /**
   * Check Access
   * @param req
   */
  async checkAccess(req: Request) {
    this.uid = req.body.uid;
    this.session = req.body.session;
    this.access_token = req.body.access_token;

    new UserAccess(this.uid, this.session, this.access_token).checkAccess();
  }

  /**
   * Update User
   * @param req
   * @param res
   */
  async updateUser(req: Request, res: Response) {
    await this.checkAccess(req);

    this.user = req.body.user;
    this.res = res;

    try {
      const user = new UserClass(this.user);
      if (user.getPassword() !== "") {
        throw new ResponseClass(
          ResStatus.BadRequest,
          UserFieldsMessage.CannotUpdatePassword
        );
      }

      user.validateUser(true);

      await user.connectDb();
      await user.checkUserExistsV2();
      await user.updateUser();

      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserUpdated
      );
      response.setData({ ...user.getUser() });
      user.flush();
      return res.status(ResStatus.Success).send(response.getResponse());
    } catch (error) {
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

  /**
   * Update Password
   * @param req
   * @param res
   */
  async updatePassword(req: Request, res: Response) {

    this.password = req.body.user.password;
    this.updateUid = req.body.user.uid;
    this.res = res;


    try {
      const user = new UserClass();
      user.validatePassword(this.password);
      await user.connectDb();
      await user.checkUserExistsV2(this.updateUid);
      user.setPassword(this.password);
      user.setUserId(this.updateUid);
      await user.updatePassword();
      user.flush();

      return res.status(ResStatus.Success).send(new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserUpdated
      ).getResponse());
    } catch (error) {
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

export default UpdateUser;

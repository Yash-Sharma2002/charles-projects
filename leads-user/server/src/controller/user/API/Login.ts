import UserClass from "../../../Base/Class/User";
import User from "../../../Base/Interface/User";
import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import UserFieldsMessage from "../../../config/response/User";
import CommonMessage from "../../../config/response/CommonMessage";
import Hash from "../../../Base/Class/Hash";
import UserAccess from "../../../Base/Class/UserAccess";
import Views from "../../../Base/Class/Views";
import EmailClass from "../../../Base/Class/Email";

/**
 * Login User
 */
class LoginUser {
  public emailOrUsername = "";
  public password = "";
  public user: User = {} as User;

  public res: Response = {} as Response;

  /**
   * Constructor
   */
  constructor() {
    this.loginUser = this.loginUser.bind(this);
    this.forgetPassword = this.forgetPassword.bind(this);
  }

  /**
   * Create User
   * @param req
   * @param res
   */
  async loginUser(req: Request, res: Response) {
    this.emailOrUsername = req.query.user as string;
    this.password = req.query.password as string;
    this.res = res;

    try {
      const user = new UserClass();
      user.validatePassword(this.password);
      await user.connectDb();
      this.user = await user.checkAndGetUser(
        this.emailOrUsername,
        this.emailOrUsername
      );
      let matches = new Hash(this.password).compareHash(
        this.user.password
      );
      if (!matches) {
        return res
          .status(ResStatus.BadRequest)
          .send(
            new ResponseClass(
              ResStatus.BadRequest,
              CommonMessage.InvalidCredentials
            ).getResponse()
          );
      }
      let userAccess = new UserAccess(this.user.uid);
      await userAccess.connectDb();
      await userAccess.updateAccess(this.user.email);
      userAccess.flush();

      let view = new Views();
      await view.connectDb();
      let userData = await view.getUserDetailsWithOrganisationAndWorkspace(this.user.uid);
      user.flush();

      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.LoginSuccess
      );
      response.setData(userData);


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
   * Forget Password
   * @param req
   * @param res
   * @description This function is used to Send the forget password link to the user
   */
  async forgetPassword(req: Request, res: Response) {

    try {
      this.emailOrUsername = req.query.email as string;

      const user = new UserClass();
      await user.connectDb();
      this.user = await user.checkAndGetUser(this.emailOrUsername);
      user.flush();

      let email = new EmailClass();
      await email.sendForgotPasswordEmail(this.user.email, this.user.name || this.user.username, this.user.uid);
      email.flush();

      return res.status(ResStatus.Success).send(
        new ResponseClass(
          ResStatus.Success,
          UserFieldsMessage.ForgetPasswordSuccess
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

export default LoginUser;

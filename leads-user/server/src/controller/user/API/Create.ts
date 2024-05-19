import UserClass from "../../../Base/Class/User";
import User from "../../../Base/Interface/User";
import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import UserFieldsMessage from "../../../config/response/User";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";

/**
 * Create User
 */
class CreateUser {
  public uid: string = "";
  public session: string = "";
  public access_token: string = "";
  public user: User = {} as User;

  public res: Response = {} as Response;

  /**
   * Constructor
   */
  constructor() {
    this.createUser = this.createUser.bind(this);
  }

  /**
   * Create User
   * @param req
   * @param res
   */
  async createUser(req: Request, res: Response) {
    this.user = req.body.user;
    this.res = res;

    try {
      const user = new UserClass(this.user);
      user.validateUser();
      await user.connectDb();
      await user.checkUserExists();
      await user.createUser();

      let userAccess = new UserAccess();
      userAccess.setUserId(user.getUserId());
      await userAccess.connectDb();
      await userAccess.createNewAccess(user.getEmail());

      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserSuccessfullyCreated
      );
      response.setData({
        name: user.getName(),
        email: user.getEmail(),
        username: user.getUsername(),
        status: user.getStatus(),
        ...userAccess.getAccess(),
      });
      user.flush();
      userAccess.flush();
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
}

export default CreateUser;

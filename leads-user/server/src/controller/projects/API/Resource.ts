import UserAccess from "../../../Base/Class/UserAccess";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../config/response/ResStatus";
import { Request, Response } from "express";
import UserProject from "../../../Base/Class/UserProject";
import UserProjectResponse from "../../../config/response/UserProject";
import CommonMessage from "../../../config/response/CommonMessage";

class ResourceManager {
  public uid: string = "";
  public session: string = "";
  public access_token: string = "";

  /**
   * Constructor
   */
  constructor() {
    this.addResource = this.addResource.bind(this);
    this.removeResource = this.removeResource.bind(this);
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
   * Add Resource
   * @param req
   * @param res
   */
  async addResource(req: Request, res: Response) {
    try {
      this.checkAccess(req);

      let userProject = new UserProject({
        userProject_Id: "",
        project_id: req.body.project_id,
        user_id: req.body.user_id,
      });

      await userProject.connectDb();
      await userProject.checkUserProjectExists();
      await userProject.createUserProject();
      userProject.flush();

      return res
        .status(ResStatus.Success)
        .json(
          new ResponseClass(ResStatus.Success, UserProjectResponse.Created)
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

  /**
   * Remove Resource
   * @param req
   * @param res
   */
  async removeResource(req: Request, res: Response) {
    try {
      this.checkAccess(req);
      let userProject = new UserProject({
        userProject_Id: "",
        project_id: req.body.project_id,
        user_id: req.body.user_id,
      });
      await userProject.connectDb();
      await userProject.checkUserProjectExists();
      await userProject.removeUserProject();
      userProject.flush();
      return res
        .status(ResStatus.Success)
        .json(
          new ResponseClass(ResStatus.Success, UserProjectResponse.Removed)
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

export default ResourceManager;
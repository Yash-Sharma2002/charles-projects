import { Request, Response } from "express";
import UserAccess from "../../../Base/Class/UserAccess";
import Projects from "../../../Base/Class/Projects";
import ResStatus from "../../../config/response/ResStatus";
import ProjectsMessage from "../../../config/response/Projects";
import ResponseClass from "../../../Base/Class/Response";
import CommonMessage from "../../../config/response/CommonMessage";
import Organisation from "../../../Base/Class/Organisation";

class UpdateProject {
  private uid: string = "";
  private session: string = "";
  private access_token: string = "";

  /**
   * Constructor
   */
  constructor() {
    this.updateProject = this.updateProject.bind(this);
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
   * Update Project
   * @param req
   * @param res
   */
  async updateProject(req: Request, res: Response) {
    try {
      this.checkAccess(req);

      let organisation =new Organisation();
      organisation.setOrganisationId(req.body.project.organisation_id);
      await organisation.connectDb();
      await organisation.checkOrganisationExistsV2();
      organisation.flush();

      const project = new Projects(req.body.project);
      project.validateProject();
      await project.connectDb();
      await project.checkProjectNotExists();
      await project.updateProject();

      let response = new ResponseClass(
        ResStatus.Success,
        ProjectsMessage.ProjectUpdated
      );

      response.setData(project.getProject());
      project.flush();
      return res.status(ResStatus.Success).send(response.getResponse());
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

export default UpdateProject;
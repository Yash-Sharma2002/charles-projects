import { Request, Response } from "express";
import Projects from "../../../Base/Class/Projects";
import ResponseClass from "../../../Base/Class/Response";
import ResStatus from "../../../config/response/ResStatus";
import CommonMessage from "../../../config/response/CommonMessage";
import UserProject from "../../../Base/Class/UserProject";
import ProjectsMessage from "../../../config/response/Projects";
import UserAccess from "../../../Base/Class/UserAccess";
import Organisation from "../../../Base/Class/Organisation";

class CreateProject {
  public uid: string = "";
  public session: string = "";
  public access_token: string = "";

  /**
   * Constructor
   */
  constructor() {
    this.createProject = this.createProject.bind(this);
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
   * Create Project
   * @param req
   * @param res
   * @returns Response
   * @Create Project
   */
  async createProject(req: Request, res: Response) {
    try {
      this.checkAccess(req);

      let organisation =new Organisation();
      organisation.setOrganisationId(req.body.project.organisation_id);
      await organisation.connectDb();
      await organisation.checkOrganisationExistsV2();
      organisation.flush();

      let project = new Projects(req.body.project);
      project.validateProject();
      await project.connectDb();
      await project.checkProjectExists();
      await project.createProject();

      let userProject = new UserProject({
        userProject_Id: "",
        user_id: project.getProjectManager(),
        project_id: project.getProjectId(),
      });
      userProject.setProjectId(project.getProjectId());
      userProject.setUserId(project.ProjectManager);
      await userProject.connectDb();
      await userProject.createUserProject();

      if (project.getExecutionManager() !== "") {
        userProject.setUserProject({
          userProject_Id: "",
          user_id: project.getExecutionManager() as string,
          project_id: project.getProjectId(),
        });

        await userProject.createUserProject();
      }

      let response = new ResponseClass(
        ResStatus.Success,
        ProjectsMessage.ProjectCreated
      );
      response.setData(project.getProject());

      project.flush();
      userProject.flush();
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

export default CreateProject;

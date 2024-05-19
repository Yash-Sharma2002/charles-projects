import { Request,Response } from "express";
import UserAccess from "../../../Base/Class/UserAccess";
import ResponseClass from "../../../Base/Class/Response";
import Projects from "../../../Base/Class/Projects";
import ResStatus from "../../../config/response/ResStatus";
import CommonMessage from "../../../config/response/CommonMessage";
import ProjectsMessage from "../../../config/response/Projects";
import Organisation from "../../../Base/Class/Organisation";


class DeleteProject{
    private uid: string = "";
    private session: string = "";
    private access_token: string = "";
  
    /**
     * Constructor
     */
    constructor() {
      this.deleteProject = this.deleteProject.bind(this);
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
      this.setorg(req.query.uid as string, req.query.session as string, req.query.access_token as string);
      new UserAccess(this.uid, this.session, this.access_token).checkAccess();
    }

    /**
     * Delete Project
     * @param req
     * @param res
     */
    async deleteProject(req: Request, res: Response) {
      try {
        this.checkAccess(req);

        let organisation =new Organisation();
        organisation.setOrganisationId(req.query.organisation_id as string);
        await organisation.connectDb();
        await organisation.checkOrganisationExistsV2();
        organisation.flush();
  
        const project = new Projects();
        project.setProjectId(req.query.project as string)
        await project.connectDb();
        await project.checkProjectNotExists();
        await project.deleteProject();
  
        let response = new ResponseClass(
          ResStatus.Success,
          ProjectsMessage.ProjectDeleted
        );
  
        return res.status(200).json(response);
      } catch (error) {
        if (error instanceof ResponseClass) {
          return res.status(error.getStatus()).json(error.getResponse());
        }
        return res
          .status(ResStatus.InternalServerError)
          .json(
            new ResponseClass(
              ResStatus.InternalServerError,
              CommonMessage.InternalServerError
            ).getResponse()
          );
      }
    }

}

export default DeleteProject;
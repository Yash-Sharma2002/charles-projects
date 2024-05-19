import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import WorkspacesFields from "../../../config/response/Workspaces";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Workspace from "../../../Base/Class/Workspace";
import UserWorkspace from "../../../Base/Class/UserWorkspace";
import Roles from "../../../config/Roles";
import UserOrganisation from "../../../Base/Class/UserOrganisation";
import UserClass from "../../../Base/Class/User";
import WorkspaceOrganisation from "../../../Base/Class/WorkspaceOrganisation";

class CreateWorkspace {
  /**
   * Constructor
   */
  constructor() {
    this.createWorkspace = this.createWorkspace.bind(this);
  }

  /**
   * Create Workspace
   * @param req
   * @param res
   * @returns Response
   * @Create Workspace
   */
  async createWorkspace(req: Request, res: Response) {
    try {
      new UserAccess(
        req.body.uid as string,
        req.body.session as string,
        req.body.access_token as string
      ).checkAccess();

      let userOrganisation = new UserOrganisation();
      await userOrganisation.connectDb();
      await userOrganisation.checkUserNotAdmin(
        req.body.uid,
        req.body.organisation
      ); // expected to be Organisation Admin
      userOrganisation.flush();

      let user = new UserClass();
      await user.connectDb();
      await user.checkUserExistsV2(req.body.admin);
      user.flush();

      let workspace = new Workspace(req.body.workspace);
      workspace.validate();
      await workspace.connectDb();
      await workspace.checkWorkspaceExists();

      let userWorkspace = new UserWorkspace({
        workspace_id: workspace.getWorkspaceId(),
        user_id: req.body.admin,
        role: Roles.WorkspaceAdmin,
      });
      await userWorkspace.connectDb();
      await userWorkspace.checkUserWorkspaceExists();

      let workspaceOrganisation = new WorkspaceOrganisation({
        workspace_id: workspace.getWorkspaceId(),
        organisation_id: req.body.organisation,
      });
      await workspaceOrganisation.connectDb();

      await workspace.createNewWorkspace();
      await userWorkspace.createNewUserWorkspace();
      await workspaceOrganisation.createWorkspaceOrganisation();

      let response = new ResponseClass(
        ResStatus.Success,
        WorkspacesFields.WorkspaceCreated
      );
      response.setData(workspace.getWorkspace());

      workspace.flush();
      userWorkspace.flush();
      workspaceOrganisation.flush();

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

export default CreateWorkspace;

import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import WorkspacesFields from "../../../config/response/Workspaces";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Workspace from "../../../Base/Class/Workspace";
import Roles from "../../../config/Roles";
import Views from "../../../Base/Class/Views";

class UpdateWorkspace {
  /**
   * Constructor
   */
  constructor() {
    this.updateWorkspace = this.updateWorkspace.bind(this);
  }

  /**
   * Update Workspace
   * @param req
   * @param res
   * @returns Response
   * @Update Workspace
   */
  async updateWorkspace(req: Request, res: Response) {
    try {
      new UserAccess(
        req.query.uid as string,
        req.query.session as string,
        req.query.access_token as string
      ).checkAccess();

      let view = new Views();
      await view.connectDb();
      let userRole = await view.getUserRolesInOrganisationAndWorkspace(
        req.body.uid as string,
        req.body.workspace as string,
        req.body.organisation as string
      );
      if (
        userRole.workspace_role === Roles.Member ||
        userRole.role === Roles.OrganisationMember
      ) {
        return res
          .status(ResStatus.Forbidden)
          .send(
            new ResponseClass(
              ResStatus.Forbidden,
              CommonMessage.InvalidRequest
            ).getResponse()
          );
      }

      let workspaceOrganisationView =
        await view.getOrganisationAndWorkspaceDetails(
          req.query.workspace as string,
          req.query.organisation as string
        );
      if (
        !workspaceOrganisationView.organisation_name ||
        !workspaceOrganisationView.workspace_name
      ) {
        return res
          .status(ResStatus.NotFound)
          .send(
            new ResponseClass(
              ResStatus.NotFound,
              CommonMessage.OrganisationWorkspaceNotFound
            ).getResponse()
          );
      }
      view.flush();

      let workspace = new Workspace(req.body.workspace);
      workspace.validate();
      await workspace.connectDb();
      await workspace.updateWorkspace();

      let response = new ResponseClass(
        ResStatus.Success,
        WorkspacesFields.WorkspaceUpdated
      );
      response.setData(workspace.getWorkspace());

      workspace.flush();

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

export default UpdateWorkspace;

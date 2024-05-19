import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import WorkspacesFields from "../../../config/response/Workspaces";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import Workspace from "../../../Base/Class/Workspace";
import UserWorkspace from "../../../Base/Class/UserWorkspace";
import WorkspaceOrganisation from "../../../Base/Class/WorkspaceOrganisation";
import Roles from "../../../config/Roles";
import Views from "../../../Base/Class/Views";

class DeleteWorkspace {
  /**
   * Constructor
   */
  constructor() {
    this.deleteWorkspace = this.deleteWorkspace.bind(this);
  }

  /**
   * Delete Workspace
   * @param req
   * @param res
   * @returns Response
   * @Delete Workspace
   */
  async deleteWorkspace(req: Request, res: Response) {
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

      let workspace = new Workspace();
      workspace.setWorkspaceId(req.query.workspace as string);
      await workspace.connectDb();
      await workspace.removeWorkspace();
      workspace.flush();

      let userWorkspace = new UserWorkspace();
      await userWorkspace.connectDb();
      await userWorkspace.removeUserWorkspace(
        req.query.uid as string,
        req.query.workspace as string
      );
      userWorkspace.flush();

      let workspaceOrganisation = new WorkspaceOrganisation();
      workspaceOrganisation.setWorkspaceId(req.query.workspace as string);
      workspaceOrganisation.setOrganisationId(req.query.organisation as string);
      await workspaceOrganisation.connectDb();

      await workspaceOrganisation.removeWorkspaceOrganisation();
      workspaceOrganisation.flush();

      return res
        .status(ResStatus.Success)
        .send(
          new ResponseClass(
            ResStatus.Success,
            WorkspacesFields.WorkspaceDeleted
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

export default DeleteWorkspace;

import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import WorkspacesFields from "../../../config/response/Workspaces";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import UserWorkspace from "../../../Base/Class/UserWorkspace";
import Roles from "../../../config/Roles";
import Views from "../../../Base/Class/Views";

class Member {
  /**
   * Constructor
   */
  constructor() {
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
  }

  /**
   * Remove Member
   * @param req
   * @param res
   */
  async removeMember(req: Request, res: Response) {
    try {
      new UserAccess(
        req.query.uid as string,
        req.query.session as string,
        req.query.access_token as string
      ).checkAccess();

      let view = new Views();
      await view.connectDb();
      let userRole = await view.getUserRolesInOrganisationAndWorkspace(
        req.query.uid as string,
        req.query.workspace as string,
        req.query.organisation as string
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

      let workspaceOrganisation = await view.getOrganisationAndWorkspaceDetails(
        req.query.workspace as string,
        req.query.organisation as string
      );
      if (
        !workspaceOrganisation.organisation_name ||
        !workspaceOrganisation.workspace_name
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

      let userWorkspace = new UserWorkspace();
      userWorkspace.setWorkspaceId(req.query.workspace as string);
      userWorkspace.setUserId(req.query.user_id as string);
      await userWorkspace.connectDb();
      await userWorkspace.removeUserWorkspace();
      userWorkspace.flush();

      return res
        .status(ResStatus.Success)
        .send(
          new ResponseClass(
            ResStatus.Success,
            WorkspacesFields.MemberRemoved
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

  /**
   * Add Member
   * @param req
   * @param res
   */
  async addMember(req: Request, res: Response) {
    try {
      new UserAccess(
        req.body.uid,
        req.body.session,
        req.body.access_token
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

      let workspaceOrganisation = await view.getOrganisationAndWorkspaceDetails(
        req.body.workspace as string,
        req.body.organisation as string
      );
      if (
        !workspaceOrganisation.organisation_name ||
        !workspaceOrganisation.workspace_name
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
      
      let userWorkspace = new UserWorkspace({
        workspace_id: req.body.workspace,
        user_id: req.body.user_id,
        role: Roles.Member,
      });
      await userWorkspace.connectDb();
      await userWorkspace.createNewUserWorkspace();
      userWorkspace.flush();

      return res
        .status(ResStatus.Success)
        .send(
          new ResponseClass(
            ResStatus.Success,
            WorkspacesFields.MemberAdded
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


export default Member;
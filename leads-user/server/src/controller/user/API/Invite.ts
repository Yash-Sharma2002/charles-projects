import { Request, Response } from "express";
import UserClass from "../../../Base/Class/User";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import CommonMessage from "../../../config/response/CommonMessage";
import UserFieldsMessage from "../../../config/response/User";
import InviteUserClass from "../../../Base/Class/Invite";
import UserAccess from "../../../Base/Class/UserAccess";
import InviteMessage from "../../../config/response/Invite";
import InvitationStatus from "../../../config/InvitationStatus";
import UserOrganisationClass from "../../../Base/Class/UserOrganisation";
import Roles from "../../../config/Roles";

/**
 * Invite a user to join the Organisation
 * @class InviteUser
 */
class InviteUser {
  public uid: string = "";
  public session: string = "";
  public access_token: string = "";
  public name: string = "";
  public email: string = "";
  public role: string = "";
  public organisation_id: string = "";
  public invitation_id: string = "";


  /**
   * Constructor
   */
  constructor() {
    this.inviteUser = this.inviteUser.bind(this);
    this.resendInvite = this.resendInvite.bind(this);
    this.revokeInvite = this.revokeInvite.bind(this);
    this.acceptInvite = this.acceptInvite.bind(this);
  }

  /**
   * Check Access
   * @param req
   */
  async checkAccess(req: Request) {
    this.uid = req.body.uid;
    this.session = req.body.session;
    this.access_token = req.body.access_token;

    new UserAccess(this.uid, this.session, this.access_token).checkAccess();
    let userOrganisation = new UserOrganisationClass();
    await userOrganisation.connectDb();
    await userOrganisation.checkUserNotAdmin(this.uid);
    userOrganisation.flush();
  }

  /**
   * Create User
   * @param req
   * @param res
   */
  async inviteUser(req: Request, res: Response) {
    
    try {
      await this.checkAccess(req);
      const user = new UserClass();
      await user.connectDb();
      await user.checkUserExists(req.body.email);
      user.flush()


      let invitation = new InviteUserClass(req.body.invite);
      await invitation.connectDb();
      await invitation.inviteUser();
      invitation.flush();
      let response = new ResponseClass(
        ResStatus.Success,
        InviteMessage.InviteSent
      );

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

  /**
   * Resend Invite
   * @param req
   * @param res
   */
  async resendInvite(req: Request, res: Response) {
    
    try {
      await this.checkAccess(req);
      this.invitation_id = req.body.invitation_id;
      res = res;
      let invitation = new InviteUserClass();
      invitation.setInvitationId(this.invitation_id);
      invitation.setSentBy(this.uid);
      await invitation.connectDb();
      await invitation.checkInvitationStatus([InvitationStatus.Accepted]);
      await invitation.resendInvitation();
      invitation.flush();
      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserInvited
      );

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

  /**
   * Revoke Invite
   * @param req
   * @param res
   */
  async revokeInvite(req: Request, res: Response) {
    try {
      await this.checkAccess(req);
      this.invitation_id = req.body.invitation_id;
      res = res;
      let invitation = new InviteUserClass();
      invitation.setInvitationId(this.invitation_id);
      invitation.setSentBy(this.uid);
      await invitation.connectDb();
      await invitation.checkInvitationStatus([InvitationStatus.Accepted]);
      await invitation.resendInvitation();
      invitation.flush()
      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserInvited
      );

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

  /**
   * Accept Invite
   * @param req
   * @param res
   */
  async acceptInvite(req: Request, res: Response) {
    
    try {
      this.invitation_id = req.body.invitation_id;
      this.email = req.body.email;
      res = res;
      let invitation = new InviteUserClass();
      invitation.setInvitationId(this.invitation_id);
      invitation.setEmail(this.email);
      invitation.setOrganisationId(req.body.organisation_id);
      await invitation.connectDb();
      await invitation.checkInvitationNotExists();
      await invitation.checkInvitationStatus([
        InvitationStatus.Revoked,
        InvitationStatus.Accepted,
        InvitationStatus.Expired,
      ]);
      await invitation.acceptInvitation();
      invitation.flush()
      let response = new ResponseClass(
        ResStatus.Success,
        UserFieldsMessage.UserInvited
      );
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

export default InviteUser;

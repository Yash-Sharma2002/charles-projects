import InvitationStatus from "../../config/InvitationStatus";
import InviteUserInterface from "../Interface/Invitation";
import Collections from "../../config/collections";
import ResStatus from "../../config/response/ResStatus";
import ResponseClass from "./Response";
import Start from "./Start";
import EmailClass from "./Email";
import InviteMessage from "../../config/response/Invite";
import Organisation from "./Organisation";
import Roles from "../../config/Roles";

/**
 * Invite User Class
 * @extends Start
 * @implements InviteUserInterface
 * @description Class to handle user invitation
 */
class InviteUser extends Start implements InviteUserInterface {
  email: string;
  name: string;
  role: Roles = Roles.OrganisationMember;
  organisation_id: string;
  sent_by: string;
  invitation_id: string;
  status: InvitationStatus = InvitationStatus.Pending;
  created_at: number;
  expires_at: number;

  /**
   * Constructor
   * @param inviteUser
   */
  constructor(inviteUser?: InviteUserInterface) {
    super();
    this.invitation_id = inviteUser?.invitation_id || this.generateId();
    this.sent_by = inviteUser?.sent_by || "";
    this.email = inviteUser?.email || "";
    this.name = inviteUser?.name || "";
    this.role = inviteUser?.role || Roles.OrganisationMember;
    this.organisation_id = inviteUser?.organisation_id || "";
    this.status = inviteUser?.status || InvitationStatus.Pending;
    this.created_at = inviteUser?.created_at || new Date().getTime();
    this.expires_at =
      inviteUser?.expires_at || new Date().getTime() + 24 * 60 * 60 * 1000;
  }

  // Getters
  /**
   * Get Invitation ID
   * @returns Invitation ID
   */
  getInvitationId(): string {
    return this.invitation_id;
  }

  /**
   * Get Sent By
   * @returns Sent By
   */
  getSentBy(): string {
    return this.sent_by;
  }

  /**
   * Get Email
   * @returns Email
   */
  getEmail(): string {
    return this.email;
  }

  /**
   * Get Name
   * @returns Name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get Organisation ID
   * @returns Organisation ID
   */
  getOrganisationId(): string {
    return this.organisation_id;
  }

  /**
   * Get Role
   * @returns Role
   */
  getRole(): Roles {
    return this.role;
  }

  /**
   * Get Status
   * @returns Status
   */
  getStatus(): InvitationStatus {
    return this.status;
  }

  /**
   * Get Created At
   * @returns Created At
   */
  getCreatedAt(): number {
    return this.created_at;
  }

  /**
   * Get Expires At
   * @returns Expires At
   */
  getExpiresAt(): number {
    return this.expires_at;
  }

  /**
   * Get Invite User
   * @returns InviteUser
   */
  getInviteUser(): InviteUserInterface {
    return {
      invitation_id: this.invitation_id,
      sent_by: this.sent_by,
      email: this.email,
      name: this.name,
      role: this.role,
      organisation_id: this.organisation_id,
      status: this.status,
      created_at: this.created_at,
      expires_at: this.expires_at,
    };
  }

  // Setters
  /**
   * Set Invitation ID
   * @param invitation_id
   */
  setInvitationId(invitation_id: string): void {
    this.invitation_id = invitation_id;
  }

  /**
   * Set Sent By
   * @param sent_by
   */
  setSentBy(sent_by: string): void {
    this.sent_by = sent_by;
  }

  /**
   * Set Email
   * @param email
   */
  setEmail(email: string): void {
    this.email = email;
  }

  /**
   * Set Name
   * @param name
   */
  setName(name: string): void {
    this.name = name;
  }

  /**
   * Set Role
   * @param role
   */
  setRole(role: Roles): void {
    this.role = role;
  }

  /**
   * Set Organisation ID
   * @param organisation_id
   */
  setOrganisationId(organisation_id: string): void {
    this.organisation_id = organisation_id;
  }

  /**
   * Set Status
   * @param status
   */
  setStatus(status: InvitationStatus): void {
    this.status = status;
  }

  /**
   * Set Created At
   */
  setCreatedAt(): void {
    this.created_at = new Date().getTime();
  }

  /**
   * Set Expires At
   */
  setExpiresAt(): void {
    this.expires_at = new Date().getTime() + 24 * 60 * 60 * 1000;
  }

  /**
   * Set Invite User
   * @param inviteUser
   */
  setInviteUser(inviteUser: InviteUserInterface): void {
    this.invitation_id = inviteUser.invitation_id;
    this.sent_by = inviteUser.sent_by;
    this.email = inviteUser.email;
    this.name = inviteUser.name;
    this.role = inviteUser.role || Roles.OrganisationMember;
    this.organisation_id = inviteUser.organisation_id;
    this.status = inviteUser.status || InvitationStatus.Pending;
    this.created_at = inviteUser.created_at
      ? inviteUser.created_at
      : new Date().getTime();
    this.expires_at = inviteUser.expires_at
      ? inviteUser.expires_at
      : new Date().getTime() + 24 * 60 * 60 * 1000;
  }

  /**
   * Get Invitation Details
   * @param invitation_id
   * @returns
   */
  async getInvitationById(invitation_id: string = this.invitation_id) {
    return await this.getOne(Collections.Invite, { invitation_id });
  }

  /**
   * Get Invitation By Email
   * @param email
   * @returns
   */
  async getInvitationByEmail(email: string = this.email) {
    return (await this.getOne(Collections.Invite, {
      email,
    })) as unknown as InviteUserInterface;
  }

  /**
   * Get Invitation By Organisation
   * @param organisation_id
   * @returns
   */
  async getInvitationsByOrganisation(
    organisation_id: string = this.organisation_id
  ) {
    return (await this.getAll(Collections.Invite, {
      organisation_id,
    })) as unknown as InviteUserInterface;
  }

  /**
   * Check Invitation Exists
   * @param email
   * @param invitation_id
   */
  async checkInvitationExists(
    email: string = this.email,
    invitation_id: string = this.invitation_id
  ) {
    if (await this.getOne(Collections.Invite, { $or: [{ email }, { invitation_id }] })) {
      throw new ResponseClass(ResStatus.BadRequest, InviteMessage.InviteExists);
    }
  }

  /**
   * Check Invitation Not Exists
   * @param email
   * @param invitation_id
   */
  async checkInvitationNotExists(
    email: string = this.email,
    invitation_id: string = this.invitation_id
  ) {
    if (!(await this.getOne(Collections.Invite, { $or: [{ email }, { invitation_id }] }))) {
      throw new ResponseClass(ResStatus.BadRequest, InviteMessage.InviteNotFound);
    }
  }

  /**
   * Send Invitation Email
   */
  async inviteUser() {
    await this.insertOne(Collections.Invite, this.getInviteUser());
    await new EmailClass().sendInviteEmail(
      this.email,
      this.name,
      this.organisation_id,
      this.invitation_id
    );
  }

  /**
   * Accept Invitation
   * @param invitation_id
   */
  async acceptInvitation(invitation_id: string = this.invitation_id) {
      await this.updateOne(
      Collections.Invite,
      { invitation_id: invitation_id },
      {
        $set: {
          status: InvitationStatus.Accepted,
        },
      }
    );
  }

  /**
   * Reject Invitation
   * @param invitation_id
   */
  async rejectInvitation(invitation_id: string = this.invitation_id) {
    await this.updateOne(
      Collections.Invite,
      { invitation_id: invitation_id },
      { status: InvitationStatus.Rejected }
    );
  }

  /**
   * Resend Invitation
   */
  async resendInvitation() {
    await this.updateOne(
      Collections.Invite,
      { invitation_id: this.invitation_id },
      { status: InvitationStatus.Pending }
    );
    await new EmailClass().sendInviteEmail(
      this.email,
      this.name,
      this.organisation_id,
      this.invitation_id
    );
  }

  /**
   * Revoke Invitation
   */
  async revokeInvitation() {
    await this.deleteOne(Collections.Invite, {
      invitation_id: this.invitation_id,
    });
  }

  /**
   * Check Invitation Status
   * @param invitation_id
   * @returns
   */
  async checkInvitationStatus(
    status: InvitationStatus[] = [InvitationStatus.Accepted],
    invitation_id: string = this.invitation_id
  ) {
    const invitation = await this.getOne(Collections.Invite, { invitation_id });
    if (invitation === null) {
      throw new ResponseClass(ResStatus.NotFound, InviteMessage.InviteNotFound);
    }

    let message = "";
    switch (invitation.status) {
      case InvitationStatus.Accepted:
        message = InviteMessage.InviteAccepted;
        break;
      case InvitationStatus.Rejected:
        message = InviteMessage.InviteRejected;
        break;
      case InvitationStatus.Pending:
        message = InviteMessage.InvitePending;
        break;
      case InvitationStatus.Revoked:
        message = InviteMessage.InviteRevoked;
        break;
      case InvitationStatus.Expired:
        message = InviteMessage.InviteExpired;
    }

    if (status.includes(invitation.status)) {
      throw new ResponseClass(ResStatus.BadRequest, message);
    }
  }
}

export default InviteUser;

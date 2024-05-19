import Roles from "../../config/Roles";
import Collections from "../../config/collections";
import ResStatus from "../../config/response/ResStatus";
import UserWorkspaceFields from "../../config/response/UserWorkspace";
import UserWorkspaceInterface from "../Interface/UserWorkspace";
import ResponseClass from "./Response";
import Start from "./Start";

class UserWorkspace extends Start implements UserWorkspaceInterface {
  user_id: string = "";
  workspace_id: string = "";
  role: Roles;
  created_at?: number | undefined;
  updated_at?: number | undefined;

  /**
   * Constructor
   * @param userWorkspace
   */
  constructor(userWorkspace?: UserWorkspaceInterface) {
    super();
    this.user_id = userWorkspace?.user_id || "";
    this.workspace_id = userWorkspace?.workspace_id || "";
    this.role = userWorkspace?.role || Roles.Member;
    this.created_at = userWorkspace?.created_at || new Date().getTime();
    this.updated_at = userWorkspace?.updated_at || new Date().getTime();
  }

  // Getters
  /**
   * Get User Id
   * @returns User Id
   */
  getUserId(): string {
    return this.user_id;
  }

  /**
   * Get Workspace Id
   * @returns Workspace Id
   */
  getWorkspaceId(): string {
    return this.workspace_id;
  }

  /**
   * Get Role
   * @returns Role
   */
  getRole(): Roles {
    return this.role;
  }

  /**
   * Get Created At
   * @returns Created At
   */
  getCreatedAt(): number | undefined {
    return this.created_at;
  }

  /**
   * Get Updated At
   * @returns Updated At
   */
  getUpdatedAt(): number | undefined {
    return this.updated_at;
  }

  /**
   * Get User Workspace
   * @returns User Workspace
   */
  getUserWorkspace() {
    return {
      user_id: this.user_id,
      workspace_id: this.workspace_id,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  /**
   * Set User Id
   * @param user_id
   */
  setUserId(user_id: string) {
    this.user_id = user_id;
  }

  /**
   * Set Workspace Id
   * @param workspace_id
   */
  setWorkspaceId(workspace_id: string) {
    this.workspace_id = workspace_id;
  }

  /**
   * Set Role
   * @param role
   */
  setRole(role: Roles) {
    this.role = role;
  }

  /**
   * Set Created At
   * @param created_at
   */
  setCreatedAt(created_at: number) {
    this.created_at = created_at;
  }

  /**
   * Set Updated At
   * @param updated_at
   */
  setUpdatedAt(updated_at: number) {
    this.updated_at = updated_at;
  }

  /**
   * Set User Workspace
   * @param userWorkspace
   */
  setUserWorkspace(userWorkspace: UserWorkspaceInterface) {
    this.user_id = userWorkspace.user_id;
    this.workspace_id = userWorkspace.workspace_id;
    this.created_at = userWorkspace.created_at;
    this.updated_at = userWorkspace.updated_at;
  }

  /**
   * Get User Workspace
   * @param user_id
   * @param workspace_id
   * @returns User Workspace
   */
  async getUserWorkspaceByDetails(
    user_id: string = this.user_id,
    workspace_id: string = this.workspace_id
  ) {
    return (await this.getOne(Collections.UserWorkspace, {
      $and: [{ user_id }, { workspace_id }],
    })) as unknown as UserWorkspaceInterface;
  }

  /**
   * Get User Workspace By User Id
   * @param user_id
   * @returns User Workspace
   */
  async getUserWorkspaceByUserId(user_id: string = this.user_id) {
    return (await this.getAll(Collections.UserWorkspace, {
      user_id,
    })) as unknown as UserWorkspaceInterface;
  }

  /**
   * Get User Workspace By Workspace Id
   * @param workspace_id
   * @returns User Workspace
   */
  async getUserWorkspaceByWorkspaceId(
    workspace_id: string = this.workspace_id
  ) {
    return (await this.getAll(Collections.UserWorkspace, {
      workspace_id,
    })) as unknown as UserWorkspaceInterface;
  }

  /**
   * Check User Workspace By Role
   * @param role
   * @returns User Workspace
   */
  async checkWorkspaceRole() {
    let userWorkspace = await this.getUserWorkspaceByDetails(
      this.user_id,
      this.workspace_id
    );

    if (userWorkspace.role === Roles.Member) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserWorkspaceFields.Unauthorized
      );
    }
  }

  /**
   * Check User Workspace Exists
   * @param user_id
   * @param workspace_id
   */
  async checkUserWorkspaceExists(
    user_id: string = this.user_id,
    workspace_id: string = this.workspace_id
  ) {
    const userWorkspace = await this.getOne(Collections.UserWorkspace, {
      user_id,
      workspace_id,
    });
    if (userWorkspace) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserWorkspaceFields.AlreadyExists
      );
    }
  }

  /**
   * Check User Workspace Exists
   * @param user_id
   * @param workspace_id
   */
  async checkUserWorkspaceExistsV2(
    user_id: string = this.user_id,
    workspace_id: string = this.workspace_id
  ) {
    const userWorkspace = await this.getOne(Collections.UserWorkspace, {
      user_id,
      workspace_id,
    });
    if (!userWorkspace) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserWorkspaceFields.NotFound
      );
    }
  }

  /**
   * Create New User Workspace
   * @param user_id
   * @param workspace_id
   * @param role
   */
  async createNewUserWorkspace() {
    await this.insertOne(Collections.UserWorkspace, this.getUserWorkspace());
  }

  /**
   * Update User Workspace
   * @param user_id
   * @param workspace_id
   * @param role
   */
  async updateUserWorkspace() {
    await this.updateOne(
      Collections.UserWorkspace,
      { user_id: this.user_id, workspace_id: this.workspace_id },
      this.getUserWorkspace()
    );
  }

  /**
   * Remove User Workspace
   * @param user_id
   * @param workspace_id
   */
  async removeUserWorkspace(user_id: string = this.user_id, workspace_id: string = this.workspace_id) {
    await this.deleteOne(Collections.UserWorkspace, {
      user_id: user_id,
      workspace_id: workspace_id,
    });
  }

  /**
   * Flush
   */
  async flush() {
    this.user_id = "";
    this.workspace_id = "";
    this.role = Roles.Member;
    this.created_at = undefined;
    this.updated_at = undefined;
    super.flush();
  }
}

export default UserWorkspace;

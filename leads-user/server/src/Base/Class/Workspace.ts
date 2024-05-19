import Collections from "../../config/collections";
import ResStatus from "../../config/response/ResStatus";
import WorkspacesFields from "../../config/response/Workspaces";
import WorkSpaceInterface from "../Interface/WorkSpace";
import ResponseClass from "./Response";
import Start from "./Start";

class Workspace extends Start implements WorkSpaceInterface {
  workspace_id: string = "";
  workspace_name: string = "";
  workspace_description: string = "";
  workspace_group: string = "";
  created_at?: number | undefined;
  updated_at?: number | undefined;

  /**
   * Constructor
   * @param workspace
   */
  constructor(workspace?: WorkSpaceInterface) {
    super();
    this.workspace_id = workspace?.workspace_id || this.generateId();
    this.workspace_name = workspace?.workspace_name || "";
    this.workspace_description = workspace?.workspace_description || "";
    this.workspace_group = workspace?.workspace_group || "";
    this.created_at = workspace?.created_at || new Date().getTime();
    this.updated_at = workspace?.updated_at || new Date().getTime();
  }

  // Getters
  /**
   * Get Workspace Id
   * @returns Workspace Id
   */
  getWorkspaceId(): string {
    return this.workspace_id;
  }


  /**
   * Get Workspace Name
   * @returns Workspace Name
   */
  getWorkspaceName(): string {
    return this.workspace_name;
  }

  /**
   * Get Workspace Description
   * @returns Workspace Description
   */
  getWorkspaceDescription(): string {
    return this.workspace_description;
  }

  /**
   * Get Workspace Group
   * @returns Workspace Group
   */
  getWorkspaceGroup(): string {
    return this.workspace_group;
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
   * Get Workspace
   * @returns
   * @memberof Workspace
   */
  getWorkspace() {
    return {
      workspace_id: this.workspace_id,
      workspace_name: this.workspace_name,
      workspace_description: this.workspace_description,
      workspace_group: this.workspace_group,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Setters
  /**
   * Set Workspace Id
   * @param workspace_id
   */
  setWorkspaceId(workspace_id: string): void {
    this.workspace_id = workspace_id;
  }

  /**
   * Set Workspace Name
   * @param workspace_name
   */
  setWorkspaceName(workspace_name: string): void {
    this.workspace_name = workspace_name;
  }

  /**
   * Set Workspace Description
   * @param workspace_description
   */
  setWorkspaceDescription(workspace_description: string): void {
    this.workspace_description = workspace_description;
  }

  /**
   * Set Workspace Group
   * @param workspace_group
   */
  setWorkspaceGroup(workspace_group: string): void {
    this.workspace_group = workspace_group;
  }

  /**
   * Set Created At
   * @param created_at
   */
  setCreatedAt(created_at: number): void {
    this.created_at = created_at;
  }

  /**
   * Set Updated At
   * @param updated_at
   */
  setUpdatedAt(updated_at: number): void {
    this.updated_at = updated_at;
  }

  /**
   * Set Workspace
   * @param workspace
   */
  setWorkspace(workspace: WorkSpaceInterface): void {
    this.workspace_id = workspace.workspace_id;
    this.workspace_name = workspace.workspace_name;
    this.workspace_description = workspace.workspace_description;
    this.workspace_group = workspace.workspace_group;
  }

  /**
   * Validate Workspace
   */
  validate() {
    this.validateName(this.workspace_name);
    this.validateDescription(this.workspace_description);
  }

  /**
   * Get Workspace
   * @param workspace_id
   * @param workspace_name
   * @returns Workspace
   */
  async getWorkspaceByDetails(
    workspace_id: string = this.workspace_id,
    workspace_name: string = this.workspace_name
  ): Promise<WorkSpaceInterface> {
    return (await this.getOne(Collections.Workspace, {
      $or: [{ workspace_id }, { workspace_name }],
    })) as unknown as WorkSpaceInterface;
  }

  /**
   * Check Workspace Exists
   * @param workspace_id
   * @param workspace_name
   */
  async checkWorkspaceExists(
    workspace_id: string = this.workspace_id,
    workspace_name: string = this.workspace_name
  ) {
    const workspace = await this.getOne(Collections.Workspace, {
      $and: [{ workspace_id },{ workspace_name }],
    });
    if (workspace) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        WorkspacesFields.AlreadyExists
      );
    }
  }

  /**
   * Check Workspace Exists
   * @param workspace_id
   * @param workspace_name
   */
  async checkWorkspaceExistsV2(
    workspace_id: string = this.workspace_id,
    workspace_name: string = this.workspace_name
  ) {
    const workspace = await this.getOne(Collections.Workspace, {
      $and: [{ workspace_id },  { workspace_name }],
    });
    if (!workspace) {
      throw new ResponseClass(ResStatus.BadRequest, WorkspacesFields.NotFound);
    }
  }

  /**
   * Create New Workspace
   */
  async createNewWorkspace() {
    await this.insertOne(Collections.Workspace, this.getWorkspace());
  }

  /**
   * Update Workspace
   */
  async updateWorkspace() {
    await this.updateOne(
      Collections.Workspace,
      { workspace_id: this.workspace_id },
     { $set: this.getWorkspace()}
    );
  }

  /**
   * Remove Workspace
   */
  async removeWorkspace() {
    await this.deleteOne(Collections.Workspace, {
      workspace_id: this.workspace_id,
    });
  }

  /**
   * Flush
   */
  flush() {
    super.flush();
    this.workspace_id = "";
    this.workspace_name = "";
    this.workspace_description = "";
    this.workspace_group = "";
    this.created_at = undefined;
    this.updated_at = undefined;
  }
}

export default Workspace;

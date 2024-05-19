import Collections from "../../config/collections";
import ResStatus from "../../config/response/ResStatus";
import WorkspaceOrganisationFields from "../../config/response/WorkspaceOrganisation";
import WorkspaceOrganisationInterface from "../Interface/WorkspaceOrganisation";
import ResponseClass from "./Response";
import Start from "./Start";

class WorkspaceOrganisation
  extends Start
  implements WorkspaceOrganisationInterface
{
  workspace_id: string = "";
  organisation_id: string = "";
  created_at?: number | undefined;

  /**
   * Constructor
   * @param workspaceOrganisation
   */
  constructor(workspaceOrganisation?: WorkspaceOrganisationInterface) {
    super();
    this.workspace_id = workspaceOrganisation?.workspace_id || "";
    this.organisation_id = workspaceOrganisation?.organisation_id || "";
    this.created_at = workspaceOrganisation?.created_at || new Date().getTime();
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
   * Get Organisation Id
   * @returns Organisation Id
   */
  getOrganisationId(): string {
    return this.organisation_id;
  }

  /**
   * Get Created At
   * @returns Created At
   */
  getCreatedAt(): number | undefined {
    return this.created_at;
  }

  /**
   * Get Workspace Organisation
   * @returns Workspace Organisation
   */
  getWorkspaceOrganisation() {
    return {
      workspace_id: this.workspace_id,
      organisation_id: this.organisation_id,
      created_at: this.created_at,
    };
  }

  /**
   * Set Workspace Id
   * @param workspace_id
   */
  setWorkspaceId(workspace_id: string) {
    this.workspace_id = workspace_id;
  }

  /**
   * Set Organisation Id
   * @param organisation_id
   */
  setOrganisationId(organisation_id: string) {
    this.organisation_id = organisation_id;
  }

  /**
   * Set Created At
   * @param created_at
   */
  setCreatedAt(created_at: number) {
    this.created_at = created_at;
  }

  /**
   * Set Workspace Organisation
   * @param workspaceOrganisation
   */
  setWorkspaceOrganisation(
    workspaceOrganisation: WorkspaceOrganisationInterface
  ) {
    this.workspace_id = workspaceOrganisation.workspace_id;
    this.organisation_id = workspaceOrganisation.organisation_id;
    this.created_at = workspaceOrganisation.created_at;
  }

  /**
   * Get Workspace Organisation
   * @param workspace_id
   * @returns Workspace Organisation
   */
  async getWorkspaceOrganisationByWorkspaceId(
    workspace_id: string = this.workspace_id
  ) {
    await this.getOne(Collections.OrganisationWorkspace, { workspace_id });
  }

  /**
   * Get Workspace Organisation
   * @param organisation_id
   * @returns Workspace Organisation
   */
  async getWorkspaceOrganisationByOrganisationId(
    organisation_id: string = this.organisation_id
  ) {
    await this.getAll(Collections.OrganisationWorkspace, { organisation_id });
  }

  /**
   * Check Workspace Organisation Exists
   * @param workspace_id
   * @param organisation_id
   */
  async checkWorkspaceOrganisationExists(
    workspace_id: string = this.workspace_id,
    organisation_id: string = this.organisation_id
  ) {
    const workspaceOrganisation = await this.getOne(
      Collections.OrganisationWorkspace,
      { workspace_id, organisation_id }
    );
    if (workspaceOrganisation) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        WorkspaceOrganisationFields.AlreadyExists
      );
    }
  }

  /**
   * Check Workspace Organisation Exists
   * @param workspace_id
   * @param organisation_id
   */
  async checkWorkspaceOrganisationExistsV2(
    workspace_id: string = this.workspace_id,
    organisation_id: string = this.organisation_id
  ) {
    const workspaceOrganisation = await this.getOne(
      Collections.OrganisationWorkspace,
      { workspace_id, organisation_id }
    );
    if (!workspaceOrganisation) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        WorkspaceOrganisationFields.NotFound
      );
    }
  }

  /**
   * Create Workspace Organisation
   * @param workspace_id
   * @param organisation_id
   */
  async createWorkspaceOrganisation(
    workspace_id: string = this.workspace_id,
    organisation_id: string = this.organisation_id
  ) {
    await this.insertOne(Collections.OrganisationWorkspace, {
      workspace_id,
      organisation_id,
      created_at: new Date().getTime(),
    });
  }

  /**
   * Remove Workspace Organisation
   * @param workspace_id
   * @param organisation_id
   */
  async removeWorkspaceOrganisation(
    workspace_id: string = this.workspace_id,
    organisation_id: string = this.organisation_id
  ) {
    await this.deleteOne(Collections.OrganisationWorkspace, {
      $and: [{ workspace_id }, { organisation_id }],
      $or: [{ workspace_id }],
    });
  }

  /**
   * Flush
   */
  flush() {
    super.flush();
    this.workspace_id = "";
    this.organisation_id = "";
    this.created_at = undefined;
  }
}

export default WorkspaceOrganisation;

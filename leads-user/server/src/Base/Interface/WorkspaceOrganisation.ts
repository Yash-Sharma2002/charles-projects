
/**
 * Interface for WorkspaceOrganisation
 * @param workspace_id: string - Collection Workspace - workspace_id
 * @param organisation_id: string - Collection Organisation - organisation_id
 * @param created_at: number
 */
interface WorkspaceOrganisationInterface {
    workspace_id: string;
    organisation_id: string;
    created_at?: number;
}

export default WorkspaceOrganisationInterface
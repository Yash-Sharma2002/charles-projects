
export default interface Workspace {
    organisation_id: string;
    workspace_name: string;
    workspace_admin?: string;
    workspace_desc: string;
    workspace_id: string;
    created?: Date;
    modified?: Date;
}
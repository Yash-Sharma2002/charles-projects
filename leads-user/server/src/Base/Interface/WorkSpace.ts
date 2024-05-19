
/**
 * Interface for WorkSpace
 * @param workspace_id: string
 * @param workspace_name: string
 * @param workspace_description: string
 * @param workspace_group: string
 */
interface WorkSpaceInterface {
    workspace_id: string;
    workspace_name: string;
    workspace_description: string;
    workspace_group: string;
    created_at?: number;
    updated_at?: number;
}

export default WorkSpaceInterface
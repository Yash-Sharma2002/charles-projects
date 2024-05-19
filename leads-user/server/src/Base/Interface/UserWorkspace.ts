import Roles from "../../config/Roles";

/**
 * UserWorkspace Interface
 * @param user_id: string - Collection User - user_id
 * @param workspace_id: string - Collection Workspace - workspace_id
 * @param role: Roles
 * @param created_at: number
 * @param updated_at: number
 */
interface UserWorkspaceInterface {
    user_id: string;
    workspace_id: string;
    role:Roles
    created_at?: number;
    updated_at?: number;
}

export default UserWorkspaceInterface
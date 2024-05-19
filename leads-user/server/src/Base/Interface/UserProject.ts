


/**
 * UserProjectInterface
 * @description Interface for UserProject
 * @param userProject_Id: string - UserProject Id
 * @param user_id: string - User Id
 * @param project_id: string - Project Id
 * @param created_at: number - UserProject Created Date - Optional
 * @param updated_at: number - UserProject Updated Date - Optional
 */
interface UserProjectInterface {
    userProject_Id: string;
    user_id: string;
    project_id: string;
    created_at?: number;
    updated_at?: number;
}

export default UserProjectInterface;
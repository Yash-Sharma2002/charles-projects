

/**
 * Interface for Project
 * @readonly
 */
interface ProjectInterface{
    project_Id: string;
    organisation_id: string;
    ProjectNumber?: string;
    name: string;
    description: string;
    Client: string;
    ProjectManager: string;
    ExecutionManager?: string;
    status: string;
    created_at: number;
    updated_at: number;
}

export default ProjectInterface;
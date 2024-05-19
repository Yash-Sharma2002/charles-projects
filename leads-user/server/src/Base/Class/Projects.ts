import Start from "./Start";
import ProjectsInterface from "../Interface/Projects";
import Sequence from "./Sequence";
import Collections from "../../config/collections";
import ResponseClass from "./Response";
import ResStatus from "../../config/response/ResStatus";
import ProjectsMessage from "../../config/response/Projects";

class Projects extends Start implements ProjectsInterface {
  project_Id: string = "";
  organisation_id: string = "";
  ProjectNumber?: string = "";
  name: string = "";
  description: string = "";
  Client: string = "";
  ProjectManager: string = "";
  ExecutionManager?: string;
  status: string = "";
  created_at: number = 0;
  updated_at: number = 0;

  /**
   * Constructor
   * @param project - Project Interface
   */
  constructor(project?: ProjectsInterface) {
    super();
    if (project) {
      this.project_Id = project.project_Id;
      this.organisation_id = project.organisation_id;
      this.ProjectNumber = project.ProjectNumber;
      this.name = project.name;
      this.description = project.description;
      this.Client = project.Client;
      this.ProjectManager = project.ProjectManager;
      this.ExecutionManager = project.ExecutionManager;
      this.status = project.status;
      this.created_at = project.created_at;
      this.updated_at = project.updated_at;
    } else {
      this.project_Id = this.generateId();
      this.created_at = new Date().getTime();
      this.updated_at = new Date().getTime();
    }
  }

  // Getters
  /**
   * Get Project Id
   * @returns string
   */
  getProjectId(): string {
    return this.project_Id;
  }

  /**
 * Get Organisation Id
 * @returns string
 */
  getOrganisationId(): string {
    return this.organisation_id;
  }


  /**
   * Get Project Name
   * @returns string
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get Project Description
   * @returns string
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Get Project Manager
   * @returns string
   */
  getProjectManager(): string {
    return this.ProjectManager;
  }

  /**
   * Get Execution Manager
   * @returns string
   */
  getExecutionManager(): string | undefined {
    return this.ExecutionManager;
  }

  /**
   * Get Status
   * @returns string
   */
  getStatus(): string {
    return this.status;
  }

  /**
   * Get Created At
   * @returns number
   */
  getCreatedAt(): number {
    return this.created_at;
  }

  /**
   * Get Updated At
   * @returns number
   */
  getUpdatedAt(): number {
    return this.updated_at;
  }

  /**
   * Get Project Number
   * @returns string
   */
  getProjectNumber(): string | undefined {
    return this.ProjectNumber;
  }

  /**
   * Get Client
   * @returns string
   */
  getClient(): string {
    return this.Client;
  }

  /**
   * Get Project
   * @returns string
   */
  getProject(): ProjectsInterface {
    return {
      project_Id: this.project_Id,
      organisation_id: this.organisation_id,
      ProjectNumber: this.ProjectNumber,
      name: this.name,
      description: this.description,
      Client: this.Client,
      ProjectManager: this.ProjectManager,
      ExecutionManager: this.ExecutionManager,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Setters
  /**
   * Set Project Id
   * @param project_Id
   */
  setProjectId(project_Id: string) {
    this.project_Id = project_Id;
  }

  /**
   * Set Organisation Id
   * @param organisation_id
   */
  setOrganisationId(organisation_id: string) {
    this.organisation_id = organisation_id;
  }

  /**
   * Set Project Name
   * @param name
   */
  setName(name: string) {
    this.name = name;
  }

  /**
   * Set Project Description
   * @param description
   */
  setDescription(description: string) {
    this.description = description;
  }

  /**
   * Set Project Manager
   * @param ProjectManager
   */
  setProjectManager(ProjectManager: string) {
    this.ProjectManager = ProjectManager;
  }

  /**
   * Set Execution Manager
   * @param ExecutionManager
   */
  setExecutionManager(ExecutionManager: string) {
    this.ExecutionManager = ExecutionManager;
  }

  /**
   * Set Status
   * @param status
   */
  setStatus(status: string) {
    this.status = status;
  }

  /**
   * Set Project Number
   */
  async setProjectNumber() {
    this.ProjectNumber = await new Sequence().getNextSequence(
      Collections.Projects,this.organisation_id
    );
  }

  /**
   * Set Client
   * @param Client
   */
  setClient(Client: string) {
    this.Client = Client;
  }

  /**
   * Set Updated At
   */
  setUpdatedAt() {
    this.updated_at = new Date().getTime();
  }

  /**
   * Set Project
   * @param project - Project Interface
   */
  setProject(project: ProjectsInterface) {
    this.project_Id = project.project_Id;
    this.organisation_id = project.organisation_id;
    this.ProjectNumber = project.ProjectNumber;
    this.name = project.name;
    this.description = project.description;
    this.Client = project.Client;
    this.ProjectManager = project.ProjectManager;
    this.ExecutionManager = project.ExecutionManager;
    this.status = project.status;
    this.created_at = project.created_at;
    this.updated_at = project.updated_at;
  }

  /**
   * Validate Project
   */
  validateProject() {
    this.validateName(this.name);
    this.validateDescription(this.description);
    if (!this.ExecutionManager) throw new ResponseClass(ResStatus.BadRequest, ProjectsMessage.ExecutionManager);
    if (!this.Client) throw new ResponseClass(ResStatus.BadRequest, ProjectsMessage.Client);
    if (!this.ProjectManager) throw new ResponseClass(ResStatus.BadRequest, ProjectsMessage.ProjectManager);
    if (!this.status) throw new ResponseClass(ResStatus.BadRequest, ProjectsMessage.Status);
  }

  /**
   * Get Project Details
   * @param project_Id
   * @param ProjectNumber
   * @param organisation_id
   */
  async getProjectDetails(project_Id: string = this.project_Id, ProjectNumber: string | undefined = this.ProjectNumber, organisation_id: string = this.organisation_id): Promise<ProjectsInterface> {
    return (await this.getOne(Collections.Projects, { $or: [{ project_Id }, { ProjectNumber }], organisation_id })) as unknown as ProjectsInterface;
  }

  /**
   * Check Project Exists
   * @param project_Id
   * @param ProjectNumber
   * @param organisation_id
   */
  async checkProjectExists(project_Id: string = this.project_Id, ProjectNumber: string | undefined = this.ProjectNumber, organisation_id: string = this.organisation_id) {
    const project = await this.getOne(Collections.Projects, { $or: [{ project_Id }, { ProjectNumber }], organisation_id});
    if (project) {
      throw new ResponseClass(ResStatus.BadRequest, ProjectsMessage.AlreadyExists);
    }
  }

  /**
   * Check Project Not Exists
   * @param project_Id
   * @param ProjectNumber
   * @param organisation_id
   */
  async checkProjectNotExists(project_Id: string = this.project_Id, ProjectNumber: string | undefined = this.ProjectNumber, organisation_id: string = this.organisation_id){
    const project = await this.getOne(Collections.Projects, { $or: [{ project_Id }, { ProjectNumber }],organisation_id });
    if (!project) {
      throw new ResponseClass(ResStatus.BadRequest, ProjectsMessage.NotFound);
    }
  }

  /**
   * Get Project by Client
   * @param client_Id
   * @param organisation_id
   */
  async getProjectByClient(client_Id: string = this.Client, organisation_id: string = this.organisation_id): Promise<ProjectsInterface[]> {
    return (await this.getAll(Collections.Projects, { Client: client_Id,organisation_id })) as unknown as ProjectsInterface[];
  }

  /**
   * Get All Projects
   * @param organisation_id
   */
  async getAllProjects( organisation_id: string = this.organisation_id): Promise<ProjectsInterface[]> {
    return (await this.getAll(Collections.Projects, {organisation_id})) as unknown as ProjectsInterface[];
  }

  /**
   * Get Project By Project Manager
   * @param ProjectManager
   * @param organisation_id
   */
  async getProjectByManager(ProjectManager: string = this.ProjectManager, organisation_id: string = this.organisation_id): Promise<ProjectsInterface[]> {
    return (await this.getAll(Collections.Projects, { ProjectManager: ProjectManager,organisation_id })) as unknown as ProjectsInterface[];
  }

  /**
   * Get Project By Execution Manager
   * @param ExecutionManager
   * @param organisation_id
   */
  async getProjectByExecutionManager(ExecutionManager: string | undefined = this.ExecutionManager, organisation_id: string = this.organisation_id): Promise<ProjectsInterface[]> {
    return (await this.getAll(Collections.Projects, { ExecutionManager: ExecutionManager,organisation_id })) as unknown as ProjectsInterface[];
  }

  /**
   * Get Project By Status
   * @param status
   * @param organisation_id
   */
  async getProjectByStatus(status: string = this.status, organisation_id: string = this.organisation_id): Promise<ProjectsInterface[]> {
    return (await this.getAll(Collections.Projects, { status,organisation_id })) as unknown as ProjectsInterface[];
  }

  /**
   * Create Project
   */
  async createProject() {
    this.insertOne(Collections.Projects, this.getProject());
  }

  /**
   * Update Project
   */
  async updateProject() {
    this.updateOne(Collections.Projects, { project_Id: this.project_Id,organisation_id:this.organisation_id }, { $set: this.getProject() });
  }

  /**
   * Delete Project
   * @param project_Id
   * @param ProjectNumber
   * @param organisation_id
   */
  async deleteProject(project_Id: string = this.project_Id, ProjectNumber: string | undefined = this.ProjectNumber, organisation_id: string = this.organisation_id) {
    this.deleteOne(Collections.Projects, { $or: [{ project_Id }, { ProjectNumber }] ,organisation_id});
  }

  /**
   * Flush
   */
  async flush() {
    super.flush();
    this.project_Id = "";
    this.organisation_id = "";
    this.ProjectNumber = "";
    this.name = "";
    this.description = "";
    this.Client = "";
    this.ProjectManager = "";
    this.ExecutionManager = "";
    this.status = "";
    this.created_at = 0;
    this.updated_at = 0;
  }

}

export default Projects;

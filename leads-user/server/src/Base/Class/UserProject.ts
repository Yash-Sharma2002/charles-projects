import Collections from "../../config/collections";
import ResStatus from "../../config/response/ResStatus";
import UserProjectResponse from "../../config/response/UserProject";
import UserProjectInterface from "../Interface/UserProject";
import ResponseClass from "./Response";
import Start from "./Start";

class UserProject extends Start implements UserProjectInterface {
  userProject_Id: string = "";
  user_id: string = "";
  project_id: string = "";
  created_at?: number;
  updated_at?: number;

  /**
   * Constructor
   * @param userProject
   */
  constructor(userProject?: UserProjectInterface) {
    super();
    this.userProject_Id = userProject?.userProject_Id || this.generateId();
    this.user_id = userProject?.user_id || "";
    this.project_id = userProject?.project_id || "";
    this.created_at = userProject?.created_at || Date.now();
    this.updated_at = userProject?.updated_at || Date.now();
  }

  // Getters
  /**
   * Get UserProject Id
   * @returns UserProject Id
   */
  getUserProjectId(): string {
    return this.userProject_Id;
  }

  /**
   * Get User Id
   * @returns User Id
   */
  getUserId(): string {
    return this.user_id;
  }

  /**
   * Get Project Id
   * @returns Project Id
   */
  getProjectId(): string {
    return this.project_id;
  }

  /**
   * Get Created Date
   * @returns Created Date
   */
  getCreatedDate(): number | undefined {
    return this.created_at;
  }

  /**
   * Get Updated Date
   * @returns Updated Date
   */
  getUpdatedDate(): number | undefined {
    return this.updated_at;
  }

  /**
   * Get UserProject
   */
  getUserProject() {
    return {
      userProject_Id: this.userProject_Id,
      user_id: this.user_id,
      project_id: this.project_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Setters
  /**
   * Set UserProject Id
   * @param userProject_Id
   */
  setUserProjectId(userProject_Id: string) {
    this.userProject_Id = userProject_Id;
  }

  /**
   * Set User Id
   * @param user_id
   */
  setUserId(user_id: string) {
    this.user_id = user_id;
  }

  /**
   * Set Project Id
   * @param project_id
   */
  setProjectId(project_id: string) {
    this.project_id = project_id;
  }

  /**
   * Set Created Date
   */
  setCreatedDate() {
    this.created_at = new Date().getTime();
  }

  /**
   * Set Updated Date
   */
  setUpdatedDate() {
    this.updated_at = new Date().getTime();
  }

  /**
   * Set UserProject
   * @param userProject
   */
  setUserProject(userProject: UserProjectInterface) {
    this.userProject_Id = userProject.userProject_Id;
    this.user_id = userProject.user_id;
    this.project_id = userProject.project_id;
    this.created_at = userProject.created_at;
    this.updated_at = userProject.updated_at;
  }

  /**
   * Get User Project
   */
  async getUserProjectDetails(
    userProject_Id: string = this.userProject_Id,
    user_id: string = this.user_id,
    project_id: string = this.project_id
  ) {
    return await this.getOne(Collections.UserProjects, {
      $or: [{ userProject_Id }, { user_id }, { project_id }],
    });
  }
  /**
   * Check User Project Exists
   * @param userProject_Id
   * @param user_id
   * @param project_id
   */
  async checkUserProjectExists(
    userProject_Id: string = this.userProject_Id,
    user_id: string = this.user_id,
    project_id: string = this.project_id
  ) {
    const userProject = await this.getOne(Collections.UserProjects, {
      $or: [{ userProject_Id }, { user_id }, { project_id }],
    });
    if (!userProject) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserProjectResponse.AlreadyExist
      );
    }
  }

  /**
   * Check User Project Not Exists
   * @param userProject_Id
   * @param user_id
   * @param project_id
   */
  async checkUserProjectNotExists(
    userProject_Id: string = this.userProject_Id,
    user_id: string = this.user_id,
    project_id: string = this.project_id
  ) {
    const userProject = await this.getOne(Collections.UserProjects, {
      $or: [{ userProject_Id }, { user_id }, { project_id }],
    });
    if (userProject) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserProjectResponse.NotFound
      );
    }
  }

  /**
   * Check and Get User Project
   * @param userProject_Id
   * @param user_id
   * @param project_id
   * @returns UserProject
   */
  async checkAndGetUserProject(
    userProject_Id: string = this.userProject_Id,
    user_id: string = this.user_id,
    project_id: string = this.project_id
  ) {
    const userProject = await this.getUserProjectDetails(
      userProject_Id,
      user_id,
      project_id
    );
    if (!userProject) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserProjectResponse.NotFound
      );
    }
    return userProject;
  }

  /**
   * Create User Project
   * @param userProject
   */
  async createUserProject() {
    await this.insertOne(Collections.UserProjects, this.getUserProject());
  }

  /**
   * Update User Project
   * @param userProject
   */
  async updateUserProject() {
    await this.updateOne(
      Collections.UserProjects,
      { userProject_Id: this.userProject_Id },
      { $set: this.getUserProject() }
    );
  }

  /**
   * Remove User Project
   */
  async removeUserProject() {
    await this.deleteOne(Collections.UserProjects, {
      userProject_Id: this.userProject_Id,
    });
  }

  /**
   * Flush
   */
    flush() {
        super.flush();
        this.userProject_Id = "";
        this.user_id = "";
        this.project_id = "";
    }
}


export default UserProject;
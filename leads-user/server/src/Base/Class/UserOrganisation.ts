import Collections from "../../config/collections";
import UserOrganisationInterface from "../Interface/UserOrganisation";
import Roles from "../../config/Roles";
import Start from "./Start";
import UserOrganisationMessage from "../../config/response/UserOrganisation";
import CommonMessage from "../../config/response/CommonMessage";
import ResponseClass from "./Response";
import ResStatus from "../../config/response/ResStatus";

class UserOrganisation extends Start implements UserOrganisationInterface {
  user_id: string;
  organisation_id: string;
  role: Roles;

  /**
   * Constructor
   * @param userOrganisation
   */
  constructor(userOrganisation?: UserOrganisationInterface) {
    super();
    this.user_id = userOrganisation?.user_id || "";
    this.organisation_id = userOrganisation?.organisation_id || "";
    this.role = userOrganisation?.role || Roles.None;
  }

  // Getters
  /**
   * Get User Id
   * @returns User Id
   */
  getUserId(): string {
    return this.user_id;
  }

  /**
   * Get Organisation Id
   * @returns Organisation Id
   */
  getOrganisationId(): string {
    return this.organisation_id;
  }

  /**
   * Get Role
   * @returns Role
   */
  getRole(): Roles {
    return this.role;
  }

  /**
   * Get User Organisation
   * @returns User Organisation
   */
  getUserOrganisation(): UserOrganisationInterface {
    return {
      user_id: this.user_id,
      organisation_id: this.organisation_id,
      role: this.role,
    };
  }

  // Setters
  /**
   * Set User Id
   * @param user_id
   */
  setUserId(user_id: string): void {
    this.user_id = user_id;
  }

  /**
   * Set Organisation Id
   * @param organisation_id
   */
  setOrganisationId(organisation_id: string): void {
    this.organisation_id = organisation_id;
  }

  /**
   * Set Role
   * @param role
   */
  setRole(role: Roles): void {
    this.role = role;
  }

  /**
   * Set User Organisation
   * @param userOrganisation
   */
  setUserOrganisation(userOrganisation: UserOrganisationInterface): void {
    this.user_id = userOrganisation.user_id;
    this.organisation_id = userOrganisation.organisation_id;
    this.role = userOrganisation.role;
  }

  /**
   * Get User Organisation By Organisation Id
   * @param user_id
   * @param organisation_id - Optional
   */
  async getUserOrganisationByDetails(
    user_id: string = this.user_id,
    organisation_id: string = this.organisation_id
  ) {
    return this.getOne(Collections.UserOrganisation, {
      $and: [{ user_id }, { organisation_id }],
    }) as unknown as UserOrganisationInterface;
  }

  /**
   * Get User Organisation By User Id
   * @param user_id
   */
  async getUserOrganisationByUserId(user_id: string = this.user_id) {
    return this.getOne(Collections.UserOrganisation, {
      user_id,
    }) as unknown as UserOrganisationInterface;
  }

  /**
   * Check User Already Exists
   * @param user_id
   * @param organisation_id
   */
  async checkUserExistsOrganisation(
    user_id: string = this.user_id,
    organisation_id: string = this.organisation_id
  ) {
    const collection = await this.getUserOrganisationByDetails(
      user_id,
      organisation_id
    );
    if (collection) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserOrganisationMessage.UserAlreadyExists
      );
    }
  }

  /**
   * Check User Not Exists
   * @param user_id
   * @param organisation_id
   */
  async checkUserExistsOrganisationV2(
    user_id: string = this.user_id,
    organisation_id: string = this.organisation_id
  ) {
    const collection = await this.getUserOrganisationByDetails(
      user_id,
      organisation_id
    );
    if (!collection) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserOrganisationMessage.UserNotFound
      );
    }
  }

  /**
   * Check User Not Exists
   * @param user_id
   */
  async checkUserExists(user_id: string = this.user_id) {
    const collection = await this.getUserOrganisationByUserId(user_id);
    if (collection) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserOrganisationMessage.UserAlreadyExists
      );
    }
  }

  /**
   * Check User Not Exists
   * @param user_id
   */
  async checkUserExistsV2(user_id: string = this.user_id) {
    const collection = await this.getUserOrganisationByUserId(user_id);
    if (!collection) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserOrganisationMessage.UserNotFound
      );
    }
  }

  /**
   * Check User Not Admin
   * @param user_id
   * @param organisation_id
   */
  async checkUserNotAdmin(
    user_id: string = this.user_id,
    organisation_id: string = this.organisation_id
  ) {
    const collection = await this.getUserOrganisationByDetails(
      user_id,
      organisation_id
    );
    if (!collection) {
      throw new ResponseClass(
        ResStatus.Unauthorized,
        UserOrganisationMessage.UserNotFound
      );
    }
    if (
      collection.role !== Roles.OrganisationAdmin &&
      collection.role !== Roles.OrganisationOwner
    ) {
      throw new ResponseClass(
        ResStatus.Unauthorized,
        UserOrganisationMessage.UserNotAdmin
      );
    }
  }

  /**
   * Add User in Organisation
   */
  async addUserInOrganisation() {
    // await this.checkUserExists();
    await this.insertOne(
      Collections.UserOrganisation,
      this.getUserOrganisation()
    );
  }

  /**
   * Update User role Organisation
   */
  async updateUserOrganisation() {
    // await this.checkUserExistsV2();
    await this.updateOne(
      Collections.UserOrganisation,
      {
        user_id: this.user_id,
      },
      {
        $set: this.getUserOrganisation(),
      }
    );
  }

  /**
   * Delete User from Organisation
   * @param user_id
   * @param organisation_id
   */
  async deleteUserOrganisation(
    user_id: string = this.user_id,
    organisation_id: string = this.organisation_id
  ) {
    await this.deleteOne(Collections.UserOrganisation, {$and: [{ user_id }, { organisation_id }]});
  }

  /**
   * Flush User Organisation
   */
  flush() {
    super.flush();
    this.user_id = "";
    this.organisation_id = "";
    this.role = Roles.None;
  }
}

export default UserOrganisation;

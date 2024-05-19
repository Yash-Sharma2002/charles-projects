import Collections from "../../config/collections";
import ResStatus from "../../config/response/ResStatus";
import OrganisationMessage from "../../config/response/Organisation";
import OrganisationInterface from "../Interface/Organisation";
import ResponseClass from "./Response";
import Start from "./Start";

class Organisation extends Start implements OrganisationInterface {
  organisation_id: string;
  organisation_name: string;
  organisation_image: string;
  organisation_description?: string;
  organisation_email: string;
  organisation_website?: string;
  organisation_phone: string;
  organisation_type: string;
  organisation_address: string;

  constructor(organisation?: OrganisationInterface) {
    super();
    this.organisation_id = organisation?.organisation_id || this.generateId();
    this.organisation_name = organisation?.organisation_name || "";
    this.organisation_image = organisation?.organisation_image || "";
    this.organisation_description =
      organisation?.organisation_description || "";
    this.organisation_email = organisation?.organisation_email || "";
    this.organisation_website = organisation?.organisation_website || "";
    this.organisation_phone = organisation?.organisation_phone || "";
    this.organisation_type = organisation?.organisation_type || "";
    this.organisation_address = organisation?.organisation_address || "";
  }

  // Getters
  /**
   * Get organisation_id
   * @description Get the id of the organisation
   * @returns organisation_id
   */
  getOrganisationId(): string {
    return this.organisation_id;
  }

  /**
   * Get organisation_name
   * @description Get the name of the organisation
   * @returns organisation_name
   */
  getOrganisationName(): string {
    return this.organisation_name;
  }

  /**
   * Get organisation_image
   * @description Get the image of the organisation
   * @returns organisation_image
   */
  getOrganisationImage(): string {
    return this.organisation_image;
  }
  /**
   * Get organisation_email
   * @description Get the email of the organisation
   * @returns organisation_email
   */
  getOrganisationEmail(): string {
    return this.organisation_email;
  }

  /**
   * Get organisation_phone
   * @description Get the phone number of the organisation
   * @returns organisation_phone
   */
  getOrganisationPhone(): string {
    return this.organisation_phone;
  }

  /**
   * Get organisation_address
   * @description Get the address of the organisation
   * @returns organisation_address
   */
  getOrganisationAddress(): string {
    return this.organisation_address;
  }

  /**
   * Get organisation_description
   * @description Get the description of the organisation
   * @returns organisation_description
   */
  getOrganisationDescription(): string | undefined {
    return this.organisation_description;
  }

  /**
   * Get organisation_website
   * @description Get the website of the organisation
   * @returns organisation_website
   */
  getOrganisationWebsite(): string | undefined {
    return this.organisation_website;
  }

  /**
   * Get organisation_type
   * @description Get the type of organisation
   * @returns organisation_type
   */
  getOrganisationType(): string | undefined {
    return this.organisation_type;
  }

  /**
   * Get Organisation
   * @description Get organisation details
   * @returns Organisation
   */
  getOrganisation(): OrganisationInterface {
    return {
      organisation_id: this.organisation_id,
      organisation_name: this.organisation_name,
      organisation_image: this.organisation_image,
      organisation_description: this.organisation_description,
      organisation_email: this.organisation_email,
      organisation_website: this.organisation_website,
      organisation_phone: this.organisation_phone,
      organisation_type: this.organisation_type,
      organisation_address: this.organisation_address,
    };
  }

  // Setters
  /**
   * Set organisation_id
   * @description Set the id of the organisation
   * @param organisation_id
   * @returns void
   */
  setOrganisationId(organisation_id: string = this.organisation_id): void {
    this.organisation_id = organisation_id;
  }

  /**
   * Set organisation_name
   * @description Set the name of the organisation
   * @param organisation_name
   * @returns void
   */
  setOrganisationName(
    organisation_name: string = this.organisation_name
  ): void {
    this.organisation_name = organisation_name;
  }

  /**
   * Set organisation_image
   * @description Set the image of the organisation
   * @param organisation_image
   * @returns void
   */
  setOrganisationImage(
    organisation_image: string = this.organisation_image
  ): void {
    this.organisation_image = organisation_image;
  }

  /**
   * Set organisation_email
   * @description Set the email of the organisation
   * @param organisation_email
   * @returns void
   */
  setOrganisationEmail(
    organisation_email: string = this.organisation_email
  ): void {
    this.organisation_email = organisation_email;
  }

  /**
   * Set organisation_phone
   * @description Set the phone number of the organisation
   * @param organisation_phone
   * @returns void
   */
  setOrganisationPhone(
    organisation_phone: string = this.organisation_phone
  ): void {
    this.organisation_phone = organisation_phone;
  }

  /**
   * Set organisation_address
   * @description Set the address of the organisation
   * @param organisation_address
   * @returns void
   */
  setOrganisationAddress(
    organisation_address: string = this.organisation_address
  ): void {
    this.organisation_address = organisation_address;
  }

  /**
   * Set organisation_description
   * @description Set the description of the organisation
   * @param organisation_description
   * @returns void
   */
  setOrganisationDescription(
    organisation_description: string | undefined = this.organisation_description
  ): void {
    this.organisation_description = organisation_description;
  }

  /**
   * Set organisation_website
   * @description Set the website of the organisation
   * @param organisation_website
   * @returns void
   */
  setOrganisationWebsite(
    organisation_website: string | undefined = this.organisation_website
  ): void {
    this.organisation_website = organisation_website;
  }

  /**
   * Set organisation_type
   * @description Set the type of organisation
   * @param organisation_type
   * @returns void
   */
  setOrganisationType(
    organisation_type: string | undefined = this.organisation_type
  ): void {
    this.organisation_type = organisation_type;
  }

  /**
   * Set Organisation
   * @description Set organisation details
   * @param organisation
   * @returns void
   */
  setOrganisation(organisation: OrganisationInterface): void {
    this.organisation_id = organisation.organisation_id;
    this.organisation_name = organisation.organisation_name;
    this.organisation_image = organisation.organisation_image;
    this.organisation_description = organisation.organisation_description;
    this.organisation_email = organisation.organisation_email;
    this.organisation_website = organisation.organisation_website;
    this.organisation_phone = organisation.organisation_phone;
    this.organisation_type = organisation.organisation_type;
    this.organisation_address = organisation.organisation_address || "";
  }

  /**
   * Validate Organisation
   * @description Validate organisation details
   * @returns
   */
  validate() {
    this.validateId(this.organisation_id);
    this.validateName(this.organisation_name);
    this.validateEmail(this.organisation_email);
    this.validatePhone(this.organisation_phone);
    this.validateType(this.organisation_type);
  }

  /**
   * Get Organisation Details
   * @description Get organisation Details by id
   * @param organisation_id
   * @param organisation_name
   * @param organisation_email
   * @returns
   */
  async getOrganisationByDetails(organisation_id: string = this.organisation_id, organisation_name: string = this.organisation_name, organisation_email: string = this.organisation_email): Promise<OrganisationInterface> {
    return (await this.getOne(Collections.Organisation, { $or: [{ organisation_id }, { organisation_name }, { organisation_email }] })) as unknown as OrganisationInterface;
  }

  /**
   * Check Organisation Exists
   * @description Check if organisation exists
   * @param organisation_id
   */
  async checkOrganisationExists(organisation_name: string = this.organisation_name, organisation_email: string = this.organisation_email, organisation_id: string = this.organisation_id) {
    const organisation = await this.getOne(Collections.Organisation, { $or: [{ organisation_name }, { organisation_email }, { organisation_id }] });
    if (organisation) {
      throw new ResponseClass(ResStatus.BadRequest, OrganisationMessage.AlreadyExists);
    }
  }

  /**
   * Check Organisation Exists V2
   * @description Check if organisation exists
   * @param organisation_id
   * @param organisation_name
   * @param organisation_email
   */
  async checkOrganisationExistsV2(organisation_id: string = this.organisation_id, organisation_name: string = this.organisation_name, organisation_email: string = this.organisation_email) {
    const organisation = await this.getOne(Collections.Organisation, { $or: [{ organisation_name }, { organisation_email }, { organisation_id }] });
    if (!organisation) {
      throw new ResponseClass(ResStatus.BadRequest, OrganisationMessage.NotFound);
    }
  }

  /**
   * Create Organisation
   * @description Create a new organisation
   * @returns
   */
  async createOrganisation() {
    await this.insertOne(Collections.Organisation, this.getOrganisation());
  }

  /**
   * Update Organisation
   * @description Update organisation details
   * @returns
   */
  async updateOrganisation() {
    await this.updateOne(
      Collections.Organisation,
      {
        organisation_id: this.organisation_id,
      },
      {
        $set: {
          organisation_image: this.organisation_image,
          organisation_description: this.organisation_description,
          organisation_email: this.organisation_email,
          organisation_website: this.organisation_website,
          organisation_phone: this.organisation_phone,
          organisation_type: this.organisation_type,
        },
      }
    );
  }

  /**
   * Delete Organisation
   * @description Delete organisation
   * @param organisation_id
   * @returns
   */
  async deleteOrganisation(organisation_id: string = this.organisation_id) {
    await this.deleteOne(Collections.Organisation, { organisation_id: organisation_id });
  }

  /**
   * Flush Organisation Class
   * @description Flush Organisation Class
   * @returns void
   */
  flush() {
    super.flush();
    this.organisation_id = "";
    this.organisation_name = "";
    this.organisation_image = "";
    this.organisation_description = "";
    this.organisation_email = "";
    this.organisation_website = "";
    this.organisation_phone = "";
    this.organisation_type = "";
    this.organisation_address = "";
  }
}

export default Organisation;

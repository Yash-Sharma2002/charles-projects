import Collections from "../../config/collections";
import ClientFields from "../../config/response/Client";
import ResStatus from "../../config/response/ResStatus";
import ClientInterface from "../Interface/Client";
import ResponseClass from "./Response";
import Sequence from "./Sequence";
import Start from "./Start";
import UserClass from "./User";

class Client extends Start implements ClientInterface {
  client_Id: string = "";
  organisation_id: string;
  name: string = "";
  email: string = "";
  username?: string;
  phone: string = "";
  address?: string;
  SalesManager?: string;
  created_at?: number;
  updated_at?: number;

  /**
   * Constructor
   * @param client - Client Interface
   */
  constructor(client?: ClientInterface) {
    super();
    this.client_Id = client?.client_Id || this.generateId();
    this.organisation_id = client?.organisation_id || "";
    this.name = client?.name || this.name;
    this.email = client?.email || this.email;
    this.phone = client?.phone || this.phone;
    this.address = client?.address || "";
    this.SalesManager = client?.SalesManager || "";
    this.created_at = client?.created_at || new Date().getTime();
    this.updated_at = client?.updated_at || new Date().getTime();
    this.username = client?.username || "";
  }

  // Getters
  /**
   * Get Client Id
   * @returns string
   */
  getClientId(): string {
    return this.client_Id;
  }

  /**
   * Get Organisation Id
   * @returns string
   */
  getOrganisationId(): string {
    return this.organisation_id;
  }

  /**
   * Get Client Name
   * @returns string
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get Client Email
   * @returns string
   */
  getEmail(): string {
    return this.email;
  }

  /**
   * Get Client Username
   * @returns string
   */
  getUsername(): string | undefined {
    return this.username;
  }

  /**
   * Get Client Sales Manager
   */
  getSalesManager(): string | undefined {
    return this.SalesManager;
  }

  /**
   * Get Client Phone
   * @returns string
   */
  getPhone(): string | undefined {
    return this.phone;
  }

  /**
   * Get Client Address
   * @returns string
   */
  getAddress(): string | undefined {
    return this.address;
  }

  /**
   * Get Client Created Date
   * @returns Date
   */
  getCreatedAt(): number | undefined {
    return this.created_at;
  }

  /**
   * Get Client Updated Date
   * @returns Date
   */
  getUpdatedAt(): number | undefined {
    return this.updated_at;
  }

  /**
   * Get Client
   * @returns ClientInterface
   */
  getClient(): ClientInterface {
    return {
      client_Id: this.client_Id,
      organisation_id: this.organisation_id,
      name: this.name,
      email: this.email,
      username: this.username,
      SalesManager: this.SalesManager,
      phone: this.phone,
      address: this.address,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Setters
  /**
   * Set Client Id
   * @param client_Id - Client Id
   */
  setClientId(client_Id: string) {
    this.client_Id = client_Id;
  }

  /**
   * Set Organisation Id
   * @param organisation_id - Organisation Id
   */
  setOrganisationId(organisation_id: string) {
    this.organisation_id = organisation_id;
  }

  /**
   * Set Client Name
   * @param name - Client Name
   */
  setName(name: string) {
    this.name = name;
  }

  /**
   * Set Client Email
   * @param email - Client Email
   */
  setEmail(email: string) {
    this.email = email;
  }

  /**
   * Set Client Username
   */
  async setUsername() {
      let seq = new Sequence();
      await seq.connectDb();
      this.username = await seq.getNextSequence(Collections.Client, this.organisation_id);
      seq.flush();
  }

  /**
   * Set Client Sales Manager
   * @param SalesManager - Sales Manager
   */
  setSalesManager(SalesManager: string) {
    this.SalesManager = SalesManager;
  }

  /**
   * Set Client Phone
   * @param phone - Client Phone
   */
  setPhone(phone: string) {
    this.phone = phone;
  }

  /**
   * Set Client Address
   * @param address - Client Address
   */
  setAddress(address: string) {
    this.address = address;
  }

  /**
   * Set Client Created Date
   */
  setCreatedAt() {
    this.created_at = new Date().getTime();
  }

  /**
   * Set Client Updated Date
   */
  setUpdatedAt() {
    this.updated_at = new Date().getTime();
  }

  /**
   * Set Client
   * @param client - Client Interface
   */
  setClient(client: ClientInterface) {
    this.client_Id = client.client_Id;
    this.organisation_id = client.organisation_id;
    this.name = client.name;
    this.email = client.email;
    this.username = client.username;
    this.phone = client.phone;
    this.SalesManager = client.SalesManager;
    this.address = client.address;
    this.created_at = client.created_at;
    this.updated_at = client.updated_at;
  }

  /**
   * Validate Client
   */
  validate() {
    this.validateName(this.name);
    this.validateEmail(this.email);
    this.validatePhone(this.phone);
  }

  /**
   * Get Sales Manager Details
   */
  async getSalesManagerDetails() {
    return await new UserClass().getUserByDetails("", "", this.SalesManager);
  }

  /**
   * Get Client Details
   * @param client_Id
   * @param email
   * @param username
   * @param organisation_id
   */
  async getClientDetails(
    client_Id: string = this.client_Id,
    email: string = this.email,
    username: string | undefined = this.username,
    organisation_id: string = this.organisation_id
  ): Promise<ClientInterface> {
    return (await this.getOne(Collections.Client, {
      $or: [{ client_Id }, { email }, { username }],
      organisation_id,
    })) as unknown as ClientInterface;
  }

  /**
   * Get All Clients
   * @param organisation_id
   * @returns ClientInterface[]
   */
  async getAllClients(organisation_id:string = this.organisation_id): Promise<ClientInterface[]> {
    return (await this.getAll(
      Collections.Client,
      {organisation_id}
    )) as unknown as ClientInterface[];
  }

  /**
   * Check Client Exists
   * @param client_Id
   * @param email
   * @param username
   * @param organisation_id
   * @returns ClientInterface
   */
  async checkClientExists(
    client_Id: string = this.client_Id,
    email: string = this.email,
    username: string | undefined = this.username,
    organisation_id: string = this.organisation_id
  ) {
    let client = await this.getClientDetails(client_Id, email, username, organisation_id);
    if (client) {
      throw new ResponseClass(ResStatus.Conflict, ClientFields.AlreadyExists);
    }
  }

  /**
   * Check Client Not Exists
   * @param client_Id
   * @param email
   * @param username
   * @param organisation_id
   * @returns ClientInterface
   */
  async checkClientNotExists(
    client_Id: string = this.client_Id,
    email: string = this.email,
    username: string | undefined = this.username,
    organisation_id: string = this.organisation_id
  ) {
    let client = await this.getClientDetails(client_Id, email, username,organisation_id);
    if (!client) {
      throw new ResponseClass(ResStatus.NotFound, ClientFields.NotFound);
    }
  }

  /**
   * Save Client
   */
  async saveClient() {
    await this.insertOne(Collections.Client, this.getClient());
  }

  /**
   * Update Client
   */
  async updateClient() {
    await this.updateOne(
      Collections.Client,
      { client_Id: this.client_Id, organisation_id: this.organisation_id},
      { $set: this.getClient()}
    );
  }

  /**
   * Delete Client
   */
  async deleteClient() {
    await this.deleteOne(Collections.Client, { client_Id: this.client_Id, organisation_id: this.organisation_id});
  }

  /**
   * Flush
   */
  async flush() {
    super.flush();
    this.client_Id = "";
    this.organisation_id = "";
    this.name = "";
    this.email = "";
    this.username = "";
    this.phone = "";
    this.address = "";
    this.SalesManager = "";
    this.created_at = 0;
    this.updated_at = 0;
  }
}

export default Client;

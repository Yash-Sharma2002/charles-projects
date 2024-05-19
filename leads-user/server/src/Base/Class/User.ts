import User from "../Interface/User";
import ResStatus from "../../config/response/ResStatus";
import ResponseClass from "./Response";
import UserFieldsMessage from "../../config/response/User";
import Collections from "../../config/collections";
import Hash from "./Hash";
import Start from "./Start";
import UserInterface from "../Interface/User";
import Status from "../../config/Status";

class UserClass extends Start implements UserInterface {
  uid: string = "";
  name: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  status: Status = Status.Active;
  provider: string = "";
  phone: string = "";
  address: string = "";

  /**
   * Constructor
   * @param user
   */
  constructor(user?: User) {
    super();
    this.uid = user?.uid || this.generateId();
    this.name = user?.name || user?.username || "";
    this.username = user?.username || "";
    this.email = user?.email || "";
    this.password = user?.password || "";
    this.status = user?.status || Status.Active;
    this.provider = user?.provider || "";
    this.phone = user?.phone || "";
    this.address = user?.address || "";
  }

  // Getters
  /**
   * Get User Id
   * @returns User Id
   */
  getUserId(): string {
    return this.uid;
  }

  /**
   * Get Name
   * @returns Name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get Username
   * @returns Username
   */
  getUsername(): string {
    return this.username;
  }

  /**
   * Get Email
   * @returns Email
   */
  getEmail(): string {
    return this.email;
  }

  /**
   * Get Password
   * @returns Password
   */
  getPassword(): string {
    return this.password;
  }

  /**
   * Get Status
   * @returns Status
   */
  getStatus(): Status {
    return this.status;
  }

  /**
   * Get Provider
   * @returns Provider
   */
  getProvider(): string {
    return this.provider;
  }

  /**
   * Get Phone
   * @returns Phone
   */
  getPhone(): string {
    return this.phone;
  }

  /**
   * Get Address
   * @returns Address
   */
  getAddress(): string {
    return this.address;
  }

  /**
   * Get User
   * @returns User
   */
  getUser(): User {
    return {
      uid: this.uid,
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      status: this.status,
      provider: this.provider,
      phone: this.phone,
      address: this.address,
    };
  }

  // Setters
  /**
   * Set User Id
   * @param uid
   */
  setUserId(uid: string): void {
    this.uid = uid;
  }

  /**
   * Set Name
   * @param name
   */
  setName(name: string): void {
    this.name = name;
  }

  /**
   * Set Username
   * @param username
   */
  setUsername(username: string): void {
    this.username = username;
  }

  /**
   * Set Email
   * @param email
   */
  setEmail(email: string): void {
    this.email = email;
  }

  /**
   * Set Password
   * @param password
   */
  setPassword(password: string): void {
    this.password = password;
  }

  /**
   * Set Status
   * @param status
   */
  setStatus(status: Status): void {
    this.status = status;
  }

  /**
   * Set Provider
   * @param provider
   */
  setProvider(provider: string): void {
    this.provider = provider;
  }

  /**
   * Set Phone
   * @param phone
   */
  setPhone(phone: string): void {
    this.phone = phone;
  }

  /**
   * Set Address
   * @param address
   */
  setAddress(address: string): void {
    this.address = address;
  }

  /**
   * Set User
   * @param user
   */
  setUser(user: User): void {
    this.uid = user.uid;
    this.name = user.name || user.username;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.status = user.status || Status.Active;
    this.provider = user.provider || "email";
    this.phone = user.phone || "";
    this.address = user.address || "";
  }

  /**
   * Validate User
   * @param user
   */
  validateUser(isUpdate:boolean = false,user: User = this.getUser()): void {
    this.validateId(user.uid);
    this.validateUsername(user.username);
    this.validateName(user.name || user.username);
    this.validateEmail(user.email);
    if(!isUpdate) this.validatePassword(user.password);
  }

  /**
   * Get User By Email
   * @param email
   * @param username
   * @param uid
   * @returns
   */
  async getUserByDetails(
    email: string = this.email,
    username: string = this.username,
    uid: string = this.uid
  ): Promise<User> {
    return (await this.getOne(Collections.User, {
      $or: [{ email }, { username }, { uid }],
    })) as unknown as User;
  }

  /**
   * Check User Exists
   * @param email
   * @param username
   */
  async checkUserExists(
    email: string = this.email,
    username: string = this.username,
    uid: string = this.uid
  ) {
    const user = await this.getOne(Collections.User, {
      $or: [{ email }, { username }, { uid }],
    });
    if (user) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserFieldsMessage.UserAlreadyExists
      );
    }
  }

  /**
   * Check User Exists
   * @param uid
   * @param email
   * @param username
   */
  async checkUserExistsV2(
    uid: string = this.uid,
    email: string = this.email,
    username: string = this.username
  ) {
    const user = await this.getOne(Collections.User, {
      $or: [{ email }, { username }, { uid }],
    });
    if (!user) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserFieldsMessage.UserNotFound
      );
    }
  }

  /**
   * Check and Get User
   * @param email
   * @param username
   * @param uid
   * @returns User
   */
  async checkAndGetUser(
    email: string = this.email,
    username: string = this.username,
    uid: string = this.uid
  ): Promise<User> {
    const user = await this.getUserByDetails(email, username, uid);
    if (!user) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        UserFieldsMessage.UserNotFound
      );
    }
    return user;
  }

  /**
   * Create User
   * @param user
   */
  async createUser(user: User = this.getUser()) {
    // this.validateUser();
    // await this.checkUserExists(user.email, user.username);
    user.password = new Hash(user.password).hash();
    await this.insertOne(Collections.User, user);
  }

  /**
   * Update User
   * @param user
   */
  async updateUser(user: User = this.getUser()) {
    // this.validateUser();
    // await this.checkUserExistsV2(user.uid);
    user.name = user.name || user.username;
    await this.updateOne(Collections.User, { uid: user.uid }, { $set: {
      name: user.name,
      username: user.username,
      email: user.email,
      status: user.status,
      phone: user.phone
    }});
  }

  /**
   * Delete User
   * @param uid
   */
  async deleteUser(uid: string = this.uid) {
   await this.deleteOne(Collections.User, { uid });
  }

  /**
   * Update Password
   * @returns
   */
  async updatePassword() {
    this.password = new Hash(this.password).hash();
    console.log(this.password);
    await this.updateOne(Collections.User, { uid: this.uid }, { $set: { password: this.password } });
  }

  /**
   * Flush
   */
  async flush() {
    super.flush();
    this.uid = "";
    this.name = "";
    this.username = "";
    this.email = "";
    this.password = "";
    this.status = Status.Active;
    this.provider = "";
    this.phone = "";
    this.address = "";
  }
}

export default UserClass;

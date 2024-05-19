import Bearer from "./Bearer";
import Session from "./Session";
import Collections from "../../config/collections";
import ResStatus from "../../config/response/ResStatus";
import ResponseClass from "./Response";
import UserFieldsMessage from "../../config/response/User";
import Start from "./Start";
import UserAccessInterface from "../Interface/UserAccess";
import CommonFields from "../../config/response/CommonFields";
import CommonMessage from "../../config/response/CommonMessage";

class UserAccess extends Start implements UserAccessInterface {
  uid: string = "";
  session: string = "";
  access_token: string = "";

  /**
   * Constructor
   * @param uid
   * @param session
   * @param access_token
   */
  constructor(uid?: string, session?: string, access_token?: string) {
    super();
    this.uid = uid ? uid : "";
    this.session = session ? session : "";
    this.access_token = access_token ? access_token : "";
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
   * Get Session
   * @returns Session
   */
  getSession(): string {
    return this.session;
  }

  /**
   * Get Access Token
   * @returns Access Token
   */
  getAccessToken(): string {
    return this.access_token;
  }

  /**
   * Get Access
   * @returns
   * @memberof UserAccess
   */
  getAccess() {
    return {
      uid: this.uid,
      session: this.session,
      access_token: this.access_token,
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
   * Set Session
   * @param session
   */
  setSession(session: string): void {
    this.session = session;
  }

  /**
   * Set Access Token
   * @param access_token
   */
  setAccessToken(access_token: string): void {
    this.access_token = access_token;
  }

  /**
   * Set New Access
   * @param email
   * @param session
   * @param access_token
   */
  setNewAccess(email: string, session: string, access_token: string) {
    this.uid = email;
    this.session = session;
    this.access_token = access_token;
  }

  /**
   * Generate New Access
   * @param email
   * @returns void
   * @memberof UserAccess
   */
  generateNewAccess(email: string) {
    this.session = new Session().createSession();
    this.access_token = new Bearer().createBearer(
      email,
      this.uid,
      this.session
    );
  }

  /**
   * Create New Access
   * @param email
   */
  async createNewAccess(email: string) {
    this.generateNewAccess(email);
    await this.insertOne(Collections.UserAccess, this.getAccess());
  }

  /**
   * Update Access
   * @param email
   */
  async updateAccess(email: string) {
    this.generateNewAccess(email);
    await this.updateOne(Collections.UserAccess, { uid: this.uid }, { $set: this.getAccess() });
  }

  /**
   * Remove Access
   * @returns
   */
  async removeAccess() {
    await this.deleteOne(Collections.UserAccess, { uid: this.uid });
  }

  /**
   * Get Access
   * @returns
   */
  async getAccessById() {
    const collection = await this.getOne(Collections.UserAccess, {
      uid: this.uid,
    });
    if (collection === null) {
      throw new ResponseClass(
        ResStatus.NotFound,
        UserFieldsMessage.AccessNotExists
      );
    }
    this.setNewAccess(
      collection.uid,
      collection.session,
      collection.access_token
    );
  }

  /**
   * Check Access
   * @param uid
   * @param session
   * @param access_token
   * @returns
   */
  checkAccess(uid: string = this.uid, session: string = this.session, access_token: string = this.access_token) {
    try {
      if (uid === undefined || uid === null || uid === "") {
        throw new ResponseClass(ResStatus.BadRequest, CommonFields.Id);
      }
      new Session(session).validateSession();
      new Bearer(access_token).validateToken();
    } catch (error) {
      if (error instanceof ResponseClass) {
        throw error;
      }
      throw new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError);
    }
  }

  /**
   * Flush
   */
  async flush() {
    this.uid = "";
    this.session = "";
    this.access_token = "";
    super.flush();
  }
}

export default UserAccess;

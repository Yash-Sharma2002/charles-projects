import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ResponseClass from "./Response";
import CommonMessage from "../../config/response/CommonMessage";
import { Response } from "express";
import ResStatus from "../../config/response/ResStatus";

dotenv.config({ path: "../../../data.env" });

/**
 * Bearer class
 */
class Bearer {
  public email: string = "";
  public uid: string = "";
  public session: string = "";

  public access_token: string = "";

  /**
   * Constructor
   */
  constructor(access_token?: string) {
    this.access_token = access_token ? access_token : "";
  }

  /**
   * Set details
   * @param email
   * @param uid
   * @param session
   */
  setDetails(email: string, uid: string, session: string): void {
    this.email = email;
    this.uid = uid;
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
   * Get Access Token
   * @returns string
   */
  getAccessToken(): string {
    return this.access_token;
  }

  /**
   * Create bearer token
   * @returns string
   */
  createBearer(
    email: string = this.email,
    uid: string = this.uid,
    session: string = this.session
  ): string {
    this.access_token = jwt.sign(
      { email: email, uid: uid, session: session },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    return this.access_token;
  }

  /**
   * Validate token
   * @param token
   * @returns
   */
  validateToken() {
    try {
      jwt.verify(this.access_token, process.env.JWT_SECRET as string);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ResponseClass(
          ResStatus.Unauthorized,
          CommonMessage.TokenExpired
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new ResponseClass(
          ResStatus.Unauthorized,
          CommonMessage.InvalidToken
        );
      } else {
        throw new ResponseClass(
          ResStatus.Unauthorized,
          CommonMessage.UnknownError
        );
      }
    }
  }
}

export default Bearer;

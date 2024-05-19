import CommonMessage from "../../config/response/CommonMessage";
import ResStatus from "../../config/response/ResStatus";
import Encyrption from "./Encryption";
import ResponseClass from "./Response";

class Session {
  public session: string;

  constructor(session?: string) {
    this.session = session ? session : "";
  }

  /**
   * Constructor
   * @param session: string
   */
  setSession(session: string) {
    this.session = session;
  }

  /**
   * Get Session
   * @returns string
   */
  getSession() {
    return this.session;
  }

  /**
   * Create Session
   * @returns void
   * @Create session for 7 days
   * */
  createSession(): string {
    const date = (new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toString();
    this.session = new Encyrption(date).encrypt();
    return this.session;
  }

  /**
   * Validate Session
   * @Check if session is present and not expired
   * @returns ResponseClass | void
   */
  validateSession(){
    if (
      this.session === "" ||
      this.session === undefined ||
      this.session === null
    ) {
      throw new ResponseClass(
        ResStatus.Unauthorized,
        CommonMessage.SessionExpired
      );
    }

    const currentSession = new Date().getTime();
    const apiSession = new Date(
      new Encyrption(this.session).decrypt()
    ).getTime();
    if (currentSession > apiSession) {
      throw new ResponseClass(
        ResStatus.Unauthorized,
        CommonMessage.SessionExpired
      );
    }
  }
}

export default Session;

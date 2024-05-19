import EmailClass from "../../../Base/Class/Email";
import { Request, Response } from "express";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import EmailMessage from "../../../config/response/Emails";

/**
 * @class Email
 * @extends EmailClass
 * @description Email Class for Routes
 */
class Email {
  /**
   * Send Verification Email
   * @param req
   * @param res
   * @returns
   */
  async sendVerificationEmail(req: Request, res: Response) {
    try {
      let email = req.query.email as string;
      let name = req.query.name as string;

      let OTP = await new EmailClass().verificationEmailBody(email, name);

      let response = new ResponseClass(
        ResStatus.Success,
        EmailMessage.VerificationEmailSent
      );
      response.setData(OTP);

      return res.status(ResStatus.Success).send(response.getResponse());
    } catch (error) {
      return res
        .status(ResStatus.InternalServerError)
        .send(
          new ResponseClass(
            ResStatus.InternalServerError,
            EmailMessage.EmailError
          ).getResponse()
        );
    }
  }
}

export default Email;

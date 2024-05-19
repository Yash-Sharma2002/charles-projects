import ResponseClass from "./Response";
import axios from "axios";
import dotenv from "dotenv";
import Start from "./Start";
import ResStatus from "../../config/response/ResStatus";
import OrganisationMessage from "../../config/response/Organisation";
import OrganisationInterface from "../Interface/Organisation";
import Organisation from "./Organisation";

dotenv.config({ path: "data.env" });

/**
 * Email class
 * @class EmailClass
 * @classdesc Used to send emails
 */
class EmailClass extends Start {
  /**
   * Send verification email
   * @param email
   * @param name
   */
  async verificationEmailBody(email: string, name: string): Promise<number> {
    let otp = Math.floor(1000000 + Math.random() * 9000000);

    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          name: "Leads Usher",
          email: process.env.SENDINBLUE_EMAIl,
        },
        to: [
          {
            email: email,
            name: name,
          },
        ],
        subject: "Please verify your email address",
        htmlContent: `<html><body><h1>Hi ${name},</h1><p>Thank you for signing up with Leads Usher. Please verify your email address by entering the following OTP:</p><h2>${otp}</h2><p>If you did not sign up for Leads Usher, please ignore this email.</p></body></html>`,
      },
      {
        headers: {
          "api-key": process.env.SENDINBLUE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return otp;
  }


  /**
   * Send invite email
   * @param email
   * @param name
   * @param organisation
   * @param invitation_id
   */
  async sendInviteEmail(
    email: string,
    name: string,
    organisation: string,
    invitation_id: string
  ) {
    if (!organisation) {
      throw new ResponseClass(
        ResStatus.BadRequest,
        OrganisationMessage.NotFound
      );
    }

    let organisationDetails = new Organisation();
    await organisationDetails.connectDb();
    let organisationData = await organisationDetails.getOrganisationByDetails(organisation)
    organisationDetails.flush();

    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          name: "Leads Usher",
          email: process.env.SENDINBLUE_EMAIl,
        },
        to: [
          {
            email: email,
            name: name,
          },
        ],
        subject:
          "You have been invited to join an " + organisationData.organisation_name,
        htmlContent: `<html><body>
        <img src="${organisationData.organisation_image}" alt="Leads Usher Logo" style="width: 100px; height: 100px;"/>
        <h1>Hi ${name},</h1><p>You have been invited to join ${organisationData.organisation_name}. Please click on the following link to accept the invitation:</p><a href="${process.env.FRONTEND_URL}/sign-up/invite/${invitation_id}/organisation/${organisation}/email/${email}">Accept Invitation</a><p>If you did not receive this email, please ignore it.</p></body></html>`,
      },
      {
        headers: {
          "api-key": process.env.SENDINBLUE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  }

  /**
   * Send forgot password email
   * @param email
   * @param name
   * @param uid
   */
  async sendForgotPasswordEmail(email: string, name: string, uid: string) {
    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          name: "Leads Usher",
          email: process.env.SENDINBLUE_EMAIl,
        },
        to: [
          {
            email: email,
            name: name,
          },
        ],
        subject: "Reset your password",
        htmlContent: `<html><body><h1>Hi ${name},</h1><p>You have requested to reset your password. Please click on the following link to reset your password:</p><a href="${process.env.FRONTEND_URL}/reset-password/${uid}/email/${email}">Reset Password</a><p>If you did not request to reset your password, please ignore this email.</p></body></html>`,
      },
      {
        headers: {
          "api-key": process.env.SENDINBLUE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    )
  }

  /**
   * Send password changed email
   * @param email
   * @param name
   */
  async sendPasswordChangedEmail(email: string, name: string) {
    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          name: "Leads Usher",
          email: process.env.SENDINBLUE_EMAIl,
        },
        to: [
          {
            email: email,
            name: name,
          },
        ],
        subject: "Your password has been changed",
        htmlContent: `<html><body><h1>Hi ${name},</h1><p>Your password has been changed. If you did not change your password, please contact us immediately.</p></body></html>`,
      },
      {
        headers: {
          "api-key": process.env.SENDINBLUE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export default EmailClass;

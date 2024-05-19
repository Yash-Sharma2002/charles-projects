import express from "express";
import CreateLinkedinAccount from "../API/Create";
import UpdateLinkedAccount from "../API/Update";
import DeleteLinkedinAccount from "../API/Delete";
import GetAccounts from "../API/GetAccount";
import ValidateAccount from "../API/Validate";

const LinkedInAccountRouter = express.Router();

LinkedInAccountRouter.get("/get", new GetAccounts().getLinkedAccounts);
LinkedInAccountRouter.get(
  "/get-emails",
  new GetAccounts().getLinkedAccountsEmails
);
LinkedInAccountRouter.post(
  "/create",
  new CreateLinkedinAccount().createLinkedAccount
);
LinkedInAccountRouter.put(
  "/update",
  new UpdateLinkedAccount().updateLinkedAccount
);
LinkedInAccountRouter.put(
  "/disconnect",
  new UpdateLinkedAccount().disconnectLinkedAccount
);
LinkedInAccountRouter.delete(
  "/delete",
  new DeleteLinkedinAccount().deleteLinkedinAccount
);

LinkedInAccountRouter.put("/otp", new ValidateAccount().sendOTPLinkedAccount);
LinkedInAccountRouter.put("/validate", new ValidateAccount().validateLinkedAccount);

export default LinkedInAccountRouter;

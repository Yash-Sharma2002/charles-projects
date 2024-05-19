import express from "express";
import Email from "../API/Email";


const EmailRouter = express.Router();

EmailRouter.get("/verification",new Email().sendVerificationEmail); 

export default EmailRouter;

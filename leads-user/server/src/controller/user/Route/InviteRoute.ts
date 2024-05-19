import express from "express";
import InviteUser from "../API/Invite";

const InviteRouter = express.Router();

InviteRouter.post("/invite",new InviteUser().inviteUser); 
InviteRouter.put("/accept",new InviteUser().acceptInvite);
InviteRouter.put("/revoke",new InviteUser().revokeInvite);
InviteRouter.put("/resend",new InviteUser().resendInvite);

export default InviteRouter;

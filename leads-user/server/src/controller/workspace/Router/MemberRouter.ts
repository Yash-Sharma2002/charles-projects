import express from "express"
import Member from "../API/Member";

const MemberRouter = express.Router();

MemberRouter.post("/add",new Member().addMember); 
MemberRouter.delete("/remove",new Member().removeMember)

export default MemberRouter;

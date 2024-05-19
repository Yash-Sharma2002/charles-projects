import express from "express"
import CreateWorkspace from "../API/Create";
import UpdateWorkspace from "../API/Update";
import DeleteWorkspace from "../API/Delete";
import MemberRouter from "./MemberRouter";

const WorkspaceRouter = express.Router();

WorkspaceRouter.post("/create",new CreateWorkspace().createWorkspace); 
WorkspaceRouter.put("/update",new UpdateWorkspace().updateWorkspace)
WorkspaceRouter.delete("/delete",new DeleteWorkspace().deleteWorkspace);

WorkspaceRouter.use("/member",MemberRouter)

export default WorkspaceRouter;

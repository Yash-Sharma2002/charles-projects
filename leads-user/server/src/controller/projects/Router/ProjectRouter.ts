import express from "express";
import CreateProject from "../API/Create";
import UpdateProject from "../API/Update";
import DeleteProject from "../API/Delete";
import ResourceRouter from "./ReourceRouter";
const ProjectRouter = express.Router();

ProjectRouter.post("/create",new CreateProject().createProject); 
ProjectRouter.put("/update",new UpdateProject().updateProject)
ProjectRouter.delete("/delete",new DeleteProject().deleteProject);

ProjectRouter.use("/resource",ResourceRouter)

export default ProjectRouter;

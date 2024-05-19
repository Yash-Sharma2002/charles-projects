import express from "express";
import ResourceManager from "../API/Resource";


const ResourceRouter = express.Router();

ResourceRouter.post("/assign",new ResourceManager().addResource); 
ResourceRouter.get("/remove",new ResourceManager().removeResource)

export default ResourceRouter;

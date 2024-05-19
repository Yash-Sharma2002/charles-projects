import express from "express";
import CreateOrganisation from "../API/Create";
import UpdateOrganisation from "../API/Update";
import DeleteOranisation from "../API/Delete";
import GetDetails from "../API/GetDetails";


const OrganisationRouter = express.Router();

OrganisationRouter.get("/users",new GetDetails().getOrganisationMembers);
OrganisationRouter.get("/get",new GetDetails().getDetails);
OrganisationRouter.post("/create",new CreateOrganisation().createOrganisation); 
OrganisationRouter.put("/update",new UpdateOrganisation().updateOrganisation);
OrganisationRouter.delete("/delete",new DeleteOranisation().deleteOrganisation);

export default OrganisationRouter;

import express from "express";
import OrganisationAddress from "../API/OrganisationAddress";

const OrganisationAddressRouter = express.Router();

OrganisationAddressRouter.post("/create",new OrganisationAddress().createOrganisationAddress); 
OrganisationAddressRouter.put("/update",new OrganisationAddress().createOrganisationAddress);
OrganisationAddressRouter.delete("/delete",new OrganisationAddress().createOrganisationAddress);

export default OrganisationAddressRouter;

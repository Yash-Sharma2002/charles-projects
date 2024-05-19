import express from "express";
import ClientAddress from "../API/ClientAddress";

const ClientAddressRouter = express.Router();

ClientAddressRouter.post("/create",new ClientAddress().createClientAddress); 
ClientAddressRouter.put("/update",new ClientAddress().updateClientAddress);
ClientAddressRouter.delete("/delete",new ClientAddress().deleteClientAddress);

export default ClientAddressRouter;

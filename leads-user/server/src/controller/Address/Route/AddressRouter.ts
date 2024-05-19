import express from "express";
import ClientAddressRouter from "./ClientAdderssRouter";
import OrganisationAddressRouter from "./OrganisationAdderssRouter";
import UserAddressRouter from "./UserAdderssRouter";

const AddressRouter = express.Router();

AddressRouter.use("/client", ClientAddressRouter);
AddressRouter.use("/organisation", OrganisationAddressRouter);
AddressRouter.use("/user", UserAddressRouter);

export default AddressRouter;

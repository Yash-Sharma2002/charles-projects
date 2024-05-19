import express from "express";
import UserAddress from "../API/UserAddress";

const UserAddressRouter = express.Router();

UserAddressRouter.post("/create",new UserAddress().createUserAddress); 
UserAddressRouter.put("/update",new UserAddress().createUserAddress);
UserAddressRouter.delete("/delete",new UserAddress().createUserAddress);

export default UserAddressRouter;

import express from "express";
import CreateUser from "../API/Create";
import LoginUser from "../API/Login";
import UpdateUser from "../API/Update";
import InviteRouter from "./InviteRoute";
import DeleteUser from "../API/Delete";
import GetUser from "../API/GetUser";


const UserRouter = express.Router();

UserRouter.get("/get",new GetUser().getUserDataInOrganisationAndWorkspace);
UserRouter.get("/get/roles",new GetUser().getUserDataInOrganisationByRoles);
UserRouter.post("/create",new CreateUser().createUser); 
UserRouter.get("/access",new LoginUser().loginUser)
UserRouter.put("/update",new UpdateUser().updateUser)
UserRouter.put("/password/reset",new UpdateUser().updatePassword);
UserRouter.delete("/delete",new DeleteUser().deleteUser);
UserRouter.get("/password/forget",new LoginUser().forgetPassword);

UserRouter.use("/invitations",InviteRouter)

export default UserRouter;

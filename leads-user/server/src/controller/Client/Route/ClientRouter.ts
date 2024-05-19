import express from "express";
import CreateClient from "../API/Create";
import UpdateClient from "../API/Update";
import DeleteClient from "../API/Delete";


const ClientRouter = express.Router();

ClientRouter.post("/create",new CreateClient().create);
ClientRouter.put("/update",new UpdateClient().updateClient);
ClientRouter.delete("/delete",new DeleteClient().deleteClient);


export default ClientRouter;

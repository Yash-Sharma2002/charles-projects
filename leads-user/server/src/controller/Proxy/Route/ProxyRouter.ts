import express from "express";
import CreateProxy from "../API/Create";
import UpdateProxy from "../API/Update";
import DeleteProxy from "../API/Delete";

const ProxyRouter = express.Router();

ProxyRouter.post("/create", new CreateProxy().createProxy);
ProxyRouter.put("/update", new UpdateProxy().updateProxy);
ProxyRouter.delete("/delete", new DeleteProxy().delete);

export default ProxyRouter;

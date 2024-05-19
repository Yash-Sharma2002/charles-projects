import express from "express";
import CreateSequence from "../API/Create";
import UpdateSequence from "../API/Update";
import DeleteSequence from "../API/Delete";

const SequenceRouter = express.Router();

SequenceRouter.post("/create",new CreateSequence().create); 
SequenceRouter.put("/update",new UpdateSequence().updateSequence);
SequenceRouter.delete("/delete",new DeleteSequence().deleteSequence);

export default SequenceRouter;

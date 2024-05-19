import Sequence from "../../../Base/Class/Sequence";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import SequenceFields from "../../../config/response/Sequence";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import { Request, Response } from "express";
import UserOrganisation from "../../../Base/Class/UserOrganisation";


class DeleteSequence{
    /**
     * Constructor
     */
    constructor() {
      this.deleteSequence = this.deleteSequence.bind(this);
    }

    /**
     * Delete Sequence
     * @param req
     * @param res
     * @returns Response
     * @Delete Sequence
     */
    async deleteSequence(req: Request, res: Response) {
      try {
        new UserAccess(
          req.query.uid as string,
          req.query.session as string,
          req.query.access_token as string,
        ).checkAccess();

        
        let userOrganisation = new UserOrganisation();
        userOrganisation.setUserId(req.query.uid as string);
        userOrganisation.setOrganisationId(req.query.organisation_id as string); 
        await userOrganisation.connectDb();
        await userOrganisation.checkUserNotAdmin();
        userOrganisation.flush();
  
        let seq = new Sequence();
        await seq.connectDb();
        await seq.deleteSequence(req.query.sequence_id as string);
        seq.flush();
  
        return res
          .status(ResStatus.Success)
          .send(
            new ResponseClass(
              ResStatus.Success,
              SequenceFields.SequenceDeleted
            ).getResponse()
          );
      } catch (error) {
        if (error instanceof ResponseClass) {
          return res.status(error.getStatus()).send(error.getResponse());
        }
        return res
          .status(ResStatus.InternalServerError)
          .send(
            new ResponseClass(
              ResStatus.InternalServerError,
              CommonMessage.InternalServerError
            ).getResponse()
          );
      }
    }
}

export default DeleteSequence
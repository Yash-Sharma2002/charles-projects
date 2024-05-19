import { Request, Response } from "express";
import Sequence from "../../../Base/Class/Sequence";
import ResStatus from "../../../config/response/ResStatus";
import ResponseClass from "../../../Base/Class/Response";
import SequenceFields from "../../../config/response/Sequence";
import CommonMessage from "../../../config/response/CommonMessage";
import UserAccess from "../../../Base/Class/UserAccess";
import UserOrganisation from "../../../Base/Class/UserOrganisation";

class UpdateSequence {
  /**
   * Constructor
   */
  constructor() {
    this.updateSequence = this.updateSequence.bind(this);
  }

  /**
   * Update Sequence
   * @param req
   * @param res
   * @returns Response
   * @Update Sequence
   */
  async updateSequence(req: Request, res: Response) {
    try {
      new UserAccess(
        req.body.uid as string,
        req.body.session as string,
        req.body.access_token as string
      ).checkAccess();

      
      let userOrganisation = new UserOrganisation();
      userOrganisation.setUserId(req.query.uid as string);
      userOrganisation.setOrganisationId(req.query.organisation_id as string); 
      await userOrganisation.connectDb();
      await userOrganisation.checkUserNotAdmin();
      userOrganisation.flush();

      let sequence = new Sequence(req.body.sequence);
      sequence.validate();
      await sequence.connectDb();
      await sequence.checkSequenceNotExists();
      await sequence.updateSequence();

      let response = new ResponseClass(
        ResStatus.Success,
        SequenceFields.SequenceUpdated
      );
      response.setData(sequence.getSequence());

      sequence.flush();

      return res.status(ResStatus.Success).send(response.getResponse());
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


export default UpdateSequence;
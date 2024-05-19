import { Request, Response } from 'express';
import ResStatus from '../../../config/response/ResStatus';
import ResponseClass from '../../../Base/Class/Response';
import SequenceFields from '../../../config/response/Sequence';
import CommonMessage from '../../../config/response/CommonMessage';
import UserAccess from '../../../Base/Class/UserAccess';
import Sequence from '../../../Base/Class/Sequence';
import UserOrganisation from '../../../Base/Class/UserOrganisation';


class CreateSequence{

    /**
     * Contructor
     */
    constructor(){
        this.create = this.create.bind(this);
    }

    /**
     * Create Sequence
     * @param req
     * @param res
     * @returns Response
     * @Create Sequence
     */
    async create(req: Request, res: Response){
        try{
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token
            ).checkAccess();

            
        let userOrganisation = new UserOrganisation();
        userOrganisation.setUserId(req.body.uid as string);
        userOrganisation.setOrganisationId(req.body.organisation_id as string); 
        await userOrganisation.connectDb();
        await userOrganisation.checkUserNotAdmin();
        userOrganisation.flush();

            let sequence = new Sequence(req.body.sequence);
            sequence.validate();
            await sequence.connectDb();
            await sequence.checkSequenceExists();
            await sequence.createSequence();

            let response = new ResponseClass(
                ResStatus.Success,
                SequenceFields.SequenceCreated
            );
            response.setData(sequence.getSequence());

            sequence.flush();

            return res
                .status(ResStatus.Success)
                .send(response.getResponse());
        }catch(error){
            if(error instanceof ResponseClass){
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

export default CreateSequence;
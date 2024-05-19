import { Request, Response } from 'express';
import ResStatus from '../../../config/response/ResStatus';
import ResponseClass from '../../../Base/Class/Response';
import ClientFields from '../../../config/response/Client';
import CommonMessage from '../../../config/response/CommonMessage';
import UserAccess from '../../../Base/Class/UserAccess';
import Client from '../../../Base/Class/Client';
import Organisation from '../../../Base/Class/Organisation';


class CreateClient{

    /**
     * Contructor
     */
    constructor(){
        this.create = this.create.bind(this);
    }

    /**
     * Create Client
     * @param req
     * @param res
     * @returns Response
     * @Create Client
     */
    async create(req: Request, res: Response){
        try{
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token
            ).checkAccess();

            let organisation =new Organisation();
            organisation.setOrganisationId(req.body.client.organisation_id);
            await organisation.connectDb();
            await organisation.checkOrganisationExistsV2();
            organisation.flush();

            let clt = new Client(req.body.client);
            clt.validate();
            await clt.connectDb();
            await clt.checkClientExists();
            await clt.setUsername();
            await clt.saveClient();

            let response = new ResponseClass(
                ResStatus.Success,
                ClientFields.ClientCreated
            );
            response.setData(clt.getClient());

            clt.flush();

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

export default CreateClient;
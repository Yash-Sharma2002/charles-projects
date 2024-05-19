import { Request, Response } from 'express';
import ResponseClass from '../../../Base/Class/Response';
import ResStatus from '../../../config/response/ResStatus';
import CommonMessage from '../../../config/response/CommonMessage';
import UserAccess from '../../../Base/Class/UserAccess';
import Address from '../../../Base/Class/Address';
import AddressMessage from '../../../config/response/Address';



class ClientAddress {

    /**
     * Constructor
     */
    constructor() {
        this.createClientAddress = this.createClientAddress.bind(this);
        this.updateClientAddress = this.updateClientAddress.bind(this);
        this.deleteClientAddress = this.deleteClientAddress.bind(this);
    }

    /**
     * Create Client Address
     * @param req
     * @param res
     */
    async createClientAddress(req: Request, res: Response) {
        try {
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token,
            ).checkAccess();

            // Create Client Address
            let address = new Address(req.body.address);
            address.validate();
            await address.connectDb()
            await address.createAddress();
            await address.addAddressToClient(req.body.client);

            let response = new ResponseClass(ResStatus.Success, AddressMessage.Created);
            response.setData(address.getAddress());
            address.flush();
            return res.status(response.getStatus()).send(response.getResponse());

        } catch (error: any) {
            if (error instanceof ResponseClass) {
                return res.status(error.getStatus()).send(error.getResponse());
            }
            return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
        }
    }


    /**
     * Update Client Address
     * @param req
     * @param res
     */
    async updateClientAddress(req: Request, res: Response) {
        try {
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token,
            ).checkAccess();

            // Update Client Address
            let address = new Address(req.body.address);
            address.validate();
            await address.connectDb();
            await address.checkAddressExistsV2(req.body.address_id);
            await address.updateAddress();

            let response = new ResponseClass(ResStatus.Success, AddressMessage.Updated);
            response.setData(address.getAddress());
            address.flush();
            return res.status(response.getStatus()).send(response.getResponse());

        } catch (error: any) {
            if (error instanceof ResponseClass) {
                return res.status(error.getStatus()).send(error.getResponse());
            }
            return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
        }
    }

    /**
     * Delete Client Address
     * @param req
     * @param res
     */
    async deleteClientAddress(req: Request, res: Response) {
        try {
            new UserAccess(
                req.query.uid as string,
                req.query.session as string,
                req.query.access_token as string,
            ).checkAccess();

            // Delete Client Address
            let address = new Address();
            address.address_id = req.query.address as string;
            await address.connectDb();
            await address.checkAddressExistsV2();
            await address.deleteAddress();
            await address.removeAddressFromClient(req.query.client as string);

            let response = new ResponseClass(ResStatus.Success, AddressMessage.Deleted);
            address.flush();
            return res.status(response.getStatus()).send(response.getResponse());

        } catch (error: any) {
            if (error instanceof ResponseClass) {
                return res.status(error.getStatus()).send(error.getResponse());
            }
            return res.status(ResStatus.InternalServerError).send(new ResponseClass(ResStatus.InternalServerError, CommonMessage.InternalServerError).getResponse());
        }
    }


}

export default ClientAddress;
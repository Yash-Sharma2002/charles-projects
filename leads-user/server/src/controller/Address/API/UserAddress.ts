import { Request, Response } from 'express';
import ResponseClass from '../../../Base/Class/Response';
import ResStatus from '../../../config/response/ResStatus';
import CommonMessage from '../../../config/response/CommonMessage';
import UserAccess from '../../../Base/Class/UserAccess';
import Address from '../../../Base/Class/Address';
import AddressMessage from '../../../config/response/Address';


class UserAddress{

    /**
     * Constructor
     */
    constructor() {
        this.createUserAddress = this.createUserAddress.bind(this);
        this.updateUserAddress = this.updateUserAddress.bind(this);
        this.deleteUserAddress = this.deleteUserAddress.bind(this);
    }

    /**
     * Create User Address
     * @param req
     * @param res
     */
    async createUserAddress(req: Request, res: Response) {
        try {
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token,
            ).checkAccess();

            // Create User Address
            let address = new Address(req.body.address);
            address.validate();
            await address.connectDb()
            await address.createAddress();
            await address.addAddressToUser(req.body.uid);

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
     * Update User Address
     * @param req
     * @param res
     */
    async updateUserAddress(req: Request, res: Response) {
        try {
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token,
            ).checkAccess();

            // Update User Address
            let address = new Address(req.body.address);
            address.validate();
            await address.connectDb();
            await address.checkAddressExistsV2();
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
     * Delete User Address
     * @param req
     * @param res
     */
    async deleteUserAddress(req: Request, res: Response) {
        try {
            new UserAccess(
                req.query.uid as string,
                req.query.session as string,
                req.query.access_token as string,
            ).checkAccess();

            // Delete User Address
            let address = new Address();
            address.address_id = req.query.address as string;
            await address.connectDb();
            await address.checkAddressExistsV2();
            await address.deleteAddress();
            await address.removeAddressFromUser(req.query.uid as string);

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


export default UserAddress;
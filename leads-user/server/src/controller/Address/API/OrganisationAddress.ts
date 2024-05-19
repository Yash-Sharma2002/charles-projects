import { Request, Response } from "express";
import ResponseClass from "../../../Base/Class/Response";
import CommonMessage from "../../../config/response/CommonMessage";
import ResStatus from "../../../config/response/ResStatus";
import UserAccess from "../../../Base/Class/UserAccess";
import Address from "../../../Base/Class/Address";
import AddressMessage from "../../../config/response/Address";




class OrganisationAddress {

    /**
     * Constructor
     */
    constructor() {
        this.createOrganisationAddress = this.createOrganisationAddress.bind(this);
        this.updateOrganisationAddress = this.updateOrganisationAddress.bind(this);
        this.deleteOrganisationAddress = this.deleteOrganisationAddress.bind(this);
    }

    /**
     * Create Organisation Address
     * @param req
     * @param res
     */
    async createOrganisationAddress(req: Request, res: Response) {
        try {
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token,
            ).checkAccess();

            // Create Organisation Address
            let address = new Address(req.body.address);
            address.validate();
            await address.connectDb()
            await address.createAddress();
            await address.addAddressToOrganisation(req.body.organisation);

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
     * Update Organisation Address
     * @param req
     * @param res
     */
    async updateOrganisationAddress(req: Request, res: Response) {
        try {
            new UserAccess(
                req.body.uid,
                req.body.session,
                req.body.access_token,
            ).checkAccess();

            // Update Organisation Address
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
     * Delete Organisation Address
     * @param req
     * @param res
     */
    async deleteOrganisationAddress(req: Request, res: Response) {
        try {
            new UserAccess(
                req.query.uid as  string,
                req.query.session as  string,
                req.query.access_token as  string,
            ).checkAccess();

            // Delete Organisation Address
            let address = new Address();
            address.address_id = req.query.address as  string;
            await address.connectDb();
            await address.checkAddressExistsV2();
            await address.deleteAddress();
            await address.removeAddressFromOrganisation(req.query.organisation as  string);

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

export default OrganisationAddress;
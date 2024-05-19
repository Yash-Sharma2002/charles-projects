import Collections from "../../config/collections";
import AddressMessage from "../../config/response/Address";
import ResStatus from "../../config/response/ResStatus";
import AddressInterface from "../Interface/Address";
import ResponseClass from "./Response";
import Start from "./Start";



class Address extends Start implements AddressInterface {
    address_id: string;
    address_line1: string;
    address_line2: string;
    address_city: string;
    address_state: string;
    address_country: string;
    address_postal_code: string;
    created_at?: number | undefined;
    updated_at?: number | undefined;

    /**
     * Constructor
     * @param address
     */
    constructor(address?: AddressInterface) {
        super();
        this.address_id = address?.address_id || this.generateId();
        this.address_line1 = address?.address_line1 || "";
        this.address_line2 = address?.address_line2 || "";
        this.address_city = address?.address_city || "";
        this.address_state = address?.address_state || "";
        this.address_country = address?.address_country || "";
        this.address_postal_code = address?.address_postal_code || "";
        this.created_at = address?.created_at || new Date().getTime();
        this.updated_at = address?.updated_at || new Date().getTime();
    }

    // Getters
    /**
     * Get Address Id
     * @returns Address Id
     */
    getAddressId(): string {
        return this.address_id;
    }

    /**
     * Get Address Line1
     * @returns Address Line1
     */
    getAddressLine1(): string {
        return this.address_line1;
    }

    /**
     * Get Address Line2
     * @returns Address Line2
     */
    getAddressLine2(): string {
        return this.address_line2;
    }

    /**
     * Get Address City
     * @returns Address City
     */
    getAddressCity(): string {
        return this.address_city;
    }

    /**
     * Get Address State
     * @returns Address State
     */
    getAddressState(): string {
        return this.address_state;
    }

    /**
     * Get Address Country
     * @returns Address Country
     */
    getAddressCountry(): string {
        return this.address_country;
    }

    /**
     * Get Address Postal Code
     * @returns Address Postal Code
     */
    getAddressPostalCode(): string {
        return this.address_postal_code;
    }

    /**
     * Get Created At
     * @returns Created At
     */
    getCreatedAt(): number | undefined {
        return this.created_at;
    }

    /**
     * Get Updated At
     * @returns Updated At
     */
    getUpdatedAt(): number | undefined {
        return this.updated_at;
    }

    /**
     * Get Address
     * @returns Address
     */
    getAddress() {
        return {
            address_id: this.address_id,
            address_line1: this.address_line1,
            address_line2: this.address_line2,
            address_city: this.address_city,
            address_state: this.address_state,
            address_country: this.address_country,
            address_postal_code: this.address_postal_code,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }

    // Setters
    /**
     * Set Address Id
     * @param address_id
     */
    setAddressId(address_id: string) {
        this.address_id = address_id;
    }

    /**
     * Set Address Line1
     * @param address_line1
     */
    setAddressLine1(address_line1: string) {
        this.address_line1 = address_line1;
    }

    /**
     * Set Address Line2
     * @param address_line2
     */
    setAddressLine2(address_line2: string) {
        this.address_line2 = address_line2;
    }

    /**
     * Set Address City
     * @param address_city
     */
    setAddressCity(address_city: string) {
        this.address_city = address_city;
    }

    /**
     * Set Address State
     * @param address_state
     */
    setAddressState(address_state: string) {
        this.address_state = address_state;
    }

    /**
     * Set Address Country
     * @param address_country
     */
    setAddressCountry(address_country: string) {
        this.address_country = address_country;
    }

    /**
     * Set Address Postal Code
     * @param address_postal_code
     */
    setAddressPostalCode(address_postal_code: string) {
        this.address_postal_code = address_postal_code;
    }

    /**
     * Set Created At
     * @param created_at
     */
    setCreatedAt(created_at: number) {
        this.created_at = created_at;
    }

    /**
     * Set Updated At
     * @param updated_at
     */
    setUpdatedAt(updated_at: number) {
        this.updated_at = updated_at;
    }

    /**
     * Set Address
     * @param address
     */
    setAddress(address: AddressInterface) {
        this.address_id = address.address_id;
        this.address_line1 = address.address_line1;
        this.address_line2 = address.address_line2;
        this.address_city = address.address_city;
        this.address_state = address.address_state;
        this.address_country = address.address_country;
        this.address_postal_code = address.address_postal_code;
        this.created_at = address.created_at;
        this.updated_at = address.updated_at;
    }

    /**
     * Check if Address is Valid 
     */
    validate() {
        this.validateAddressLine1(this.address_line1);
        this.validateCity(this.address_city);
        this.validateState(this.address_state);
        this.validateCountry(this.address_country);
        this.validatePostalCode(this.address_postal_code);
    }

    /**
     * Get Address by Id
     * @param address_id
     */
    async getAddressById(address_id: string = this.address_id) {
        return await this.getOne(Collections.Address, { address_id: address_id }) as unknown as AddressInterface;
    }

    /**
     * Check if Address Exists 
     * @param address_id
     */
    async checkAdressExists(address_id: string = this.address_id) {
        let address = await this.getAddressById(address_id);
        if (address) {
            throw new ResponseClass(ResStatus.BadRequest, AddressMessage.AlreadyExists);
        }
    }

    /**
     * Check if Address Not Exists
     */
    async checkAddressExistsV2(address_id: string = this.address_id) {
        let address = await this.getAddressById(address_id);
        if (!address) {
            throw new ResponseClass(ResStatus.BadRequest, AddressMessage.NotFound);
        }
    }

    /**
     * Create Address
     */
    async createAddress() {
        await this.insertOne(Collections.Address, this.getAddress());
    }

    /**
     * Update Address
     */
    async updateAddress() {
        await this.updateOne(Collections.Address, { address_id: this.address_id }, { $set: this.getAddress() });
    }

    /**
     * Delete Address
     * @param address_id
     */
    async deleteAddress(address_id: string = this.address_id) {
        await this.deleteOne(Collections.Address, { address_id: address_id });
    }

    /**
     * Add address to User
     * @param user_id
     * @param address_id
     */
    async addAddressToUser(user_id: string, address_id: string = this.address_id) {
        await this.updateOne(Collections.User, { uid: user_id }, { $set: { address: address_id } });
    }

    /**
     * Add Address to Organisation
     * @param organisation_id
     * @param address_id 
     */
    async addAddressToOrganisation(organisation_id: string, address_id: string = this.address_id) {
        await this.updateOne(Collections.Organisation, { organisation_id: organisation_id }, { $set: { organisation_address: address_id } });
    }

    /**
     * Add Address to Client
     * @param client_id
     */
    async addAddressToClient(client_id: string) {
        await this.updateOne(Collections.Client, { client_id: client_id }, { $set: { client_address: this.address_id } });
    }

    /**
     * Remove Address from User
     * @param user_id
     */
    async removeAddressFromUser(user_id: string) {
        await this.updateOne(Collections.User, { uid: user_id }, { $unset: { address: 1 } });
    }

    /**
     * Remove Address from Organisation
     * @param organisation_id
     */
    async removeAddressFromOrganisation(organisation_id: string) {
        await this.updateOne(Collections.Organisation, { organisation_id: organisation_id }, { $unset: { organisation_address: 1 } });
    }

    /**
     * Remove Address from Client
     * @param client_id
     */
    async removeAddressFromClient(client_id: string) {
        await this.updateOne(Collections.Client, { client_id: client_id }, { $unset: { client_address: 1 } });
    }

    /**
     * Flush Address
     */
    flush() {
        this.address_id = "";
        this.address_line1 = "";
        this.address_line2 = "";
        this.address_city = "";
        this.address_state = "";
        this.address_country = "";
        this.address_postal_code = "";
        this.created_at = undefined;
        this.updated_at = undefined;
    }

}


export default Address;
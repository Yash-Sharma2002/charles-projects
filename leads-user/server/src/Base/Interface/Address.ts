
/**
 * Interface for Address
 * @param address_id: string - Foriegn Key
 * @param address_line1: string
 * @param address_line2: string
 * @param address_city: string
 * @param address_state: string
 * @param address_country: string
 * @param address_postal_code: string
 * @param created_at?: number | undefined
 * @param updated_at?: number | undefined
 */
interface AddressInterface {
    address_id: string;
    address_line1: string;
    address_line2: string;
    address_city: string;
    address_state: string;
    address_country: string;
    address_postal_code: string;
    created_at?: number | undefined;
    updated_at?: number | undefined;
}

export default AddressInterface
import Status from "../../config/Status";



/**
 * Client Interface
 * @param name: string - Client Name - Optional
 * @param username: string - Client Username
 * @param email: string - Client Email
 * @param status: Status - Client Status - Optional
 * @param phone: string - Client Phone 
 * @param SalesManager: string - Client Sales Manager - Optional
 * @param address: string - Collection Address - address_id - Optional
 * @param created_at: number - Client Created Date - Optional
 * @param updated_at: number - Client Updated Date - Optional
 */
interface ClientInterface {
    client_Id: string;
    organisation_id: string;
    name: string;
    username?: string;
    email: string;
    status?: Status;
    phone: string;
    SalesManager?: string;
    address?: string;
    created_at?: number;
    updated_at?: number;
}

export default ClientInterface;
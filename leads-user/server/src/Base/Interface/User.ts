import Status from "../../config/Status";

/**
 * User Interface
 * @param name: string - User Name - Optional
 * @param username: string - User Username
 * @param email: string - User Email
 * @param status: Status - User Status - Optional
 * @param password: string - User Password
 * @param provider: string - User Provider - Optional
 * @param phone: string - User Phone - Optional
 * @param address: string - Collection Address - address_id - Optional 
 */
interface UserInterface {
    uid: string;
    name?: string;
    username: string;
    email: string;
    status?: Status;
    password: string;
    provider?: string;
    phone?: string;
    address?: string;
}

export default UserInterface;
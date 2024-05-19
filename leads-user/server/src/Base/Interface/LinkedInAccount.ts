import Status from "../../config/Status";


/**
 * LinkedIn Account Interface
 * @description LinkedIn Account Interface is used to define the structure of LinkedIn Account
 * @interface LinkedInAccountInterface
 * @public
 */
interface LinkedInAccountInterface{
    account_id: string;
    proxy_id: string;
    uid: string;
    workspace_id: string;
    timezone: string;
    active_from: string;
    active_to: string;
    email: string;
    password: string;
    status: Status;
    session?: string;
    created_at?: number;
    updated_at?: number;
}

export default LinkedInAccountInterface
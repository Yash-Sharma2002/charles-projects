import Status from "../constants/Status";


/**
 * Proxy Interface
 */
interface ProxyInterface{
    proxy_id: string;
    account_id: string;
    country: string;
    isCustom: boolean;
    isDomain?: boolean;
    ip: string;
    domain?: string;
    port: string;
    username: string;
    password: string;
    status: Status;  
    created_at?: number;  
}

export default ProxyInterface
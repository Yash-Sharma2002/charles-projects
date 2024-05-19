import Status from "../../config/Status";


/**
 * @interface CampaignsInterface
 * @description Campaigns Interface
 */
interface CampaignsInterface {
    linkedin_account_id: string;
    uid: string;
    workspace_id: string;

    campaign_id: string;
    campaign_name: string;
    campaign_type: string;
    searchItems: { query: string, filter: string, type: string }[];
    steps: any[],
    status: Status;
    created_at: number;
}

export default CampaignsInterface;
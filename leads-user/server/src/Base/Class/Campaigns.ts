import axios from "axios";
import Status from "../../config/Status";
import Collections from "../../config/collections";
import CampaignsFields from "../../config/response/Campaigns";
import ResStatus from "../../config/response/ResStatus";
import CampaignsInterface from "../Interface/Campaigns";
import LinkedInAccount from "./LinkedInAccount";
import ResponseClass from "./Response";
import Start from "./Start";
import dotenv from "dotenv";
import Proxy from "./Proxy";
import { ObjectId } from "mongodb";

dotenv.config({ path: "data.env" });


class Campaigns extends Start implements CampaignsInterface {

    linkedin_account_id: string;
    uid: string;
    workspace_id: string;

    campaign_id: string;
    campaign_name: string;
    campaign_type: string;
    searchItems: { query: string; filter: string; type: string; }[];
    steps: any[];
    status: Status;
    created_at: number;

    /**
     * Constructor
     * @param data 
     */
    constructor(data?: CampaignsInterface) {
        super();
        this.linkedin_account_id = data?.linkedin_account_id || '';
        this.uid = data?.uid || '';
        this.workspace_id = data?.workspace_id || '';
        this.campaign_id = data?.campaign_id || this.generateId();
        this.campaign_name = data?.campaign_name || '';
        this.campaign_type = data?.campaign_type || '';
        this.searchItems = data?.searchItems || [];
        this.steps = data?.steps || [];
        this.status = data?.status || Status.Draft;
        this.created_at = data?.created_at || new Date().getTime();
    }

    // Getters

    /**
     * Get Linkedin Account Id
     * @returns {string}
     */
    getLinkedinAccountId(): string {
        return this.linkedin_account_id;
    }

    /**
     * Get Uid
     * @returns {string}
     */
    getUid(): string {
        return this.uid;
    }

    /**
     * Get Workspace Id
     * @returns {string}
     */
    getWorkspaceId(): string {
        return this.workspace_id;
    }

    /**
     * Get Campaign Id
     * @returns {string}
     */
    getCampaignId(): string {
        return this.campaign_id;
    }

    /**
     * Get Campaign Name
     * @returns {string}
     */
    getCampaignName(): string {
        return this.campaign_name;
    }

    /**
     * Get Campaign Type
     * @returns {string}
     */
    getCampaignType(): string {
        return this.campaign_type;
    }

    /**
     * Get Search Items
     * @returns {string}
     */
    getSearchItems(): { query: string; filter: string; type: string; }[] {
        return this.searchItems;
    }

    /**
     * Get Steps
     * @returns {any[]}
     */
    getSteps(): any[] {
        return this.steps;
    }

    /**
     * Get Status
     * @returns {Status}
     */
    getStatus(): Status {
        return this.status;
    }

    /**
     * Get Created At
     * @returns {number}
     */
    getCreatedAt(): number {
        return this.created_at;
    }

    getCampaign(): CampaignsInterface {
        return {
            linkedin_account_id: this.linkedin_account_id,
            uid: this.uid,
            workspace_id: this.workspace_id,
            campaign_id: this.campaign_id,
            campaign_name: this.campaign_name,
            campaign_type: this.campaign_type,
            searchItems: this.searchItems,
            steps: this.steps,
            status: this.status,
            created_at: this.created_at
        }
    }

    // Setters

    /**
     * Set Linkedin Account Id
     * @param linkedin_account_id 
     */
    setLinkedinAccountId(linkedin_account_id: string) {
        this.linkedin_account_id = linkedin_account_id;
    }

    /**
     * Set Uid
     * @param uid 
     */
    setUid(uid: string) {
        this.uid = uid;
    }

    /**
     * Set Workspace Id
     * @param workspace_id 
     */
    setWorkspaceId(workspace_id: string) {
        this.workspace_id = workspace_id;
    }

    /**
     * Set Campaign Id
     * @param campaign_id 
     */
    setCampaignId(campaign_id: string) {
        this.campaign_id = campaign_id;
    }

    /**
     * Set Campaign Name
     * @param campaign_name 
     */
    setCampaignName(campaign_name: string) {
        this.campaign_name = campaign_name;
    }

    /**
     * Set Campaign Type
     * @param campaign_type 
     */
    setCampaignType(campaign_type: string) {
        this.campaign_type = campaign_type;
    }

    /**
     * Set Search Items
     * @param searchItems 
     */
    setSearchItems(searchItems: { query: string; filter: string; type: string; }[]) {
        this.searchItems = searchItems;
    }

    /**
     * Set Steps
     * @param steps 
     */
    setSteps(steps: any[]) {
        this.steps = steps;
    }

    /**
     * Set Status
     * @param status 
     */
    setStatus(status: Status) {
        this.status = status;
    }

    /**
     * Set Created At
     * @param created_at 
     */
    setCreatedAt(created_at: number) {
        this.created_at = created_at;
    }

    /**
     * Set Campaigns
     * @param data
     */
    setCampaigns(data: CampaignsInterface) {
        this.setLinkedinAccountId(data.linkedin_account_id);
        this.setUid(data.uid);
        this.setWorkspaceId(data.workspace_id);
        this.setCampaignId(data.campaign_id);
        this.setCampaignName(data.campaign_name);
        this.setCampaignType(data.campaign_type);
        this.setSearchItems(data.searchItems);
        this.setSteps(data.steps);
        this.setStatus(data.status);
        this.setCreatedAt(data.created_at);
    }

    // Methods

    /**
     * Add Search Item
     * @param searchItem 
     */
    addSearchItem(searchItem: { query: string; filter: string; type: string; }) {
        this.searchItems.push(searchItem);
    }

    /**
     * Add Step
     * @param step 
     */
    addStep(step: any) {
        this.steps.push(step);
    }

    /**
     * Remove Search Item
     * @param index 
     */
    removeSearchItem(index: number) {
        this.searchItems.splice(index, 1);
    }

    /**
     * Remove Step
     * @param index 
     */
    removeStep(index: number) {
        this.steps.splice(index, 1);
    }

    /**
     * Update Search Item
     * @param index 
     * @param searchItem 
     */
    updateSearchItem(index: number, searchItem: { query: string; filter: string; type: string; }) {
        this.searchItems[index] = searchItem;
    }

    /**
     * Update Step
     * @param index 
     * @param step 
     */
    updateStep(index: number, step: any) {
        this.steps[index] = step;
    }

    /**
     * Update Status
     * @param status 
     * @param campaign_id 
     * @param linkedin_account_id 
     */
    async updateStatus(status: Status, campaign_id: string, linkedin_account_id: string) {
        await this.updateOne(Collections.Campaigns, { linkedin_account_id, campaign_id }, { $set: { status } });
    }

    /**
     * Validate Campaign
     */
    validateCampaign() {
        this.validateName(this.campaign_name);
        this.validateType(this.campaign_type);
        if (this.searchItems.length === 0) {
            throw new ResponseClass(ResStatus.BadRequest, CampaignsFields.SearchItems)
        }
    }

    /**
     * Get Campaign Details
     * @param linkedin_account_id
     * @param uid
     * @param workspace_id
     * @param campaign_id
     */
    async getCampaignDetails(linkedin_account_id: string = this.linkedin_account_id, uid: string = this.uid, workspace_id: string = this.workspace_id, campaign_id: string = this.campaign_id): Promise<CampaignsInterface> {
        return await this.getOne(Collections.Campaigns, {
            $and: [{ linkedin_account_id }, { uid }, { workspace_id }, { campaign_id }]
        }) as unknown as CampaignsInterface;
    }

    /**
     * Create Campaign
     */
    async createCampaign() {
        await this.insertOne(Collections.Campaigns, this.getCampaign());
    }

    /**
     * Update Campaign
     */
    async updateCampaign() {
        await this.updateOne(Collections.Campaigns, { linkedin_account_id: this.linkedin_account_id, uid: this.uid, workspace_id: this.workspace_id, campaign_id: this.campaign_id }, { $set: this.getCampaign() });
    }

    /**
     * Delete Campaign
     * @param linkedin_account_id
     * @param uid
     * @param workspace_id
     * @param campaign_id
     */
    async deleteCampaign(linkedin_account_id: string = this.linkedin_account_id, uid: string = this.uid, workspace_id: string = this.workspace_id, campaign_id: string = this.campaign_id) {
        await this.deleteOne(Collections.Campaigns, { linkedin_account_id: linkedin_account_id, uid: uid, workspace_id: workspace_id, campaign_id: campaign_id });
    }

    /**
     * Pause Campaign
     * @param linkedin_account_id
     * @param uid
     * @param workspace_id
     * @param campaign_id
    */
    async pauseCampaign(linkedin_account_id: string = this.linkedin_account_id, uid: string = this.uid, workspace_id: string = this.workspace_id, campaign_id: string = this.campaign_id) {
        await this.updateOne(Collections.Campaigns, { linkedin_account_id: linkedin_account_id, uid: uid, workspace_id: workspace_id, campaign_id: campaign_id }, { $set: { status: Status.Paused } });
    }

    /**
     * Setup Campaign
     * @param linkedin_account_id
     */
    async setupCampaign(linkedin_account_id: string = this.linkedin_account_id) {
        let proxy = new Proxy();
        await proxy.connectDb();
        let proxies = await proxy.getProxyById("", linkedin_account_id);
        proxy.flush();

        if (proxies === null) throw new ResponseClass(ResStatus.BadRequest, CampaignsFields.ProxyError);

        let account = new LinkedInAccount();
        await account.connectDb();
        let cookies = await account.getAccountCookies(linkedin_account_id);
        account.flush();

        if (cookies === null) throw new ResponseClass(ResStatus.BadRequest, CampaignsFields.CookieError);

        let response = await axios
            .post(
                process.env.REACT_APP_API_URL +
                "/openexisting?" +
                new URLSearchParams({
                    proxy_address: proxies.ip,
                    proxy_port: proxies.port,
                    proxy_username: proxies.username,
                    proxy_password: proxies.password,
                }),
                { cookies: cookies.cookies }
            )
            .then((res) => res.data)
            .catch((err) => {
                console.log(err);
                throw new ResponseClass(ResStatus.BadRequest, CampaignsFields.SetupError);
            });

        return response;
    }

    /**
     * Execute Campaign
     * @param session_id
     * @param campaign_id
     */
    async executeCampaign(session_id: string, campaign_id: string = this.campaign_id) {
        try {
            let data = await axios
                .get(
                    process.env.REACT_APP_API_URL +
                    "/start?" +
                    new URLSearchParams({
                        campaignid: campaign_id,
                        session_id: session_id,
                    })
                )
                .then((res) => res.data);
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Resume Campaign
     * @param linkedin_account_id
     * @param uid
     * @param workspace_id
     * @param campaign_id
     */
    async resumeCampaign(linkedin_account_id: string = this.linkedin_account_id, uid: string = this.uid, workspace_id: string = this.workspace_id, campaign_id: string = this.campaign_id) {
        await this.updateOne(Collections.Campaigns, { linkedin_account_id: linkedin_account_id, uid: uid, workspace_id: workspace_id, campaign_id: campaign_id }, { $set: { status: Status.Running } });
    }

    /**
     * Get Campaign Results
     * @param linkedin_account_id
     * @param campaign_id
     */
    async getCampaignResults(linkedin_account_id: string = this.linkedin_account_id, campaign_id: string = this.campaign_id) {
        return await this.getAll(Collections.CampaignResults, { linkedin_account_id, campaign_id });
    }

    /**
     * Enrich Email
     * 
     */
    async enrichEmail(id:string){
        let details = await this.getOne(Collections.CampaignResults,{
            _id: new ObjectId(id)
        })
        
        let response = await axios
            .get(
                process.env.REACT_APP_API_URL +
                "/enrich?" + new URLSearchParams({
                    company: details?.company ,
                    first_name: details?.first_name,
                    last_name: details?.last_name,
                })
            )
            .then((res) => res.data)
            .catch((err) => {
                console.log(err.response);
                throw new ResponseClass(ResStatus.BadRequest, CampaignsFields.EnrichError);
            }); 

          await this.updateOne(Collections.CampaignResults, { _id: new ObjectId(id) }, { $set: { Email: response.data.data.email || "Not Found" } });

         return response.data.data.email || "Not Found";

    }

    /**
     * Flush Campaign
     */
    flush() {
        super.flush();
        this.linkedin_account_id = '';
        this.uid = '';
        this.workspace_id = '';
        this.campaign_id = '';
        this.campaign_name = '';
        this.campaign_type = '';
        this.searchItems = [];
        this.steps = [];
        this.status = Status.Draft;
        this.created_at = new Date().getTime();
    }

}

export default Campaigns;
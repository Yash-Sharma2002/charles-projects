import axios from "axios";
import Status from "../../config/Status";
import Collections from "../../config/collections";
import CommonFields from "../../config/response/CommonFields";
import LinkedInAccountMessage from "../../config/response/LinkedInAccount";
import ResStatus from "../../config/response/ResStatus";
import LinkedInAccountInterface from "../Interface/LinkedInAccount";
import ResponseClass from "./Response";
import Start from "./Start";
import dotenv from "dotenv";

dotenv.config({ path: "data.env" });

class LinkedInAccount extends Start implements LinkedInAccountInterface {
    account_id: string;
    proxy_id: string = "";
    uid: string = "";
    workspace_id: string = "";
    timezone: string = "";
    active_from: string = "";
    active_to: string = "";
    email: string = "";
    password: string = "";
    status: Status = Status.Disconnected;
    created_at: number | undefined = 0;
    updated_at: number | undefined = 0;
    session?: string | undefined = "";

    /**
     * Constructor
     * @param account
     */
    constructor(account?: LinkedInAccountInterface) {
        super();
        this.account_id = account?.account_id || this.generateId();
        this.proxy_id = account?.proxy_id || "";
        this.uid = account?.uid || "";
        this.workspace_id = account?.workspace_id || "";
        this.timezone = account?.timezone || "";
        this.active_from = account?.active_from || "";
        this.active_to = account?.active_to || "";
        this.email = account?.email || "";
        this.password = account?.password || "";
        this.status = account?.status || Status.Disconnected;
        this.created_at = account?.created_at || new Date().getTime();
        this.updated_at = account?.updated_at || new Date().getTime();
        this.session = account?.session || "";
    }

    // Getters
    /**
     * Get Account Id
     * @returns string
     * @public
     */
    getAccountId(): string {
        return this.account_id;
    }

    /**
     * Get Proxy Id
     * @returns string
     * @public
     */
    getProxyId(): string {
        return this.proxy_id;
    }

    /**
     * Get UID
     * @returns string
     * @public
     */
    getUID(): string {
        return this.uid;
    }

    /**
     * Get Workspace Id
     * @returns string
     * @public
     */
    getWorkspaceId(): string {
        return this.workspace_id;
    }

    /**
     * Get Timezone
     * @returns string
     * @public
     */
    getTimezone(): string {
        return this.timezone;
    }

    /**
     * Get Active From
     * @returns string
     * @public
     */
    getActiveFrom(): string {
        return this.active_from;
    }

    /**
     * Get Active To
     * @returns string
     * @public
     */
    getActiveTo(): string {
        return this.active_to;
    }

    /**
     * Get Email
     * @returns string
     * @public
     */
    getEmail(): string {
        return this.email;
    }

    /**
     * Get Password
     * @returns string
     * @public
     */
    getPassword(): string {
        return this.password;
    }

    /**
     * Get Status
     * @returns string
     * @public
     */
    getStatus(): Status {
        return this.status;
    }

    /**
     * Get Created At
     * @returns number
     * @public
     */
    getCreatedAt(): number | undefined {
        return this.created_at;
    }

    /**
     * Get Updated At
     * @returns number
     * @public
     */
    getUpdatedAt(): number | undefined {
        return this.updated_at;
    }

    /**
     * Get Account
     */
    getAccount(): LinkedInAccountInterface {
        return {
            account_id: this.account_id,
            proxy_id: this.proxy_id,
            uid: this.uid,
            workspace_id: this.workspace_id,
            timezone: this.timezone,
            active_from: this.active_from,
            active_to: this.active_to,
            email: this.email,
            password: this.password,
            status: this.status,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }

    // Setters
    /**
     * Set Proxy Id
     * @param proxy_id
     * @public
     */
    setProxyId(proxy_id: string): void {
        this.proxy_id = proxy_id;
    }

    /**
     * Set UID
     * @param uid
     * @public
     */
    setUID(uid: string): void {
        this.uid = uid;
    }

    /**
     * Set Workspace Id
     * @param workspace_id
     * @public
     */
    setWorkspaceId(workspace_id: string): void {
        this.workspace_id = workspace_id;
    }

    /**
     * Set Timezone
     * @param timezone
     * @public
     */
    setTimezone(timezone: string): void {
        this.timezone = timezone;
    }

    /**
     * Set Active From
     * @param active_from
     * @public
     */
    setActiveFrom(active_from: string): void {
        this.active_from = active_from;
    }

    /**
     * Set Active To
     * @param active_to
     * @public
     */
    setActiveTo(active_to: string): void {
        this.active_to = active_to;
    }

    /**
     * Set Email
     * @param email
     * @public
     */
    setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Set Password
     * @param password
     * @public
     */
    setPassword(password: string): void {
        this.password = password;
    }

    /**
     * Set Status
     * @param status
     * @public
     */
    setStatus(status: Status): void {
        this.status = status;
    }

    /**
     * Set Created At
     * @param created_at
     * @public
     */
    setCreatedAt(): void {
        this.created_at = new Date().getTime();
    }

    /**
     * Set Updated At
     * @param updated_at
     * @public
     */
    setUpdatedAt(): void {
        this.updated_at = new Date().getTime();
    }

    /**
     * Set Account
     * @param account
     * @public
     */
    setAccount(account: LinkedInAccountInterface): void {
        this.account_id = account.account_id;
        this.proxy_id = account.proxy_id;
        this.uid = account.uid;
        this.workspace_id = account.workspace_id;
        this.timezone = account.timezone;
        this.active_from = account.active_from;
        this.active_to = account.active_to;
        this.email = account.email;
        this.password = account.password;
        this.status = account.status;
        this.created_at = account.created_at;
        this.updated_at = account.updated_at;
    }

    /**
     * Validate Account
     */
    validate() {
        if (!this.timezone) {
            throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.TimezoneRequired);
        }
        if (!this.active_from) {
            throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.ActiveFromRequired);
        }
        if (!this.active_to) {
            throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.ActiveToRequired);
        }
        this.validateEmail(this.email);
        if (!this.password) {
            throw new ResponseClass(ResStatus.BadRequest, CommonFields.Password);
        }

        if (!this.uid) {
            throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.Uid);
        }

        if (!this.workspace_id) {
            throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.Workspace);
        }
    }

    /**
     * Validate Proxy
     */
    validateProxy() {
        if (!this.proxy_id) {
            throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.Proxy);
        }
    }

    /**
     * Get Accounts
     * @param uid
     * @param workspace_id
     * @returns LinkedInAccountInterface[]
     */
    async getAccountByUidAndWorkspaceId(uid: string = this.uid, workspace_id: string = this.workspace_id): Promise<LinkedInAccountInterface[]> {
        return (await this.getAll(Collections.LinkedinAccount, { $and: [{ uid: uid }, { workspace_id: workspace_id }] })) as unknown as LinkedInAccountInterface[];
    }

    /**
     * Get Account
     * @param account_id
     * @returns LinkedInAccountInterface
     */
    async getAccountById(account_id: string = this.account_id): Promise<LinkedInAccountInterface> {
        return (await this.getOne(Collections.LinkedinAccount, { account_id: account_id, })) as unknown as LinkedInAccountInterface;
    }

    /**
     * Get Account
     * @param email
     * @param uid
     * @param workspace_id
     * @returns LinkedInAccountInterface
     */
    async getAccountDetails(email: string = this.email, uid: string = this.uid, workspace_id: string = this.workspace_id): Promise<LinkedInAccountInterface> {
        return (await this.getOne(Collections.LinkedinAccount, { $and: [{ email: email }, { uid: uid }, { workspace_id: workspace_id }] })) as unknown as LinkedInAccountInterface;
    }


    /**
     * Get Account Cookies
     * @param account_id
     */
    async getAccountCookies(account_id: string = this.account_id): Promise<any> {
        return (await this.getOne(Collections.LinkedInCookies, { account_id: account_id })) as unknown as any;
    }


    /**
     * Get All LinkedInAccounts
     * @params uid
     * @params workspace_id
     */
    async getAllLinkedInAccounts(uid: string = this.uid, workspace_id: string = this.workspace_id): Promise<LinkedInAccountInterface[]> {
        return (await this.getAll(Collections.LinkedinAccount, { $and: [{ uid: uid }, { workspace_id: workspace_id }] })) as unknown as LinkedInAccountInterface[];
    }

    /**
     * Check Account Exists
     * @param email
     * @param uid
     * @param workspace_id
     */
    async checkAccountExists(email: string = this.email, uid: string = this.uid, workspace_id: string = this.workspace_id): Promise<void> {
        let account = await this.getAccountDetails(email, uid, workspace_id);

        if (account) {
            throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.AlreadyExists);
        }
    }

    /**
     * Check Account Not Exists
     * @param account_id
     */
    async checkAccountNotExistsAccountId(account_id: string = this.account_id): Promise<void> {
        let account = await this.getAccountById(account_id);

        if (!account) {
            throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.NotFound);
        }
    }

    /**
     * Check Account Not Exists
     * @param email
     * @param uid
     * @param workspace_id
     */
    async checkAccountNotExists(email: string = this.email, uid: string = this.uid, workspace_id: string = this.workspace_id): Promise<void> {
        let account = await this.getAccountDetails(email, uid, workspace_id);

        if (!account) {
            throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.NotFound);
        }
    }

    /**
     * Insert Account
     */
    async insertAccount(): Promise<void> {
        await this.insertOne(Collections.LinkedinAccount, this.getAccount());
    }

    /**
     * Update Account
     */
    async updateAccount(): Promise<void> {
        await this.updateOne(Collections.LinkedinAccount, { account_id: this.account_id }, { $set: this.getAccount() });
    }

    /**
     * Delete Account
     * @param account_id
     */
    async deleteAccount(account_id: string = this.account_id): Promise<void> {
        await this.deleteOne(Collections.LinkedinAccount, { account_id: account_id });
    }

    /**
     * Send OTP
     * @params param
     */
    async sendOTP(params: any) {
        let res = await axios
            .get(
                process.env.REACT_APP_API_URL +
                "/login?" +
                new URLSearchParams(params)
            )
            .then((res) => res.data)
            .catch((err) => {
                throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.OTPError);
            });
        return res;
    }

    /**
     * Validate OTP
     * @param account_id
     * @param otp
     */
    async validateOTP(account_id: string = this.account_id, otp: string,) {
        let res = await axios
            .get(
                process.env.REACT_APP_API_URL +
                "/verifyCode?" +
                new URLSearchParams({ session_id: (await this.getAccountById(account_id)).session || "", code: otp })
            )
            .then((res) => res.data)
            .catch((err) => {
                throw new ResponseClass(ResStatus.BadRequest, LinkedInAccountMessage.OTPError);
            });

        return res;
    }

    /**
     * Save Cookie
     * @param account_id
     * @param workspace_id
     * @param uid
     * @param cookies
     */
    async saveCookie(account_id: string = this.account_id, workspace_id: string = this.workspace_id, uid: string = this.uid, cookies: any) {
        await this.insertOne(Collections.LinkedInCookies, { account_id: account_id, workspace_id: workspace_id, uid: uid, cookies: cookies.cookies });
        await this.updateOne(Collections.LinkedinAccount, { account_id: account_id, workspace_id: workspace_id, uid: uid }, { $set: { status: Status.Connected } });
    }


    /**
     * Flush
     * @description Flush the object
     */
    flush(): void {
        this.account_id = "";
        this.proxy_id = "";
        this.uid = "";
        this.workspace_id = "";
        this.timezone = "";
        this.active_from = "";
        this.active_to = "";
        this.email = "";
        this.password = "";
        this.status = Status.Disconnected;
        this.created_at = 0;
        this.updated_at = 0;
    }

}

export default LinkedInAccount;

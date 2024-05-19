import Status from "../../config/Status";
import Collections from "../../config/collections";
import CommonFields from "../../config/response/CommonFields";
import ProxyMessage from "../../config/response/Proxy";
import ResStatus from "../../config/response/ResStatus";
import ProxyInterface from "../Interface/Proxy";
import ResponseClass from "./Response";
import Start from "./Start";

class Proxy extends Start implements ProxyInterface {
  proxy_id: string;
  account_id: string = "";
  country: string = "";
  isCustom: boolean = false;
  isDomain: boolean | undefined = false;
  ip: string = "";
  domain: string | undefined = "";
  port: string = "";
  username: string = "";
  password: string = "";
  status: Status = Status.Active;
  created_at: number | undefined = 0;

  /**
   * Constructor
   * @param proxy
   */
  constructor(proxy?: ProxyInterface) {
    super();
    this.proxy_id = proxy?.proxy_id || this.generateId();
    this.account_id = proxy?.account_id || "";
    this.country = proxy?.country || "";
    this.isCustom = proxy?.isCustom || false;
    this.isDomain = proxy?.isDomain || false;
    this.ip = proxy?.ip || "";
    this.domain = proxy?.domain || "";
    this.port = proxy?.port || "";
    this.username = proxy?.username || "";
    this.password = proxy?.password || "";
    this.status = proxy?.status || Status.Active;
    this.created_at = proxy?.created_at || new Date().getTime();
  }

  // Getters
  /**
   * Get Proxy Id
   * @returns string
   * @public
   */
  getProxyId(): string {
    return this.proxy_id;
  }

  /**
   * Get Account Id
   * @returns string
   * @public
   */
  getAccountId(): string {
    return this.account_id;
  }

  /**
   * Get Country
   * @returns string
   * @public
   */
  getCountry(): string {
    return this.country;
  }

  /**
   * Get Is Custom
   * @returns boolean
   * @public
   */
  getIsCustom(): boolean {
    return this.isCustom;
  }

  /**
   * Get Is Domain
   * @returns boolean
   * @public
   */
  getIsDomain(): boolean | undefined {
    return this.isDomain;
  }

  /**
   * Get IP
   * @returns string
   * @public
   */
  getIp(): string {
    return this.ip;
  }

  /**
   * Get Domain
   * @returns string
   * @public
   */
  getDomain(): string | undefined {
    return this.domain;
  }

  /**
   * Get Port
   * @returns string
   * @public
   */
  getPort(): string {
    return this.port;
  }

  /**
   * Get Username
   * @returns string
   * @public
   */
  getUsername(): string {
    return this.username;
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
  getStatus(): string {
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
   * Get Proxy
   */
  getProxy(): ProxyInterface {
    return {
      proxy_id: this.proxy_id,
      account_id: this.account_id,
      country: this.country,
      isCustom: this.isCustom,
      isDomain: this.isDomain,
      ip: this.ip,
      domain: this.domain,
      port: this.port,
      username: this.username,
      password: this.password,
      status: this.status,
      created_at: this.created_at,
    };
  }

  // Setters
  /**
   * Set Account Id
   * @param account_id
   * @public
   */
  setAccountId(account_id: string): void {
    this.account_id = account_id;
  }

  /**
   * Set Country
   * @param country
   * @public
   */
  setCountry(country: string): void {
    this.country = country;
  }

  /**
   * Set Is Custom
   * @param isCustom
   * @public
   */
  setIsCustom(isCustom: boolean): void {
    this.isCustom = isCustom;
  }

  /**
   * Set Is Domain
   * @param isDomain
   * @public
   */
  setIsDomain(isDomain: boolean): void {
    this.isDomain = isDomain;
  }

  /**
   * Set IP
   * @param ip
   * @public
   */
  setIp(ip: string): void {
    this.ip = ip;
  }

  /**
   * Set Domain
   * @param domain
   * @public
   */
  setDomain(domain: string): void {
    this.domain = domain;
  }

  /**
   * Set Port
   * @param port
   * @public
   */
  setPort(port: string): void {
    this.port = port;
  }

  /**
   * Set Username
   * @param username
   * @public
   */
  setUsername(username: string): void {
    this.username = username;
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
   * Set Proxy
   */
  setProxy(proxy: ProxyInterface): void {
    this.proxy_id = proxy.proxy_id;
    this.account_id = proxy.account_id;
    this.country = proxy.country;
    this.isCustom = proxy.isCustom;
    this.isDomain = proxy.isDomain;
    this.ip = proxy.ip;
    this.domain = proxy.domain;
    this.port = proxy.port;
    this.username = proxy.username;
    this.password = proxy.password;
    this.status = proxy.status;
    this.created_at = proxy.created_at;
  }

  /**
   * Validate
   * @public
   */
  validate(): void {
    if (this.isDomain) {
      this.validateDomain(this.domain as string);
    } else {
      this.validateIpAddress(this.ip);
    }
    this.validatePort(this.port);
    this.validateCountry(this.country);
    if (!this.username) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Username);
    }
    if (!this.password) {
      throw new ResponseClass(ResStatus.BadRequest, CommonFields.Password);
    }
    this.validateStatus(this.status);
  }

  /**
   * Get All Active Proxies
   */
  async getAllActiveProxies(): Promise<ProxyInterface[]> {
    return (await this.getAll(Collections.Proxy, {
      status: Status.Active,
    })) as unknown as ProxyInterface[];
  }

  /**
   * Get Proxy
   * @param proxy_id
   * @param account_id
   * @public
   */
  async getProxyById(
    proxy_id: string = this.proxy_id,
    account_id: string = this.account_id
  ): Promise<ProxyInterface> {
    return (await this.getOne(Collections.Proxy, {
      $or: [{ proxy_id: proxy_id }, { account_id: account_id }],
    })) as unknown as ProxyInterface;
  }

  /**
   * Get Proxy
   * @public
   * @param ip
   * @param domain
   * @param port
   */
  async getProxyByIpDomainPort(
    ip: string = this.ip,
    domain: string = this.domain as string,
    port: string = this.port
  ): Promise<ProxyInterface> {
    return (await this.getOne(Collections.Proxy, {
      $or: [{ ip: ip }, { domain: domain }],
      port: port,
    })) as unknown as ProxyInterface;
  }

  /**
   * Get Top Available Proxy by Country
   * @param country
   * @public
   */
  async getTopAvailableProxyByCountry(country: string = this.country): Promise<ProxyInterface> {
    return (await this.getOne(Collections.Proxy, {
      country: country,
      status: Status.Active,
    })) as unknown as ProxyInterface;
  }

  /**
   * Check Proxy Exists
   * @public
   * @param ip
   * @param domain
   * @param port
   */
  async checkProxyExists(
    ip: string = this.ip,
    domain: string = this.domain as string,
    port: string = this.port
  ): Promise<void> {
    let proxy = await this.getProxyByIpDomainPort(ip, domain, port);
    if (proxy) {
      throw new ResponseClass(ResStatus.BadRequest, ProxyMessage.AlreadyExist);
    }
  }

  /**
   * Check Proxy Not Exists
   * @public
   * @param ip
   * @param domain
   * @param port
   */
  async checkProxyNotExists(
    ip: string = this.ip,
    domain: string = this.domain as string,
    port: string = this.port
  ): Promise<void> {
    let proxy = await this.getProxyByIpDomainPort(ip, domain, port);
    if (!proxy) {
      throw new ResponseClass(ResStatus.BadRequest, ProxyMessage.NotFound);
    }
  }

  /**
   * Check Proxy Not Exists
   * @public
   * @param Country
   */
  async checkProxyNotExistsByCountry(
    country: string = this.country
  ): Promise<void> {
    let proxy = await this.getOne(Collections.Proxy, {
      country: country,
    });
    if (proxy) {
      throw new ResponseClass(ResStatus.BadRequest, ProxyMessage.NotFound);
    }
  }

  /**
   * Check Proxy Exists
   * @param proxy_id
   * @param account_id
   * @public
   */
  async checkProxyExistsById(
    proxy_id: string = this.proxy_id,
    account_id: string = this.account_id
  ): Promise<void> {
    let proxy = await this.getProxyById(proxy_id, account_id);
    if (!proxy) {
      throw new ResponseClass(ResStatus.BadRequest, ProxyMessage.NotFound);
    }
  }

  /**
   * Create New Proxy
   * @public
   */
  async createNewProxy(): Promise<void> {
    await this.insertOne(Collections.Proxy, this.getProxy());
  }

  /**
   * Update Proxy
   * @public
   */
  async updateProxy(): Promise<void> {
    await this.updateOne(
      Collections.Proxy,
      { proxy_id: this.proxy_id },
      { $set: this.getProxy() }
    );
  }

  /**
   * Delete Proxy
   * @param proxy_id
   * @public
   */
  async deleteProxy(proxy_id: string = this.proxy_id): Promise<void> {
    await this.deleteOne(Collections.Proxy, { proxy_id: proxy_id });
  }

  /**
   * Delete Proxy by Account Id
   * @param account_id
   * @public
   */
  async deleteProxyByAccountId(account_id: string = this.account_id): Promise<void> {
    await this.deleteOne(Collections.Proxy, { account_id: account_id });
  }

  /**
   * Flush
   * @public
   */
  flush(): void {
    this.proxy_id = "";
    this.account_id = "";
    this.country = "";
    this.isCustom = false;
    this.isDomain = false;
    this.ip = "";
    this.domain = "";
    this.port = "";
    this.username = "";
    this.password = "";
    this.status = Status.Active;
    this.created_at = 0;
  }
}

export default Proxy;

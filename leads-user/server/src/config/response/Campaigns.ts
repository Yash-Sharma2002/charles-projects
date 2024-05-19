

/**
 * CampaignsFields
 * @description CampaignsFields is used to define the response messages for Campaigns
 */
enum CampaignsFields {
    LinkedinAccountId = 'Linkedin Account Id is required',
    Uid = 'Uid is required',
    WorkspaceId = 'Workspace Id is required',
    CampaignId = 'Campaign Id is required',
    CampaignName = 'Campaign Name is required',
    CampaignType = 'Campaign Type is required',
    SearchItems = 'Search Items is required',
    Created = 'Campaign Created Successfully',
    Updated = 'Campaign Updated Successfully',
    Deleted = 'Campaign Deleted Successfully',
    Started = 'Campaign Started Successfully',
    Stopped = 'Campaign Stopped Successfully',
    Duplicate = 'Campaign Duplicated and Saved as Draft',
    SetupError = 'Campaign could not be setup',
    StartError = 'Campaign could not be started',
    FindSuccess = 'Campaigns Found',
    ProxyError = 'Proxy Not Found',
    CookieError = 'Linkedin Account Not Connected Successfully. Please connect the account again',
    EMailEnriched = "Email has been found",
    EnrichError = "Email could not be found",
}

export default CampaignsFields;
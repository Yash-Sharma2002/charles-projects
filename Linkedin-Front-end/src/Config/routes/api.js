import { apiHost, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from "../config";

const googleOAuthUrl = () => {
  const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    // 'https://www.googleapis.com/auth/gmail.modify',
  ].join(" ");

  const params = {
    response_type: "code",
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    scope,
    access_type: "offline",
    prompt: "consent",
  };

  const urlParams = new URLSearchParams(params).toString();

  window.location = `${googleAuthUrl}?${urlParams}`;
};

const buildAvatarRoute = (avatar) => {
  return `${apiHost}/api/media/${avatar}`;
};

const routes = {
  fullInboxRoute: `${apiHost}/api/inbox-count/`,
  triggerCampaignRoute: `${apiHost}/api/trigger/`,
  campaignRoute: `${apiHost}/api/campaigns/`,
  campaignSequenceRoute: `${apiHost}/api/campaign-sequences/`,
  campaignLinkedinAccountsRoute: `${apiHost}/api/campaign-linkedin-accounts/`,
  signUpRoute: `${apiHost}/api/accounts/register/`,
  logInRoute: `${apiHost}/api/accounts/token/`,
  clientRoute: `${apiHost}/api/whitelabels/`,
  userProfileRoute: `${apiHost}/api/accounts/`,
  importBulkLinkedinAccountsRoute: `${apiHost}/api/accounts/import-bulk-linkedin-accounts/`,
  linkedinAccountsRoute: `${apiHost}/api/accounts/linkedin-accounts/`,
  countriesRoute: `${apiHost}/api/countries/`,
  userLinkedinAccountRoute: `${apiHost}/api/accounts/connect/`,
  userLinkedinAccountDisconnectRoute: `${apiHost}/api/accounts/disconnect/`,
  prospectsRoute: `${apiHost}/api/prospects/`,
  labelsRoute: `${apiHost}/api/labels/`,
  roomsRoute: `${apiHost}/api/rooms/`,
  roomReadRoute: `${apiHost}/api/room-readed/`,
  messagesRoute: `${apiHost}/api/messages/`,
  assignLabelRoute: `${apiHost}/api/assign-label/`,
  buildAvatarRoute: buildAvatarRoute,
  googleAuthRoute: googleOAuthUrl,
  googleCodeExchangeToAccessTokenUrl: `${apiHost}/api/accounts/connect-google/`,
  OutlookCodeExchangeToAccessTokenUrl: `${apiHost}/api/accounts/connect-outlook/`,
  connectSmtpImap: `${apiHost}/api/accounts/connect-smtp-imap/`,
  connectedAccountsUrl: `${apiHost}/api/accounts/connected-accounts/`,
};

export default routes;

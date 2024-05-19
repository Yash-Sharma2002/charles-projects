import express from "express";
import {   registerAddress, registerAdmin, registerMember, registerOrganisation, registerWorkspace } from "../controller/register";
import { login } from "../controller/login";

import { deleteUser,   deleteUserWorkspace,   updateUser } from "../controller/users";
import { getAddress, getAllUsersByOrganisation, getAllUsersByWorkspace, getAllWorkSpacesByOrganisation, getAllWorkSpacesByUserId, getOrganizationDetails, getUserDetails, getWorkspaceDetails } from "../controller/get-details";
import { updateAddress, updateOrganization, updateOrganizationAddress, updateUserDetails, updateWorkspace } from "../controller/update-details";
import { addMemberToWorkspace, inviteMember, removeMemberFromWorkspace } from "../controller/invite-member";
import { addCookies, connectLinkedIn,deleteCookies,deleteLinkedinAccount,getLinkedinAccounts,linkedinOTPVerify } from "../controller/linkedin";
import { deleteCampaign, getAllCampaignDataofWorksapce, getCampaignResults, getCampaigns, reRunCampaign, saveDraftCampaigns, startCampaign } from "../controller/campaigns";
import { addProxies } from "../controller/proxies";

const router = express.Router();

// register
router.post("/api/register", registerAdmin); // tested
router.post("/api/register-user", registerMember); // tested
router.post("/api/register-organisation", registerOrganisation); // tested
router.post("/api/register-address", registerAddress); // tested
router.post("/api/register-workspace", registerWorkspace); // tested

// delete user
router.delete("/api/delete-user", deleteUser); // tested
router.delete("/api/delete-user-workspace", deleteUserWorkspace); 

// get details
router.get("/api/login", login); // tested
router.get("/api/get-user", getUserDetails); // tested
router.get("/api/get-workspace-details", getWorkspaceDetails); // tested
router.get("/api/get-organisation-details", getOrganizationDetails); // tested
router.get("/api/get-workspace-details-by-user", getAllWorkSpacesByUserId); // tested
router.get("/api/get-all-workspace-by-organisation", getAllWorkSpacesByOrganisation) // tested
router.get("/api/get-all-user-by-workspace", getAllUsersByWorkspace) // tested
router.get("/api/get-all-users-by-organisation", getAllUsersByOrganisation); // tested
router.get("/api/get-address", getAddress); // tested

// updates
router.post("/api/update-user", updateUserDetails);
router.post("/api/update-workspace", updateWorkspace);
router.post("/api/update-address", updateAddress);
router.post("/api/update-organisation-address", updateOrganizationAddress);
router.post("/api/update-organisation", updateOrganization);

// invite member
router.post("/api/invite-member", inviteMember); // tested
router.post("/api/add-member", addMemberToWorkspace); // tested
router.post("/api/remove-member", removeMemberFromWorkspace); // tested

// linkedin
router.post("/api/connect-linkedin", connectLinkedIn);
router.post("/api/verify-otp", linkedinOTPVerify);
router.get("/api/get-linkedin-accounts", getLinkedinAccounts)
router.post("/api/add-cookies", addCookies)
router.delete("/api/delete-cookies", deleteCookies)
router.delete("/api/delete-account", deleteLinkedinAccount)

// campaigns
router.post("/api/save-draft-campaigns", saveDraftCampaigns);
router.get("/api/get-campaigns", getCampaigns);
router.get("/api/get-campaigns-all-results", getAllCampaignDataofWorksapce);
router.delete("/api/delete-campaign", deleteCampaign);
router.post("/api/start-campaign", startCampaign);
router.get("/api/get-campaigns-results", getCampaignResults);
router.get("/api/re-run-campaigns", reRunCampaign);


// proxies
router.post("/api/add-proxies",addProxies); 

export default router;

import Roles from "../../config/Roles";
import Collections from "../../config/collections";
import CommonMessage from "../../config/response/CommonMessage";
import ResStatus from "../../config/response/ResStatus";
import ResponseClass from "./Response";
import Start from "./Start";

class Views extends Start {
  constructor() {
    super();
  }

  /**
   * Get User Roles In Organisation And Workspace
   * @param user_id
   * @param workspace_id
   * @param organisation_id
   * @returns User Roles
   */
  async getUserRolesInOrganisationAndWorkspace(
    user_id: string,
    workspace_id: string,
    organisation_id: string
  ) {
    try {
      this.connect.start();
      let userRoles = await this.connect
        .getCollection(Collections.UserOrganisation)
        .aggregate([
          {
            $match: {
              $and: [
                { user_id: user_id },
                { organisation_id: organisation_id },
              ],
            },
          },
        ])
        .lookup({
          from: Collections.UserWorkspace,
          localField: "user_id",
          foreignField: "user_id",
          as: "userRoles",
        })
        .unwind("$userRoles")
        .project({
          user_id: 1,
          organisation_id: 1,
          role: 1,
          workspace_id: "$userRoles.workspace_id",
          workspace_role: "$userRoles.role",
        })
        .match({
          workspace_id: workspace_id,
        })
        .toArray();
      this.connect.commit();
      return userRoles[0];
    } catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get Workspace Members
   * @param workspace_id
   * @returns Workspace Members
   */
  async getWorkspaceMembers(workspace_id: string) {
    try {
      this.connect.start();
      let userRoles = await this.connect
        .getCollection(Collections.UserWorkspace)
        .aggregate([
          {
            $match: {
              workspace_id: workspace_id,
            },
          },
        ])
        .lookup({
          from: Collections.User,
          localField: "user_id",
          foreignField: "uid",
          as: "userRoles",
        })
        .unwind("$userRoles")
        .project({
          _id: 0,
          workspace_id: 1,
          role: 1,
          name: "$userRoles.name",
          username: "$userRoles.username",
          email: "$userRoles.email",
          uid: "$userRoles.uid",
        })
        .toArray();
      this.connect.commit();
      return userRoles;
    } catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get Organisation Members
   * @param organisation_id
   * @returns Organisation Members
   */
  async getOrganisationMembers(organisation_id: string) {
    try {
      this.connect.start();
      let userRoles = await this.connect
        .getCollection(Collections.UserOrganisation)
        .aggregate([
          {
            $match: {
              organisation_id: organisation_id,
            },
          },
        ])
        .lookup({
          from: Collections.User,
          localField: "user_id",
          foreignField: "uid",
          as: "userRoles",
        })
        .unwind("$userRoles")
        .project({
          _id: 0,
          organisation_id: 1,
          role: 1,
          name: "$userRoles.name",
          username: "$userRoles.username",
          email: "$userRoles.email",
          uid: "$userRoles.uid",
        })
        .toArray();
      this.connect.commit();
      return userRoles;
    } catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get Organisation Members By Role
   * @param organisation_id
   * @param role
   */
  async getOrganisationMembersByRole(organisation_id: string, role: string) {
    try {
      this.connect.start();
      let userRoles = await this.connect
        .getCollection(Collections.UserOrganisation)
        .aggregate([
          {
            $match: {
              organisation_id: organisation_id,
              role: role,
            },
          },
        ])
        .lookup({
          from: Collections.User,
          localField: "user_id",
          foreignField: "uid",
          as: "userRoles",
        })
        .unwind("$userRoles")
        .project({
          _id: 0,
          organisation_id: 1,
          role: 1,
          name: "$userRoles.name",
          status: "$userRoles.status",
          username: "$userRoles.username",
          email: "$userRoles.email",
          uid: "$userRoles.uid",
        })
        .toArray();
      this.connect.commit();
      return userRoles;
    } catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }


  /**
   * Get Workspaces By Organisation
   * @param organisation_id
   * @returns Workspaces
   */
  async getWorkspacesByOrganisation(organisation_id: string) {
    try {
      this.connect.start();
      let workspaces = await this.connect
        .getCollection(Collections.OrganisationWorkspace)
        .aggregate([
          {
            $match: {
              organisation_id: organisation_id,
            },
          },
        ])
        .lookup({
          from: Collections.Workspace,
          localField: "workspace_id",
          foreignField: "workspace_id",
          as: "workspaces",
        })
        .unwind("$workspaces")
        .project({
          _id: 0,
          organisation_id: 1,
          workspace_id: 1,
          name: "$workspaces.workspace_name",
          description: "$workspaces.workspace_description",
          group: "$workspaces.workspace_group",
        })
        .toArray();
      this.connect.commit();
      return workspaces;
    } catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get Organisations By Workspace
   * @param workspace_id
   * @param organisation_id
   * @returns Organisations
   */
  async getOrganisationAndWorkspaceDetails(
    workspace_id: string,
    organisation_id: string
  ) {
    try {
      this.connect.start();
      let organisation = await this.connect
        .getCollection(Collections.OrganisationWorkspace)
        .aggregate([
          {
            $match: {
              organisation_id: organisation_id,
              workspace_id: workspace_id,
            },
          },
        ])
        .lookup({
          from: Collections.Organisation,
          localField: "organisation_id",
          foreignField: "organisation_id",
          as: "organisation",
        })
        .lookup({
          from: Collections.Workspace,
          localField: "workspace_id",
          foreignField: "workspace_id",
          as: "workspace",
        })
        .unwind("$organisation")
        .unwind("$workspace")
        .project({
          _id: 0,
          organisation_id: 1,
          workspace_id: 1,
          organisation_name: "$organisation.organisation_name",
          workspace_name: "$workspace.workspace_name",
        })
        .toArray();
      this.connect.commit();
      return organisation[0];
    } catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get User Details with Organisation and Workspace
   */
  async getUserDetailsWithOrganisationAndWorkspace(user_id: string) {
    try {
      this.connect.start();
      let user = await this.connect
        .getCollection(Collections.User)
        .aggregate([
          {
            $match: {
              uid: user_id,
            },
          },
        ])
        .lookup({
          from: Collections.UserOrganisation,
          localField: "uid",
          foreignField: "user_id",
          as: "userOrganisation",
        })
        .lookup({
          from: Collections.UserWorkspace,
          localField: "uid",
          foreignField: "user_id",
          as: "userWorkspace",
        })
        .lookup({
          from: Collections.Organisation,
          localField: "userOrganisation.organisation_id",
          foreignField: "organisation_id",
          as: "organisation",
        })
        .lookup({
          from: Collections.Workspace,
          localField: "userWorkspace.workspace_id",
          foreignField: "workspace_id",
          as: "workspace",
        })
        .lookup({
          from: Collections.UserAccess,
          localField: "uid",
          foreignField: "uid",
          as: "userAccess"
        })
        .unwind("$userOrganisation")
        // .unwind("$userWorkspace")
        .unwind("$organisation")
        // .unwind("$workspace")
        .unwind("$userAccess")
        .project({
          _id: 0,
          uid: 1,
          name: 1,
          username: 1,
          email: 1,
          access_token: "$userAccess.access_token",
          session: "$userAccess.session",
          organisation_id: "$organisation.organisation_id",
          organisation_name: "$organisation.organisation_name",
          organisation_image: "$organisation.organisation_image",
          role: "$userOrganisation.role",
          workspace: "$workspace",
        })
        .toArray();
      this.connect.commit();
      return user[0];
    } catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get All sequence of an organisation by organisation_id and admin
   * @param organisation_id
   * @param user_id
   * @returns Sequence[]
   */
  async getAllSequenceByOrganisation(organisation_id: string, user_id: string) {
    try {
      this.connect.start();
      let sequence = await this.connect
        .getCollection(Collections.Sequence)
        .aggregate([
          {
            $match: {
              organisation_id: organisation_id,
            },
          },
        ])
        .lookup({
          from: Collections.UserOrganisation,
          localField: "organisation_id",
          foreignField: "organisation_id",
          as: "admin",
        })
        .unwind("$admin")
        .project({
          _id: 0,
          sequence_Id: 1,
          SequenceFor: 1,
          description: 1,
          name: 1,
          current: 1,
          increment: 1,
          maxDigits: 1,
          prefix: 1,
          suffix: 1,
          created_at: 1,
          updated_at: 1,
          admin: "$admin.user_id",
          role: "$admin.role",
        })
        .match({
          admin: user_id,
          role: Roles.OrganisationAdmin
        })
        .toArray();
      this.connect.commit();
      return sequence;
    } catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get Linkedin Account Details
   * @param uid
   * @param workspace_id
   */
  async getLinkedinAccountDetails(uid: string, workspace_id: string) {
    try {
      this.connect.start();
      let linkedinAccount = await this.connect
        .getCollection(Collections.LinkedinAccount)
        .aggregate([
          {
            $match: {
              uid: uid,
              workspace_id: workspace_id,
            },
          },
        ])
        .lookup({
          from: Collections.Proxy,
          localField: "account_id",
          foreignField: "account_id",
          as: "proxy",
        })
        .unwind("$proxy")
        .project({
          _id: 0,
          account_id: 1,
          proxy_id: 1,
          timezone: 1,
          active_from: 1,
          active_to: 1,
          email: 1,
          password: 1,
          status: 1,
          created_at: 1,
          updated_at: 1,
          isCustom: "$proxy.isCustom",
          isDomain: "$proxy.isDomain",
          ip: "$proxy.ip",
          port: "$proxy.port",
          username: "$proxy.username",
          proxy_password: "$proxy.password",

        })
        .toArray();
      this.connect.commit();
      return linkedinAccount;
    } catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }

  /**
   * Get Campaign Details
   * @param uid
   * @param workspace_id
   */
  async getCampaignDetails(uid: string, workspace_id: string) {
    try {
      this.connect.start();
      let campaign = await this.connect
        .getCollection(Collections.Campaigns)
        .aggregate([
          {
            $match: {
              uid: uid,
              workspace_id: workspace_id,
            },
          },
          {
            $lookup: {
              from: Collections.LinkedinAccount,
              localField: "linkedin_account_id",
              foreignField: "account_id",
              as: "linkedin_account"
            }
          },
          {
            $unwind: "$linkedin_account"
          },
          {
            $lookup: {
              from: Collections.CampaignResults,
              let: { campaign_id: "$campaign_id", linkedin_account_id: "$linkedin_account.account_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$campaign_id", "$$campaign_id"] },
                        { $eq: ["$linkedin_account_id", "$$linkedin_account_id"] }
                      ]
                    }
                  }
                },
                {
                  $group: {
                    _id: null,
                    ConnectionRequestSend: { $sum: "$ConnectionRequestSend" },
                    Likes: { $sum: "$Likes" },
                    Messages: { $sum: "$isMessage" },
                    InMail: { $sum: "$isInMail" },
                    Results: { $sum: 1 }
                  }
                }
              ],
              as: "campaign_results"
            }
          },
          {
            $unwind: {
              path: "$campaign_results",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              _id: { account_id: "$linkedin_account.account_id", campaign_id: "$campaign_id", campaign_name: "$campaign_name", campaign_type: "$campaign_type", status: "$status", searchItems: "$searchItems", steps: "$steps", created_at: "$created_at", email: "$linkedin_account.email" },
              ConnectionRequestSend: { $sum: "$campaign_results.ConnectionRequestSend" },
              Likes: { $sum: "$campaign_results.Likes" },
              Messages: { $sum: "$campaign_results.Messages" },
              InMail: { $sum: "$campaign_results.InMail" },
              Results: { $sum: "$campaign_results.Results" }
            }
          },
          {
            $project: {
              _id: 0,
              "campaign_id": "$_id.campaign_id",
              "campaign_name": "$_id.campaign_name",
              "campaign_type": "$_id.campaign_type",
              "status": "$_id.status",
              "searchItems": "$_id.searchItems",
              "steps": "$_id.steps",
              "created_at": "$_id.created_at",
              "linkedin_account_id": "$_id.account_id",
              "linkedin_email": "$_id.email",
              "ConnectionRequestSend": 1,
              "Likes": 1,
              "Messages": 1,
              "InMail": 1,
              "Results": 1
            }
          }
        ])
        .toArray();
      this.connect.commit();
      return campaign;
    }
    catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }


  /**
   * Get Campaign Results
   * @param uid
   * @param workspace_id
   */
  async getCampaignResults(uid: string, workspace_id: string) {
    try {
      this.connect.start();
      let campaign = await this.connect
        .getCollection(Collections.Campaigns)
        .aggregate([
          {
            $match: {
              uid: uid,
              workspace_id: workspace_id,
            },
          },
          {
            $lookup: {
              from: Collections.LinkedinAccount,
              localField: "linkedin_account_id",
              foreignField: "account_id",
              as: "linkedin_account"
            }
          },
          {
            $unwind: "$linkedin_account"
          },
          {
            $lookup: {
              from: Collections.CampaignResults,
              let: { campaign_id: "$campaign_id", linkedin_account_id: "$linkedin_account.account_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$campaign_id", "$$campaign_id"] },
                        { $eq: ["$linkedin_account_id", "$$linkedin_account_id"] }
                      ]
                    }
                  }
                }
              ],
              as: "campaign_results"
            }
          },
          {
            $unwind: "$campaign_results"
          },
          {
            $project: {
              _id: 0,
              "campaign_id": 1,
              "campaign_name": 1,
              "campaign_type": 1,
              "status": 1,
              "linkedin_account_id": "$linkedin_account.account_id",
              "linkedin_email": "$linkedin_account.email",
              "Id": { $toString: "$campaign_results._id" },
              "ProfileImage": "$campaign_results.profile_image",
              "ProfileLink": "$campaign_results.profile_link",
              "FirstName": "$campaign_results.first_name",
              "LastName": "$campaign_results.last_name",
              "Company": "$campaign_results.company",
              "Position": "$campaign_results.position",
              "Title": "$campaign_results.title",
              "Email": "$campaign_results.Email",
              "Address": "$campaign_results.address",
              "isConnected": "$campaign_results.isConnected",
              "ConnectionMessage": "$campaign_results.ConnectionMessage",
              "ConnectionRequestSend": "$campaign_results.ConnectionRequestSend",
              "Likes": "$campaign_results.Likes",
              "isMessage": "$campaign_results.isMessage",
              "message": "$campaign_results.message",
              "inmail": "$campaign_results.inmail",
              "isInMail": "$campaign_results.isInMail",
            }
          }
        ])
        .toArray();
      this.connect.commit();
      return campaign;
    }
    catch (error: any) {
      this.connect.abort();
      throw new ResponseClass(
        ResStatus.InternalServerError,
        CommonMessage.InternalServerError
      );
    }
  }
}

export default Views;

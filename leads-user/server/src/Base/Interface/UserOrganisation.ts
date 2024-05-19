import Roles from "../../config/Roles";


/**
 * UserOrganisation Interface
 * @param user_id: string - Collection User - user_id
 * @param organisation_id: string - Collection Organisation - organisation_id
 * @param role: string
 */
interface UserOrganisationInterface {
    user_id: string;
    organisation_id: string;
    role: Roles;
}

export default UserOrganisationInterface
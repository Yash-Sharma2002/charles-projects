import InvitationStatus from "../../config/InvitationStatus";
import Roles from "../../config/Roles";


/**
 * @interface InvitationInterface
 * @description Interface for Invitation
 * @param invitation_id
 * @param sent_by
 * @param email
 * @param organisation_id
 * @param name
 * @param role
 * @param status
 * @param created_at
 * @param expires_at
 */
interface InvitationInterface {
    invitation_id: string;
    sent_by: string;
    email: string;
    organisation_id: string;
    name: string;
    role?: Roles;
    status?: InvitationStatus;
    created_at?: number;
    expires_at?: number;
}

export default InvitationInterface;

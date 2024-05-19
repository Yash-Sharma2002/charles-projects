

/**
 * @interface InviteMessage
 * @description Interface for InviteMessage
 */
enum InviteMessage {
    InviteSent = 'Invite Sent',
    InviteAccepted = 'Invite Accepted',
    InviteRejected = 'Invite Rejected',
    InviteRevoked = 'Invite Revoked',
    InviteExpired = 'Invite Expired',
    InviteNotFound = 'Invite Not Found',
    InviteAlreadyAccepted = 'Invite Already Accepted',
    InvitePending = 'Invite Pending',
    InviteExists = 'Invite Already Exists',
}

export default InviteMessage;
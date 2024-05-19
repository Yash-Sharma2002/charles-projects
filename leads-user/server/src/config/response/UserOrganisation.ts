

/**
 * User Organisation Message
 * @enum {string}
 */
enum UserOrganisationMessage {
    UserAlreadyExists = "User Already Exists in Another Organisation",
    UserNotFound = "User Not Found in Organisation",
    UserNotAdmin = "User Not Admin in Organisation",
    Removed = "User Removed From Organisation",
    Added = "User Added To Organisation",
}

export default UserOrganisationMessage;
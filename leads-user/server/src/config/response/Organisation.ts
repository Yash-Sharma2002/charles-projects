/**
 * Enum for Organisation Messages
 * @enum {string}
 */
enum OrganisationMessage {
 
  Created = "Organisation Created Successfully",
  Updated = "Organisation Updated Successfully",
  Deleted = "Organisation Deleted Successfully",
  NotFound = "Organisation Not Found",
  AlreadyExists = "Organisation Already Exists",
  EmailAlreadyExists = "Organisation Email Already Exists",
  NameAlreadyExists = "Organisation Name Already Exists",
  UserAlreadyExists = "User Already Exists in Another Organisation",
  UserNotFound = "User Not Found in Organisation",
  UserNotAdmin = "User Not Admin in Organisation",
}

export default OrganisationMessage;

/**
 * UserFieldsMessage
 * @description User fields message
 * @readonly
 */
enum UserFieldsMessage {
  LoginSuccess = "Login Success",
  UsernameAlreadyExists = "Username already exists",
  EmailAlreadyExists = "UserEmail already exists",
  UserAlreadyExists = "User already exists",
  UserSuccessfullyCreated = "User Successfully Resgistered",
  UserUpdated = "User Updated Successfully",
  UserDeleted = "User Deleted Successfully",
  UserNotFound = "User Not Found",
  UserInvited = "User Invited",
  AccessDenied = "Access Denied",
  AccessGranted = "Access Granted",
  AccessNotExists = "Access Not Exists",
  CannotUpdatePassword = "Cannot Update Password",
  CannotUpdateUsername = "Cannot Update Username",
  CannotUpdateEmail = "Cannot Update Email",
  ForgetPasswordSuccess = "Email Sent Successfully",
}

export default UserFieldsMessage;

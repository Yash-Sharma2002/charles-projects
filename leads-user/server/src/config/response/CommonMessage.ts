enum CommonMessage {
  InvalidToken = "Invalid Token. Please login again",
  TokenExpired = "Token Expired. Please login again",
  SessionExpired = "Session Expired. Please login again",
  SessionRequired = "Session Required",
  ConnectionError = "Error connecting to MongoDB Atlas",
  ConnectionSuccess = "Connection to MongoDB Atlas established!",
  InvalidRequest = "Invalid Request",
  InvalidCredentials = "Invalid Credentials",
  UnknownError = "Unknown Error",
  InternalServerError = "Internal Server Error",
  ServiceUnavailable = "Service Unavailable",
  OrganisationWorkspaceNotFound = "Organisation Or Workspace Not Found",
}

export default CommonMessage;

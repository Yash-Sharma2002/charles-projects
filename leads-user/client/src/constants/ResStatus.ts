
/**
 * Response Status
 * Used to define response status
 */
enum ResStatus {
  Success = 200,
  Error = 500,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export default ResStatus;

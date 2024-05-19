
/**
 * LinkedIn Account Messages
 * @enum {string}
 * @public
 * @readonly
 * @description LinkedIn Account Messages is used to define the messages for LinkedIn Account
 */
enum LinkedInAccountMessage {
    Uid = "No User is Attached to this LinkedIn Account",
    Workspace = "Workspace is required",
    Proxy = "Proxy is required",
    TimezoneRequired = 'Timezone is required',
    Disconnected = 'LinkedIn Account Disconnected Successfully',
    ActiveFromRequired = 'Active From is required',
    ActiveToRequired = 'Active To is required',
    AlreadyExists = 'LinkedIn account already exists',
    NotFound = 'LinkedIn account not found',
    Created = 'LinkedIn account created successfully',
    Updated = 'LinkedIn account updated successfully',
    Deleted = 'LinkedIn account deleted successfully',
    LinkedInAccountGetSuccess = 'LinkedIn account get successfully',
    Invalid = 'Invalid LinkedIn account',
    OTP = 'OTP Sent Successfully',
    InvalidProxy = 'Invalid Proxy',
    OTPError = 'Something Went wrong while genrating OTP',
    Connected = 'LinkedIn Account Connected Successfully',
}

export default LinkedInAccountMessage;



/**
 * ProxyMessage
 * @description ProxyMessage is used to define the message for Proxy
 * @public
 */
enum ProxyMessage {
    Ip = "Ip is required",
    Country = "Country is required",
    IPInvalid = "Invalid IP",
    Domain = "Domain is required",
    DomainInvalid = "Invalid Domain",
    Port = "Port is required",
    Username = "Username is required",
    Password = "Password is required",
    Status = "Status is required",
    Created = "Proxy Added Successfully",
    Updated = "Proxy Updated Successfully",
    Deleted = "Proxy Deleted Successfully",
    Invalid = "Invalid Proxy",
    NotFound = "Proxy Not Found",
    AlreadyExist = "Proxy Already Exist",
    NotAvailable = "Proxy Not Available in your Country",
}

export default ProxyMessage;


/**
 * Enum for Client Fields
 * @enum {string}
 */
enum ClientFields{
    ClientId = "Client Id is required",
    Name = "Name is required",
    Email = "Email is required",
    Username = "Username is required",
    Phone = "Phone is required",
    AlreadyExists = "Client Already Exists",
    NotFound = "Client Not Found",
    ClientCreated = "Client Created",
    ClientUpdated = "Client Updated",
    ClientDeleted = "Client Deleted"
}

export default ClientFields;
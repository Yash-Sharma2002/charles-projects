
/**
 * Enum for Address response messages.
 * @enum {string}
 */
enum AddressMessage{
    Created = "Address Created Successfully",
    Updated = "Address Updated Successfully",
    Deleted = "Address Deleted Successfully",
    NotFound = "Address Not Found",
    AlreadyExists = "Address Already Exists",
}

export default AddressMessage;
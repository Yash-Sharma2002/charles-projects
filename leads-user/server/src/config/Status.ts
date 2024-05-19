
/**
 * Enum for Status
 * @enum {string}
 */
enum Status{
    Active = "Active",
    Inactive = "Inactive",
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
    Deleted = "Deleted",
    Blocked = "Blocked",
    Unblocked = "Unblocked",

    // Proxy Status
    Occupied = "Occupied",

    // LinkedIn Account Status
    Connected = "Connected",
    Disconnected = "Disconnected",

    // Campaign Status
    Running = "Running",
    Paused = "Paused",
    Stopped = "Stopped",
    Completed = "Completed",
    Failed = "Failed",
    Scheduled = "Scheduled",
    Queued = "Queued",
    Processing = "Processing",
    Draft = "Draft",
    Error= "Error",
    

}

export default Status;
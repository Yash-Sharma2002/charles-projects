


/**
 * UserProjectResponse
 * @description UserProjectResponse enum
 * @enum {string}
 */
enum UserProjectResponse {
    AlreadyExist = 'User Already in the project',
    NotFound = 'User Not Found in the project',
    Created = 'User Assigned in the Project',
    Removed = 'User Removed from the Project'
}

export default UserProjectResponse;

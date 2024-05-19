


/**
 * Projects Message
 * @readonly
 * @enum {string}
 */
enum ProjectsMessage {
    ProjectNumber = 'Project Number is required',
    Name = 'Name is required',
    Description = 'Description is required',
    Client = 'Client is required',
    ProjectManager = 'Project Manager is required',
    ExecutionManager = 'Execution Manager is required',
    Status = 'Status is required',
    AlreadyExists = 'Project Already Exists',
    NotFound = 'Project Not Found',
    ProjectCreated = 'Project Created',
    ProjectUpdated = 'Project Updated',
    ProjectDeleted = 'Project Deleted'
}

export default ProjectsMessage;
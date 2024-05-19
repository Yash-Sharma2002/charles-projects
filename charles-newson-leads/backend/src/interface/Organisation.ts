
export default interface Organisation {
    organisation_id: string;
    organisation_name?: string;
    organisation_logo?: string;
    organisation_email?: string;
    organisation_phone?: string;
    organisation_type?: string;
    organisation_website?: string;
    created?: Date;
    modified?: Date;
}
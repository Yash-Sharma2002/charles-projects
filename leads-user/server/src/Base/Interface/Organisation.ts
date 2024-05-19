

/***
 * Interface for Organisation
 * @param organisation_id: string
 * @param organisation_name: string
 * @param organisation_image: string
 * @param organisation_description: string - Optional
 * @param organisation_email: string
 * @param organisation_website: string - Optional
 * @param organisation_phone: string  
 * @param organisation_type: string 
 * @param organisation_address: string - Collection Address - address_id
 */

interface OrganisationInterface {
    organisation_id: string;
    organisation_name: string;
    organisation_image: string;
    organisation_description?: string;
    organisation_email: string;
    organisation_website?: string;
    organisation_phone: string;
    organisation_type: string;
    organisation_address?: string;
}


export default OrganisationInterface
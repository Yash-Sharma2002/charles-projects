
export default interface Address {
    address_id: string;
    foreign_id: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    created?: Date;
    modified?: Date;
}
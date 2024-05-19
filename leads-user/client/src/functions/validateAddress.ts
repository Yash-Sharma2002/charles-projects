import setError from "./setError";

export default function validateAddress(address: {
  address_line1: string;
  address_line2: string;
  address_country: string;
  address_city: string;
  address_state: string;
  address_postal_code: number;
}) {
    if (address.address_line1 === undefined || address.address_line1 === "") {
        return setError("Address line 1 is required", "address_line1");
    }
    if (address.address_city === undefined || address.address_city === "") {
        return setError("City is required", "address_city");
    }
    if (address.address_state === undefined || address.address_state === "") {
        return setError("State is required", "address_state");
    }
    if (address.address_country === undefined || address.address_country === "") {
        return setError("address_Country is required", "address_country");
    }
    if (address.address_postal_code === undefined ){
        return setError("Postal code is required", "address_postal_code");
    }
    return setError("", "", false);
}

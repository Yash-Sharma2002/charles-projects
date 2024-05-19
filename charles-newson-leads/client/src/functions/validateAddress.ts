import setError from "./setError";

export default function validateAddress(address: {
  address_line1: string;
  address_line2: string;
  country: string;
  city: string;
  state: string;
  postal_code: number;
}) {
    if (address.address_line1 === undefined || address.address_line1 === "") {
        return setError("Address line 1 is required", "address_line1");
    }
    if (address.city === undefined || address.city === "") {
        return setError("City is required", "city");
    }
    if (address.state === undefined || address.state === "") {
        return setError("State is required", "state");
    }
    if (address.country === undefined || address.country === "") {
        return setError("Country is required", "country");
    }
    if (address.postal_code === undefined ){
        return setError("Postal code is required", "postal_code");
    }
    return setError("", "", false);
}

import setError from "./setError";

export default function validateOrganisation(organisation: {
  name: string;
  email: string;
  phone: string;
  website: string;
  logo: string;
}) {


  if (organisation.name === undefined || organisation.name === "") {
    return setError("Organisation name is required", "name");
  }
  if (organisation.email === undefined || organisation.email === "") {
    return setError("Organisation email is required", "email");
  }
  if (!/\S+@\S+\.\S+/.test(organisation.email)) {
    return setError("Organisation email address is invalid", "email");
  }
  if (organisation.phone === undefined || organisation.phone === "") {
    return setError("Organisation phone number is required", "phone");
  }
  if (organisation.website === undefined || organisation.website === "") {
    return setError("Organisation website is required", "website");
  }
  if (organisation.logo === undefined || organisation.logo === "") {
    return setError("Organisation logo is required", "logo");
  }
  return setError("", "", false);
}

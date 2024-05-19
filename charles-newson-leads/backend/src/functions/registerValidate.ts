import RegisterError from "../interface/RegisterError";
import emailValidate from "./validations/email";
import passwordValidate from "./validations/password";
import usernameValidate from "./validations/username";

export default function registerValidate(
  username: string,
  email: string,
  password: string,
) {
  let errors:RegisterError = {
    username: "",
    email: "",
    password: "",
    name: "",
  };

  errors.username = usernameValidate(username).errors?.username || "";
  errors.email = emailValidate(email).errors?.email || "";
  errors.password = passwordValidate(password).errors?.password || "";
  

  if (
    (errors.username === undefined ||
    errors.username === "") &&      
    (errors.name === undefined ||
    errors.name === "") &&      
    (errors.email === undefined ||
    errors.email === "") &&     
    (errors.password === undefined ||
    errors.password === "")
  ) {
    return {};
  }

  return {
    errors:errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
}

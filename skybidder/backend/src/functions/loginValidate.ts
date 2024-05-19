import passwordValidate from "./validations/password";
import usernameValidate from "./validations/username";


export  default function loginValidate(username:string, password:string) {
    let errors = {
        username: "",
        password: ""
    };

    errors.username = usernameValidate(username).errors?.username || "";
    errors.password = passwordValidate(password).errors?.password || "";

    if (
        errors.username === undefined ||
        errors.username === "" ||
        errors.password === undefined ||
        errors.password === ""
    ) {
        return {};
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}